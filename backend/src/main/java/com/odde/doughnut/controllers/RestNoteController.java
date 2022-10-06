package com.odde.doughnut.controllers;

import com.odde.doughnut.entities.*;
import com.odde.doughnut.entities.Link.LinkType;
import com.odde.doughnut.entities.json.*;
import com.odde.doughnut.exceptions.NoAccessRightException;
import com.odde.doughnut.factoryServices.ModelFactoryService;
import com.odde.doughnut.models.NoteViewer;
import com.odde.doughnut.models.SearchTermModel;
import com.odde.doughnut.models.UserModel;
import com.odde.doughnut.services.HttpClientAdapter;
import com.odde.doughnut.services.WikidataService;
import com.odde.doughnut.testability.TestabilitySettings;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import javax.annotation.Resource;
import javax.validation.Valid;
import lombok.SneakyThrows;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
class RestNoteController {
  private final ModelFactoryService modelFactoryService;
  private UserModel currentUser;
  private HttpClientAdapter httpClientAdapter;

  @Resource(name = "testabilitySettings")
  private final TestabilitySettings testabilitySettings;

  public RestNoteController(
      ModelFactoryService modelFactoryService,
      UserModel currentUser,
      HttpClientAdapter httpClientAdapter,
      TestabilitySettings testabilitySettings) {
    this.modelFactoryService = modelFactoryService;
    this.currentUser = currentUser;
    this.httpClientAdapter = httpClientAdapter;
    this.testabilitySettings = testabilitySettings;
  }

  @PostMapping(value = "/{note}/updateWikidataId")
  @Transactional
  public NoteRealm updateWikidataId(
      @PathVariable(name = "note") Note note,
      @RequestBody WikidataAssociationCreation wikidataAssociationCreation)
      throws BindException, NoAccessRightException {
    currentUser.assertAuthorization(note);
    associateToWikidata(note, wikidataAssociationCreation.wikidataId);
    modelFactoryService.noteRepository.save(note);
    return new NoteViewer(currentUser.getEntity(), note).toJsonObject();
  }

  @PostMapping(value = "/{parentNote}/create")
  @Transactional
  public NoteRealmWithPosition createNote(
      @PathVariable(name = "parentNote") Note parentNote,
      @Valid @ModelAttribute NoteCreation noteCreation)
      throws NoAccessRightException, BindException, InterruptedException {
    currentUser.assertAuthorization(parentNote);
    User user = currentUser.getEntity();
    Timestamp currentUTCTimestamp = testabilitySettings.getCurrentUTCTimestamp();
    Note note = parentNote.buildChildNote(user, currentUTCTimestamp, noteCreation.textContent);
    Optional<String> authorId = associateToWikidata(note, noteCreation.wikidataId);
    note.buildLinkToParent(user, noteCreation.getLinkTypeToParent(), currentUTCTimestamp);
    modelFactoryService.noteRepository.save(note);
    authorId.ifPresent(id -> createAuthorNote(noteCreation, user, currentUTCTimestamp, note, id));

    return NoteRealmWithPosition.fromNote(note, user);
  }

  private void createAuthorNote(
      NoteCreation noteCreation,
      User user,
      Timestamp currentUTCTimestamp,
      Note note,
      String authorId) {
    Note childNote = note.buildChildNote(user, currentUTCTimestamp, noteCreation.textContent);
    associateToWikidata(childNote, authorId);
    childNote.buildLinkToParent(user, LinkType.AUTHOR_OF, currentUTCTimestamp);
    modelFactoryService.noteRepository.save(childNote);
  }

  @SneakyThrows
  private Optional<String> associateToWikidata(Note note, String wikidataId) {
    modelFactoryService.toNoteModel(note).associateWithWikidataId(wikidataId, getWikidataService());
    return getWikidataService().getAuthorQid(wikidataId);
  }

  @GetMapping("/{note}")
  public NoteRealmWithPosition show(@PathVariable("note") Note note) throws NoAccessRightException {
    currentUser.assertReadAuthorization(note);
    return NoteRealmWithPosition.fromNote(note, currentUser.getEntity());
  }

  @GetMapping("/{note}/overview")
  public NoteRealmWithAllDescendants showOverview(@PathVariable("note") Note note)
      throws NoAccessRightException {
    currentUser.assertReadAuthorization(note);
    return NoteRealmWithAllDescendants.fromNote(note, currentUser.getEntity());
  }

  @PatchMapping(path = "/{note}")
  @Transactional
  public NoteRealm updateNote(
      @PathVariable(name = "note") Note note,
      @Valid @ModelAttribute NoteAccessories noteAccessories)
      throws NoAccessRightException, IOException {
    currentUser.assertAuthorization(note);

    final User user = currentUser.getEntity();
    noteAccessories.setUpdatedAt(testabilitySettings.getCurrentUTCTimestamp());
    note.updateNoteContent(noteAccessories, user);
    modelFactoryService.noteRepository.save(note);
    return new NoteViewer(user, note).toJsonObject();
  }

  @GetMapping("/{note}/note-info")
  public NoteInfo getNoteInfo(@PathVariable("note") Note note) throws NoAccessRightException {
    currentUser.assertReadAuthorization(note);
    NoteInfo noteInfo = new NoteInfo();
    noteInfo.setReviewPoint(currentUser.getReviewPointFor(note));
    noteInfo.setNote(new NoteViewer(currentUser.getEntity(), note).toJsonObject());
    noteInfo.setCreatedAt(note.getThing().getCreatedAt());
    noteInfo.setReviewSetting(note.getMasterReviewSetting());
    return noteInfo;
  }

  @PostMapping("/search")
  @Transactional
  public List<Note> searchForLinkTarget(@Valid @RequestBody SearchTerm searchTerm) {
    SearchTermModel searchTermModel =
        modelFactoryService.toSearchTermModel(currentUser.getEntity(), searchTerm);
    return searchTermModel.searchForNotes();
  }

  @PostMapping(value = "/{note}/delete")
  @Transactional
  public List<NoteRealm> deleteNote(@PathVariable("note") Note note) throws NoAccessRightException {
    currentUser.assertAuthorization(note);
    modelFactoryService.toNoteModel(note).destroy(testabilitySettings.getCurrentUTCTimestamp());
    modelFactoryService.entityManager.flush();
    Note parentNote = note.getParentNote();
    if (parentNote != null) {
      return List.of(new NoteViewer(currentUser.getEntity(), parentNote).toJsonObject());
    }
    return List.of();
  }

  @PatchMapping(value = "/{note}/undo-delete")
  @Transactional
  public NoteRealm undoDeleteNote(@PathVariable("note") Note note) throws NoAccessRightException {
    currentUser.assertAuthorization(note);
    modelFactoryService.toNoteModel(note).restore();
    modelFactoryService.entityManager.flush();

    return new NoteViewer(currentUser.getEntity(), note).toJsonObject();
  }

  @GetMapping("/{note}/position")
  public NotePositionViewedByUser getPosition(Note note) throws NoAccessRightException {
    currentUser.assertAuthorization(note);
    return new NoteViewer(currentUser.getEntity(), note).jsonNotePosition();
  }

  @PostMapping(value = "/{note}/review-setting")
  @Transactional
  public RedirectToNoteResponse updateReviewSetting(
      @PathVariable("note") Note note, @Valid @RequestBody ReviewSetting reviewSetting)
      throws NoAccessRightException {
    currentUser.assertAuthorization(note);
    note.mergeMasterReviewSetting(reviewSetting);
    modelFactoryService.noteRepository.save(note);
    return new RedirectToNoteResponse(note.getId());
  }

  private WikidataService getWikidataService() {
    return new WikidataService(httpClientAdapter, testabilitySettings.getWikidataServiceUrl());
  }
}
