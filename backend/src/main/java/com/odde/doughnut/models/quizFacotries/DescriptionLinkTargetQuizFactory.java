package com.odde.doughnut.models.quizFacotries;

import com.odde.doughnut.algorithms.ClozeDescription;
import com.odde.doughnut.entities.ReviewPoint;
import com.odde.doughnut.models.UserModel;
import org.apache.logging.log4j.util.Strings;

import java.util.Collections;
import java.util.List;

public class DescriptionLinkTargetQuizFactory extends LinkTargetQuizFactory {

    public DescriptionLinkTargetQuizFactory(ReviewPoint reviewPoint) {
        super(reviewPoint);
    }

    @Override
    public String generateInstruction() {
        String clozeDescription = ClozeDescription.htmlClosedDescription().getClozeDescription(answerNote.getNoteTitle(), getSourceDescription());
        return "<p>The following descriptions is " + link.getLinkTypeLabel() + ":</p>" + "<pre style='white-space: pre-wrap;'>" + clozeDescription + "</pre> " ;
    }

    private String getSourceDescription() {
        return link.getSourceNote().getClozeDescription();
    }

    @Override
    public boolean isValidQuestion() {
        return super.isValidQuestion() && Strings.isNotEmpty(getSourceDescription());
    }

    @Override
    public List<ReviewPoint> getViceReviewPoints(UserModel userModel) {
        ReviewPoint reviewPointFor = userModel.getReviewPointFor(link.getSourceNote());
        if(reviewPointFor != null) return List.of(reviewPointFor);
        return Collections.emptyList();
    }

}