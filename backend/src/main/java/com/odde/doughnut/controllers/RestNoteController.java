
package com.odde.doughnut.controllers;

import com.odde.doughnut.controllers.currentUser.CurrentUserFetcher;
import com.odde.doughnut.entities.*;
import com.odde.doughnut.entities.json.NoteViewedByUser;
import com.odde.doughnut.entities.json.NotesBulk;
import com.odde.doughnut.entities.json.RedirectToNoteResponse;
import com.odde.doughnut.exceptions.NoAccessRightException;
import com.odde.doughnut.factoryServices.ModelFactoryService;
import com.odde.doughnut.models.NoteViewer;
import com.odde.doughnut.models.UserModel;
import com.odde.doughnut.testability.TestabilitySettings;
import lombok.Getter;
import lombok.Setter;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
class RestNoteController {
    private final ModelFactoryService modelFactoryService;
    private final CurrentUserFetcher currentUserFetcher;
    @Resource(name = "testabilitySettings")
    private final TestabilitySettings testabilitySettings;

    public RestNoteController(ModelFactoryService modelFactoryService, CurrentUserFetcher currentUserFetcher, TestabilitySettings testabilitySettings) {
        this.modelFactoryService = modelFactoryService;
        this.currentUserFetcher = currentUserFetcher;
        this.testabilitySettings = testabilitySettings;
    }

    class NoteStatistics {
        @Getter
        @Setter
        private ReviewPoint reviewPoint;
        @Getter
        @Setter
        private Note note;

    }

    static class NoteCreation {
        @Getter
        @Setter
        private Integer linkTypeToParent;
        @Getter
        @Setter
        @Valid
        @NotNull
        private NoteContent noteContent = new NoteContent();
    }

    @PostMapping(value = "/{parentNote}/create")
    @Transactional
    public NotesBulk createNote(@PathVariable(name = "parentNote") Note parentNote, @Valid @ModelAttribute NoteCreation noteCreation) throws NoAccessRightException {
        final UserModel userModel = currentUserFetcher.getUser();
        userModel.getAuthorization().assertAuthorization(parentNote);
        User user = userModel.getEntity();
        Note note = Note.createNote(user, noteCreation.getNoteContent(), testabilitySettings.getCurrentUTCTimestamp());
        note.setParentNote(parentNote);
        modelFactoryService.noteRepository.save(note);
        if (noteCreation.getLinkTypeToParent() != null) {
            Link link = new Link();
            link.setUser(user);
            link.setSourceNote(note);
            link.setTargetNote(parentNote);
            link.setTypeId(noteCreation.getLinkTypeToParent());
            modelFactoryService.linkRepository.save(link);
        }
        return NotesBulk.jsonNoteWithChildren(parentNote, userModel);
    }

    @GetMapping("/{note}")
    public NotesBulk show(@PathVariable("note") Note note) throws NoAccessRightException {
        final UserModel user = currentUserFetcher.getUser();
        user.getAuthorization().assertReadAuthorization(note);

        return NotesBulk.jsonNoteWithChildren(note, user);
    }

    @GetMapping("/{note}/overview")
    public NotesBulk showOverview(@PathVariable("note") Note note) throws NoAccessRightException {
        final UserModel user = currentUserFetcher.getUser();
        user.getAuthorization().assertReadAuthorization(note);

        return NotesBulk.jsonNoteWitheDescendants(note, user);
    }

    @PostMapping(path = "/{note}")
    @Transactional
    public NoteViewedByUser updateNote(@PathVariable(name = "note") Note note, @Valid @ModelAttribute NoteContent noteContent) throws NoAccessRightException, IOException {
        final UserModel user = currentUserFetcher.getUser();
        user.getAuthorization().assertAuthorization(note);

        Optional<Note> noteOld = modelFactoryService.findNoteById(note.getId());

        Long oldVersion = noteOld.get().getNoteContent().getVersion();

        if (noteOld.isPresent() && noteContent.getVersion() != null) {
            Assert.isTrue((oldVersion == null) || (noteContent.getVersion() >= oldVersion), "Failed!. Conflicting edit have been made to the same note");
        }

        noteContent.setVersion(oldVersion + 1);
        noteContent.setUpdatedAt(testabilitySettings.getCurrentUTCTimestamp());
        note.updateNoteContent(noteContent, user.getEntity());
        modelFactoryService.noteRepository.save(note);
        return new NoteViewer(user.getEntity(), note).toJsonObject();
    }

    @GetMapping("/{note}/statistics")
    public NoteStatistics statistics(@PathVariable("note") Note note) throws NoAccessRightException {
        final UserModel user = currentUserFetcher.getUser();
        user.getAuthorization().assertReadAuthorization(note);
        NoteStatistics statistics = new NoteStatistics();
        statistics.setReviewPoint(user.getReviewPointFor(note));
        statistics.setNote(note);
        return statistics;
    }

    @PostMapping("/{note}/search")
    @Transactional
    public List<Note> searchForLinkTarget(@PathVariable("note") Note note, @Valid @RequestBody SearchTerm searchTerm) {
        return currentUserFetcher.getUser().getLinkableNotes(note, searchTerm);
    }

    @PostMapping(value = "/{note}/delete")
    // @Transactional   // for some reason we don't understand yet, the @Transactional seems try to trigger
                        // note to delete the NoteClosures via note.children.
                        // But NoteClosure is managed by note.descendantNCs.
    public Integer deleteNote(@PathVariable("note") Note note) throws NoAccessRightException {
        currentUserFetcher.getUser().getAuthorization().assertAuthorization(note);
        modelFactoryService.toNoteModel(note).destroy();
        return note.getId();
    }

    @GetMapping("/{note}/review-setting")
    public ReviewSetting editReviewSetting(Note note) {
        ReviewSetting reviewSetting = note.getMasterReviewSetting();
        if (reviewSetting == null) {
            reviewSetting = new ReviewSetting();
        }
        return reviewSetting;
    }

    @PostMapping(value = "/{note}/review-setting")
    @Transactional
    public RedirectToNoteResponse updateReviewSetting(@PathVariable("note") Note note, @Valid @RequestBody ReviewSetting reviewSetting) throws NoAccessRightException {
        currentUserFetcher.getUser().getAuthorization().assertAuthorization(note);
        note.mergeMasterReviewSetting(reviewSetting);
        modelFactoryService.noteRepository.save(note);
        return new RedirectToNoteResponse(note.getId());
    }

    @PostMapping(value = "/{note}/split")
    @Transactional
    public NotesBulk splitNote(@PathVariable("note") Note note) throws NoAccessRightException {
        final UserModel userModel = currentUserFetcher.getUser();
        userModel.getAuthorization().assertAuthorization(note);

        note.extractChildNotes(userModel.getEntity(), testabilitySettings.getCurrentUTCTimestamp())
            .forEach(childNote -> modelFactoryService.noteRepository.save(childNote));

        note.getNoteContent().setDescription("");
        modelFactoryService.noteRepository.save(note);

        return NotesBulk.jsonNoteWithChildren(note, userModel);
    }

}
