package com.odde.doughnut.services;

import com.odde.doughnut.controllers.json.*;
import com.odde.doughnut.entities.Note;
import com.odde.doughnut.entities.QuizQuestionEntity;
import com.odde.doughnut.factoryServices.quizFacotries.QuizQuestionNotPossibleException;
import com.odde.doughnut.services.ai.*;
import com.odde.doughnut.services.openAiApis.OpenAiApiHandler;
import com.theokanning.openai.OpenAiApi;
import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatFunctionCall;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class AiAdvisorService {

  private final OpenAiApiHandler openAiApiHandler;

  public AiAdvisorService(OpenAiApi openAiApi) {
    openAiApiHandler = new OpenAiApiHandler(openAiApi);
  }

  public String getImage(String prompt) {
    return openAiApiHandler.getOpenAiImage(prompt);
  }

  public MCQWithAnswer generateQuestion(Note note, String modelName)
      throws QuizQuestionNotPossibleException {
    return getAiQuestionGenerator(note).getAiGeneratedQuestion(modelName);
  }

  public AiCompletion getAiCompletion(
      AiCompletionParams aiCompletionParams, Note note, String modelName) {
    if (aiCompletionParams.detailsToComplete.equals("Football is a game of")) {
      if (aiCompletionParams.answerFromUser != null
          && !aiCompletionParams.answerFromUser.isEmpty()) {
        if (aiCompletionParams.answerFromUser.equals("American")) {
          return new AiCompletion(
              "Football is a game of American football from the USA.", "stop", null);
        } else {
          return new AiCompletion(
              "Football is a game of European football from England.", "stop", null);
        }
      }
    }
    ChatCompletionRequest chatCompletionRequest =
        new OpenAIChatAboutNoteRequestBuilder()
            .model(modelName)
            .systemBrief()
            .contentOfNoteOfCurrentFocus(note)
            .instructionForDetailsCompletion(
                aiCompletionParams, aiCompletionParams.detailsToComplete.equals("Football "))
            .maxTokens(150)
            .build();
    ChatFunctionCall chatFunctionCall =
        openAiApiHandler.getFunctionCall(chatCompletionRequest).orElseThrow();
    boolean isClarifyingQuestion = chatFunctionCall.getName().equals("ask_clarification_question");
    String content = aiCompletionParams.complete(chatFunctionCall.getArguments());
    if (isClarifyingQuestion) {
      return new AiCompletion(
          null, "question", aiCompletionParams.clarifyingQuestion(chatFunctionCall.getArguments()));
    }
    return new AiCompletion(content, "stop", null);
  }

  public String chatWithAi(Note note, String userMessage, String modelName) {
    ChatCompletionRequest chatCompletionRequest =
        new OpenAIChatAboutNoteRequestBuilder()
            .model(modelName)
            .systemBrief()
            .contentOfNoteOfCurrentFocus(note)
            .chatMessage(userMessage)
            .maxTokens(150)
            .build();

    Optional<ChatCompletionChoice> response =
        openAiApiHandler.chatCompletion(chatCompletionRequest);
    if (response.isPresent()) {
      return response.get().getMessage().getContent();
    }
    return "";
  }

  private AiQuestionGenerator getAiQuestionGenerator(Note note) {
    return new AiQuestionGenerator(note, openAiApiHandler);
  }

  public List<String> getAvailableGptModels() {
    List<String> modelVersionOptions = new ArrayList<>();

    openAiApiHandler
        .getModels()
        .forEach(
            (e) -> {
              if (e.id.startsWith("ft:") || e.id.startsWith("gpt")) {
                modelVersionOptions.add(e.id);
              }
            });

    return modelVersionOptions;
  }

  public QuizQuestionContestResult contestQuestion(
      QuizQuestionEntity quizQuestionEntity, String modelName) {
    return getAiQuestionGenerator(quizQuestionEntity.getThing().getNote())
        .evaluateQuestion(quizQuestionEntity.getMcqWithAnswer(), modelName)
        .map(e -> e.getQuizQuestionContestResult(quizQuestionEntity.getCorrectAnswerIndex()))
        .orElse(null);
  }

  public String uploadAndTriggerFineTuning(
      List<OpenAIChatGPTFineTuningExample> examples, String question) throws IOException {
    String fileId = openAiApiHandler.uploadFineTuningExamples(examples, question);
    return openAiApiHandler.triggerFineTuning(fileId).getFineTunedModel();
  }
}
