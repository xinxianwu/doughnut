package com.odde.doughnut.services.graphRAG;

import com.odde.doughnut.entities.Note;
import lombok.Getter;

public abstract class RelationshipHandler {
  @Getter protected final RelationshipToFocusNote relationshipToFocusNote;
  protected final Note relatingNote;

  protected RelationshipHandler(
      RelationshipToFocusNote relationshipToFocusNote, Note relatingNote) {
    this.relationshipToFocusNote = relationshipToFocusNote;
    this.relatingNote = relatingNote;
  }

  public abstract Note handle();

  public void afterHandledSuccessfully(FocusNote focusNote, BareNote addedNote) {}
}