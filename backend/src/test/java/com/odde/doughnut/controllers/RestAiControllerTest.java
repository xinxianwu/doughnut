package com.odde.doughnut.controllers;

import static com.odde.doughnut.services.ai.tools.AiToolFactory.COMPLETE_NOTE_DETAILS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import com.odde.doughnut.controllers.dto.AiAssistantResponse;
import com.odde.doughnut.controllers.dto.AiCompletionAnswerClarifyingQuestionParams;
import com.odde.doughnut.controllers.dto.AiCompletionParams;
import com.odde.doughnut.entities.*;
import com.odde.doughnut.models.UserModel;
import com.odde.doughnut.services.ConversationDetailService;
import com.odde.doughnut.services.GlobalSettingsService;
import com.odde.doughnut.services.ai.NoteDetailsCompletion;
import com.odde.doughnut.testability.MakeMe;
import com.odde.doughnut.testability.OpenAIAssistantMocker;
import com.odde.doughnut.testability.TestabilitySettings;
import com.theokanning.openai.OpenAiResponse;
import com.theokanning.openai.assistants.message.MessageRequest;
import com.theokanning.openai.assistants.run.RunCreateRequest;
import com.theokanning.openai.assistants.thread.ThreadRequest;
import com.theokanning.openai.client.OpenAiApi;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.image.Image;
import com.theokanning.openai.image.ImageResult;
import com.theokanning.openai.model.Model;
import io.reactivex.Single;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class RestAiControllerTest {
  RestAiController controller;
  UserModel currentUser;
  AssessmentQuestionInstance assessmentQuestionInstance;

  Note note;
  @Mock OpenAiApi openAiApi;
  @Autowired MakeMe makeMe;
  @Autowired ConversationDetailService conversationDetailService;
  TestabilitySettings testabilitySettings = new TestabilitySettings();

  @BeforeEach
  void Setup() {
    currentUser = makeMe.aUser().toModelPlease();
    note = makeMe.aNote().please();
    controller =
        new RestAiController(
            openAiApi,
            makeMe.modelFactoryService,
            conversationDetailService,
            currentUser,
            testabilitySettings);
  }

  @Nested
  class AutoCompleteNoteDetails {
    AiCompletionParams params = new AiCompletionParams();
    ArgumentCaptor<ChatCompletionRequest> captor =
        ArgumentCaptor.forClass(ChatCompletionRequest.class);
    OpenAIAssistantMocker openAIAssistantMocker;

    @BeforeEach
    void setup() {
      Note cosmos = makeMe.aNote("cosmos").please();
      Note solar = makeMe.aNote("solar system").under(cosmos).please();
      note = makeMe.aNote("Earth").under(solar).please();
      openAIAssistantMocker = new OpenAIAssistantMocker(openAiApi);
    }

    @Test
    void askWithNoteThatCannotAccess() {
      assertThrows(
          ResponseStatusException.class,
          () ->
              new RestAiController(
                      openAiApi,
                      makeMe.modelFactoryService,
                      conversationDetailService,
                      makeMe.aNullUserModelPlease(),
                      testabilitySettings)
                  .getCompletion(note, params));
    }

    @Nested
    class StartACompletionThread {
      @BeforeEach
      void setup() {
        openAIAssistantMocker
            .mockThreadCreation("this-thread")
            .mockCreateMessage()
            .mockCreateRunInProcess("my-run-id")
            .aRunThatRequireAction(new NoteDetailsCompletion("blue planet"), COMPLETE_NOTE_DETAILS)
            .mockRetrieveRun();
      }

      @Test
      void useTheCorrectAssistant() {
        new GlobalSettingsService(makeMe.modelFactoryService)
            .noteCompletionAssistantId()
            .setKeyValue(makeMe.aTimestamp().please(), "my-assistant-id");
        controller.getCompletion(note, params);
        ArgumentCaptor<RunCreateRequest> runRequest =
            ArgumentCaptor.forClass(RunCreateRequest.class);
        verify(openAiApi).createRun(any(), runRequest.capture());
        assertEquals("my-assistant-id", runRequest.getValue().getAssistantId());
      }

      @Test
      void mustCreateANewThreadIfNoThreadIDGiven() {
        AiAssistantResponse aiAssistantResponse = controller.getCompletion(note, params);
        assertEquals("this-thread", aiAssistantResponse.getThreadId());
        assertEquals("my-run-id", aiAssistantResponse.getRunId());
      }

      @Test
      void mustPutNoteInformInMessageWhenCreatethThread() {
        ArgumentCaptor<ThreadRequest> captor = ArgumentCaptor.forClass(ThreadRequest.class);
        controller.getCompletion(note, params);
        verify(openAiApi, times(1)).createThread(captor.capture());
        assertThat(captor.getAllValues().get(0).getMessages().getFirst().getContent().toString())
            .contains("cosmos › solar system");
      }

      @Test
      void mustCreateMessageToRequestCompletion() {
        ArgumentCaptor<MessageRequest> captor = ArgumentCaptor.forClass(MessageRequest.class);
        controller.getCompletion(note, params);
        verify(openAiApi, times(1)).createMessage(any(), captor.capture());
        assertThat(captor.getAllValues().get(0).getContent().toString())
            .contains(" \"details_to_complete\" : \"\"");
        assertThat(captor.getAllValues().get(0).getContent().toString())
            .contains("Don't make assumptions");
      }
    }

    @Nested
    class AnswerClarifyingQuestion {
      AiCompletionAnswerClarifyingQuestionParams params =
          new AiCompletionAnswerClarifyingQuestionParams();

      @BeforeEach
      void setup() {
        params.setThreadId("any-thread-id");
        Object result = new NoteDetailsCompletion("blue planet");
        openAIAssistantMocker
            .aCreatedRun("any-thread-id", "my-run-id")
            .aRunThatRequireAction(result, COMPLETE_NOTE_DETAILS)
            .mockSubmitOutput();
      }

      @Test
      void askCompletionAndUseStopResponse() {
        AiAssistantResponse aiAssistantResponse =
            controller.answerCompletionClarifyingQuestion(params);
        assertEquals("blue planet", aiAssistantResponse.getRequiredAction().getContentToAppend());
      }

      @Test
      void itMustPassTheThreadIdBack() {
        AiAssistantResponse aiAssistantResponse =
            controller.answerCompletionClarifyingQuestion(params);
        assertEquals("any-thread-id", aiAssistantResponse.getThreadId());
      }
    }
  }

  @Nested
  class GenerateImage {
    Note aNote;

    @BeforeEach
    void setup() {
      aNote = makeMe.aNote("sanskrit").creatorAndOwner(currentUser).please();
    }

    @Test
    void askWithNoteThatCannotAccess() {
      assertThrows(
          ResponseStatusException.class,
          () ->
              new RestAiController(
                      openAiApi,
                      makeMe.modelFactoryService,
                      conversationDetailService,
                      makeMe.aNullUserModelPlease(),
                      testabilitySettings)
                  .generateImage("create an image"));
    }

    @Test
    void askEngagingStoryWithRightPrompt() {
      when(openAiApi.createImage(
              argThat(
                  request -> {
                    assertEquals("create an image", request.getPrompt());
                    return true;
                  })))
          .thenReturn(buildImageResult("This is an engaging story."));
      controller.generateImage("create an image");
    }

    @Test
    void generateImage() {
      when(openAiApi.createImage(Mockito.any()))
          .thenReturn(buildImageResult("this is supposed to be a base64 image"));
      final String aiImage = controller.generateImage("create an image").b64encoded();
      assertEquals("this is supposed to be a base64 image", aiImage);
    }

    private Single<ImageResult> buildImageResult(String s) {
      ImageResult result = new ImageResult();
      Image image = new Image();
      image.setB64Json(s);
      result.setData(List.of(image));
      return Single.just(result);
    }
  }

  @Nested
  class GetModelVersions {

    @Test
    void shouldGetModelVersionsCorrectly() {
      List<Model> fakeModels = new ArrayList<>();
      Model model1 = new Model();
      model1.setId("gpt-4");
      fakeModels.add(model1);
      Model model2 = new Model();
      model2.setId("any-model");
      fakeModels.add(model2);
      OpenAiResponse<Model> fakeResponse = new OpenAiResponse<>();
      fakeResponse.setData(fakeModels);

      when(openAiApi.listModels()).thenReturn(Single.just(fakeResponse));
      assertThat(controller.getAvailableGptModels()).contains("gpt-4");
    }
  }

  @Nested
  class AiOpinionCompleteNoteDetails {
    AiCompletionParams params = new AiCompletionParams();
    ArgumentCaptor<ChatCompletionRequest> captor =
        ArgumentCaptor.forClass(ChatCompletionRequest.class);
    OpenAIAssistantMocker openAIAssistantMocker;

    @BeforeEach
    void setup() {
      Note cosmos = makeMe.aNote("cosmos").please();
      Note solar = makeMe.aNote("solar system").under(cosmos).please();
      note = makeMe.aNote("Earth").under(solar).please();
      openAIAssistantMocker = new OpenAIAssistantMocker(openAiApi);

      Notebook notebook = makeMe.aNotebook().please();
      AssessmentAttempt assessmentAttempt =
          makeMe.anAssessmentAttempt(notebook.getCreatorEntity()).withOneQuestion().please();
      assessmentQuestionInstance = assessmentAttempt.getAssessmentQuestionInstances().get(0);
    }

    @Nested
    class StartACompletionThread {
      @BeforeEach
      void setup() {
        openAIAssistantMocker
            .mockThreadCreation("this-thread")
            .mockCreateMessage()
            .mockCreateRunInProcess("my-run-id")
            .aRunThatCompleted()
            .mockRetrieveRun()
            .mockListMessages("mock answer from ai");
      }

      @Test
      void mustResponseAIOpinionWhenRequest() {
        new GlobalSettingsService(makeMe.modelFactoryService)
            .noteCompletionAssistantId()
            .setKeyValue(makeMe.aTimestamp().please(), "my-assistant-id");

        System.out.println(assessmentQuestionInstance);
        makeMe
            .aConversation()
            .forAnAssessmentQuestionInstance(assessmentQuestionInstance)
            .from(currentUser)
            .please();
        Conversation conversation =
            makeMe
                .aConversation()
                .forAnAssessmentQuestionInstance(assessmentQuestionInstance)
                .please();

        makeMe.aConversationDetail().forConversationInstance(conversation).please();
        ConversationDetail conversationDetail =
            controller.getCompletionAiOpinion(conversation.getId());
        assertNotNull(conversationDetail);

        assertNotNull(conversationDetail);
        assertNotNull(conversationDetail.getMessage());
        assertNotNull(conversationDetail.getConversation());
        assertNotNull(conversationDetail.getConversation().getMessage());
        System.out.println("conversationDetail: " + conversationDetail.getMessage());
        ArgumentCaptor<RunCreateRequest> runRequest =
            ArgumentCaptor.forClass(RunCreateRequest.class);
        verify(openAiApi).createRun(any(), runRequest.capture());
        assertEquals("my-assistant-id", runRequest.getValue().getAssistantId());
      }
    }
  }
}
