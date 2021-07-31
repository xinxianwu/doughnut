package com.odde.doughnut.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import static com.odde.doughnut.entities.QuizQuestion.QuestionType.*;

public class AnswerResult {
    @Getter
    @Setter
    String answer;

    @Getter
    @Setter
    Note answerNote;

    @Getter
    @Setter @JsonIgnore
    ReviewPoint reviewPoint;

    @Getter
    @Setter
    QuizQuestion.QuestionType questionType;

    public String getAnswerDisplay() {
        if (answerNote != null) {
            return answerNote.getTitle();
        }
        return answer;
    }

    public boolean isCorrect() {
        if (questionType == LINK_SOURCE_EXCLUSIVE || questionType == FROM_DIFFERENT_PART_AS) {
            return !matchAnswer(reviewPoint.getLink().getSourceNote()) && reviewPoint.getLink().getCousinOfSameLinkType(reviewPoint.getUser()).stream()
                    .noneMatch(this::matchAnswer);
        }
        if (questionType == FROM_SAME_PART_AS) {
            return reviewPoint.getLink().getCousinOfSameLinkType(reviewPoint.getUser()).stream()
                    .anyMatch(this::matchAnswer);
        }
        return matchAnswer(getCorrectAnswerNote());
    }

    private Note getCorrectAnswerNote() {
        if (questionType == LINK_TARGET || questionType == CLOZE_LINK_TARGET || questionType == DESCRIPTION_LINK_TARGET) {
            return reviewPoint.getLink().getTargetNote();
        }
        if (questionType == WHICH_SPEC_HAS_INSTANCE || questionType == LINK_SOURCE) {
            return reviewPoint.getLink().getSourceNote();
        }
        return reviewPoint.getNote();
    }

    private boolean matchAnswer(Note correctAnswerNote) {
        if (answerNote != null) {
            return correctAnswerNote.equals(answerNote);
        }

        return correctAnswerNote.getNoteContent().getNoteTitle().matches(answer);
    }

}
