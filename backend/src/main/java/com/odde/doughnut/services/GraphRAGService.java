package com.odde.doughnut.services;

import com.odde.doughnut.entities.Note;
import com.odde.doughnut.services.graphRAG.*;
import java.util.ArrayList;
import java.util.List;

public class GraphRAGService {
  public static final int RELATED_NOTE_DETAILS_TRUNCATE_LENGTH = 500;
  public static final double CHARACTERS_PER_TOKEN = 3.75;

  private final RelationshipHandler relationshipChain;
  private int remainingBudget;

  public GraphRAGService() {
    // Set up the chain in priority order
    ParentRelationshipHandler parentHandler = new ParentRelationshipHandler(this);
    ObjectRelationshipHandler objectHandler = new ObjectRelationshipHandler(this);
    ChildrenRelationshipHandler childrenHandler = new ChildrenRelationshipHandler(this);
    YoungerSiblingRelationshipHandler youngerSiblingHandler =
        new YoungerSiblingRelationshipHandler(this);

    parentHandler.setNext(objectHandler);
    objectHandler.setNext(childrenHandler);
    childrenHandler.setNext(youngerSiblingHandler);
    this.relationshipChain = parentHandler;
  }

  private int estimateTokens(Note note) {
    int detailsLength =
        note.getDetails() != null
            ? Math.min(note.getDetails().length(), RELATED_NOTE_DETAILS_TRUNCATE_LENGTH)
            : 0;
    int titleLength = note.getTopicConstructor().length();
    return (int) Math.ceil((detailsLength + titleLength) / CHARACTERS_PER_TOKEN);
  }

  public BareNote addNoteToRelatedNotes(
      List<BareNote> relatedNotes, Note note, RelationshipToFocusNote relationship) {
    int tokens = estimateTokens(note);
    if (tokens <= remainingBudget) {
      BareNote bareNote = BareNote.fromNote(note, relationship);
      relatedNotes.add(bareNote);
      remainingBudget -= tokens;
      return bareNote;
    }
    return null;
  }

  public GraphRAGResult retrieve(Note focusNote, int tokenBudgetForRelatedNotes) {
    remainingBudget = tokenBudgetForRelatedNotes;
    GraphRAGResult result = new GraphRAGResult();
    FocusNote focus = FocusNote.fromNote(focusNote);
    List<BareNote> relatedNotes = new ArrayList<>();

    relationshipChain.handle(focusNote, focus, relatedNotes);

    result.setFocusNote(focus);
    result.setRelatedNotes(relatedNotes);
    return result;
  }
}
