package com.odde.doughnut.services;

import com.odde.doughnut.controllers.dto.AnswerDTO;
import com.odde.doughnut.controllers.dto.ReviewQuestionContestResult;
import com.odde.doughnut.entities.*;
import com.odde.doughnut.factoryServices.ModelFactoryService;
import com.odde.doughnut.models.Randomizer;
import com.theokanning.openai.client.OpenAiApi;
import java.sql.Timestamp;

public class ReviewService {
  private final PredefinedQuestionService predefinedQuestionService;
  private final ModelFactoryService modelFactoryService;

  public ReviewService(
      OpenAiApi openAiApi, ModelFactoryService modelFactoryService, Randomizer randomizer) {
    this.modelFactoryService = modelFactoryService;
    this.predefinedQuestionService =
        new PredefinedQuestionService(openAiApi, modelFactoryService, randomizer);
  }

  public ReviewQuestionInstance generateAQuestionOfRandomType(Note note, User user) {
    PredefinedQuestion question =
        predefinedQuestionService.generateAQuestionOfRandomType(note, user);
    if (question == null) {
      return null;
    }
    return modelFactoryService.createReviewQuestion(question);
  }

  public ReviewQuestionContestResult contest(ReviewQuestionInstance reviewQuestionInstance) {
    return predefinedQuestionService.contest(reviewQuestionInstance.getPredefinedQuestion());
  }

  public AnsweredQuestion answerQuestion(
      ReviewQuestionInstance reviewQuestionInstance,
      AnswerDTO answerDTO,
      User user,
      Timestamp currentUTCTimestamp) {
    return modelFactoryService
        .createAnswerForQuestion(reviewQuestionInstance, answerDTO, user, currentUTCTimestamp)
        .getAnswerViewedByUser(user);
  }
}