package com.odde.doughnut.controllers;

import com.odde.doughnut.controllers.dto.AnswerDTO;
import com.odde.doughnut.controllers.dto.QuestionSuggestionCreationParams;
import com.odde.doughnut.controllers.dto.QuizQuestionContestResult;
import com.odde.doughnut.entities.*;
import com.odde.doughnut.exceptions.UnexpectedNoAccessRightException;
import com.odde.doughnut.factoryServices.ModelFactoryService;
import com.odde.doughnut.models.AnswerModel;
import com.odde.doughnut.models.UserModel;
import com.odde.doughnut.services.GlobalSettingsService;
import com.odde.doughnut.services.QuizQuestionService;
import com.odde.doughnut.services.ai.AiQuestionGenerator;
import com.odde.doughnut.testability.TestabilitySettings;
import com.theokanning.openai.client.OpenAiApi;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz-questions")
class RestQuizQuestionController {
  private final ModelFactoryService modelFactoryService;
  private final QuizQuestionService quizQuestionService;

  private final UserModel currentUser;

  @Resource(name = "testabilitySettings")
  private final TestabilitySettings testabilitySettings;

  private final AiQuestionGenerator aiQuestionGenerator;

  public RestQuizQuestionController(
      @Qualifier("testableOpenAiApi") OpenAiApi openAiApi,
      ModelFactoryService modelFactoryService,
      UserModel currentUser,
      TestabilitySettings testabilitySettings) {
    this.modelFactoryService = modelFactoryService;
    this.currentUser = currentUser;
    this.testabilitySettings = testabilitySettings;
    this.aiQuestionGenerator =
        new AiQuestionGenerator(openAiApi, new GlobalSettingsService(modelFactoryService));
    this.quizQuestionService = new QuizQuestionService(openAiApi, modelFactoryService);
  }

  @PostMapping("/generate-question")
  @Transactional
  public ReviewQuestionInstance generateQuestion(
      @RequestParam(value = "note") @Schema(type = "integer") Note note) {
    currentUser.assertLoggedIn();
    PredefinedQuestion question = quizQuestionService.generateQuestionForNote(note);
    if (question == null) {
      return null;
    }
    return modelFactoryService.createQuizQuestion(question);
  }

  @PostMapping("/{reviewQuestionInstance}/regenerate")
  @Transactional
  public ReviewQuestionInstance regenerate(
      @PathVariable("reviewQuestionInstance") @Schema(type = "integer")
          ReviewQuestionInstance reviewQuestionInstance) {
    currentUser.assertLoggedIn();
    PredefinedQuestion question =
        quizQuestionService.generateQuestionForNote(
            reviewQuestionInstance.getPredefinedQuestion().getNote());
    if (question == null) {
      return null;
    }
    return modelFactoryService.createQuizQuestion(question);
  }

  @PostMapping("/generate-question-without-save")
  public PredefinedQuestion generateAIQuestionWithoutSave(
      @RequestParam(value = "note") @Schema(type = "integer") Note note) {
    currentUser.assertLoggedIn();
    return quizQuestionService.generateMcqWithAnswer(note);
  }

  @PostMapping("/{reviewQuestionInstance}/contest")
  @Transactional
  public QuizQuestionContestResult contest(
      @PathVariable("reviewQuestionInstance") @Schema(type = "integer")
          ReviewQuestionInstance reviewQuestionInstance) {
    currentUser.assertLoggedIn();
    return aiQuestionGenerator.getQuizQuestionContestResult(
        reviewQuestionInstance.getPredefinedQuestion());
  }

  @PostMapping("/{reviewQuestionInstance}/answer")
  @Transactional
  public AnsweredQuestion answerQuiz(
      @PathVariable("reviewQuestionInstance") @Schema(type = "integer")
          ReviewQuestionInstance reviewQuestionInstance,
      @Valid @RequestBody AnswerDTO answerDTO) {
    currentUser.assertLoggedIn();
    Answer answer = new Answer();
    answer.setReviewQuestionInstance(reviewQuestionInstance);
    answer.setFromDTO(answerDTO);
    AnswerModel answerModel = modelFactoryService.toAnswerModel(answer);
    answerModel.makeAnswerToQuestion(
        testabilitySettings.getCurrentUTCTimestamp(), currentUser.getEntity());
    return answerModel.getAnswerViewedByUser(currentUser.getEntity());
  }

  @PostMapping("/{reviewQuestionInstance}/suggest-fine-tuning")
  @Transactional
  public SuggestedQuestionForFineTuning suggestQuestionForFineTuning(
      @PathVariable("reviewQuestionInstance") @Schema(type = "integer")
          PredefinedQuestion predefinedQuestion,
      @Valid @RequestBody QuestionSuggestionCreationParams suggestion) {
    SuggestedQuestionForFineTuning sqft = new SuggestedQuestionForFineTuning();
    var suggestedQuestionForFineTuningService =
        modelFactoryService.toSuggestedQuestionForFineTuningService(sqft);
    return suggestedQuestionForFineTuningService.suggestQuestionForFineTuning(
        predefinedQuestion,
        suggestion,
        currentUser.getEntity(),
        testabilitySettings.getCurrentUTCTimestamp());
  }

  @GetMapping("/{note}/note-questions")
  public List<PredefinedQuestion> getAllQuestionByNote(
      @PathVariable("note") @Schema(type = "integer") Note note)
      throws UnexpectedNoAccessRightException {
    currentUser.assertAuthorization(note);
    return note.getPredefinedQuestions().stream().toList();
  }

  @PostMapping("/{note}/note-questions")
  @Transactional
  public PredefinedQuestion addQuestionManually(
      @PathVariable("note") @Schema(type = "integer") Note note,
      @Valid @RequestBody PredefinedQuestion predefinedQuestion)
      throws UnexpectedNoAccessRightException {
    currentUser.assertAuthorization(note);
    return quizQuestionService.addQuestion(note, predefinedQuestion);
  }

  @PostMapping("/{note}/refine-question")
  @Transactional
  public PredefinedQuestion refineQuestion(
      @PathVariable("note") @Schema(type = "integer") Note note,
      @RequestBody PredefinedQuestion predefinedQuestion)
      throws UnexpectedNoAccessRightException {
    currentUser.assertAuthorization(note);
    return quizQuestionService.refineQuestion(note, predefinedQuestion);
  }

  @PostMapping("/{reviewQuestionInstance}/toggle-approval")
  @Transactional
  public PredefinedQuestion toggleApproval(
      @PathVariable("reviewQuestionInstance") @Schema(type = "integer")
          PredefinedQuestion predefinedQuestion)
      throws UnexpectedNoAccessRightException {
    currentUser.assertAuthorization(predefinedQuestion.getNote());
    return quizQuestionService.toggleApproval(predefinedQuestion);
  }
}
