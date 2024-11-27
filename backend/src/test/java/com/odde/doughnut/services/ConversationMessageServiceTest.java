package com.odde.doughnut.services;

import static org.junit.jupiter.api.Assertions.*;

import com.odde.doughnut.controllers.dto.Randomization;
import com.odde.doughnut.entities.*;
import com.odde.doughnut.factoryServices.ModelFactoryService;
import com.odde.doughnut.models.UserModel;
import com.odde.doughnut.testability.MakeMe;
import com.odde.doughnut.testability.TestabilitySettings;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ConversationMessageServiceTest {
  @Autowired ModelFactoryService modelFactoryService;
  @Autowired MakeMe makeMe;
  private ConversationService conversationService;
  private AssessmentService assessmentService;
  private UserModel currentUser;
  private final TestabilitySettings testabilitySettings = new TestabilitySettings();

  @BeforeEach
  void setup() {
    conversationService = new ConversationService(testabilitySettings, this.modelFactoryService);
    testabilitySettings.timeTravelTo(makeMe.aTimestamp().please());
    currentUser = makeMe.aUser().toModelPlease();
    assessmentService = new AssessmentService(makeMe.modelFactoryService, testabilitySettings);
  }

  @Nested
  class conversationActionTest {

    private Notebook notebook;
    private Note topNote;

    @BeforeEach
    void setup() {
      testabilitySettings.setRandomization(new Randomization(Randomization.RandomStrategy.seed, 1));
      topNote = makeMe.aHeadNote("OnlineAssessment").creatorAndOwner(currentUser).please();
      notebook = topNote.getNotebook();
      notebook.getNotebookSettings().setNumberOfQuestionsInAssessment(1);
    }

    AssessmentAttempt createAssessmentAttempt() {
      makeMe
          .theNote(topNote)
          .withNChildrenThat(1, noteBuilder -> noteBuilder.hasApprovedQuestions(10))
          .please();
      return assessmentService.generateAssessment(notebook, currentUser.getEntity());
    }

    @Test
    void shouldAddConversationDetail() {
      Conversation conversation = getConversation();
      String message = "This feedback is wrong";
      ConversationMessage conversationMessage =
          conversationService.addMessageToConversation(
              conversation, currentUser.getEntity(), message);
      assertEquals(message, conversationMessage.getMessage());
    }

    @Test
    void shouldReturnListConversationDetail() {
      Conversation conversation = getConversation();
      String message = "This feedback is wrong";
      conversationService.addMessageToConversation(conversation, currentUser.getEntity(), message);
      makeMe.refresh(conversation);
      List<ConversationMessage> conversationMessages = conversation.getConversationMessages();
      assertEquals(1, conversationMessages.size());
      assertEquals(message, conversationMessages.getFirst().getMessage());
    }

    private Conversation getConversation() {
      AssessmentAttempt assessmentAttempt = createAssessmentAttempt();
      AssessmentQuestionInstance assessmentQuestionInstance =
          assessmentAttempt.getAssessmentQuestionInstances().getFirst();
      return makeMe
          .aConversation()
          .forAnAssessmentQuestionInstance(assessmentQuestionInstance)
          .from(currentUser)
          .please();
    }
  }

  @Nested
  class ReviewQuestionConversationTest {
    private ReviewQuestionInstance reviewQuestionInstance;
    private Note note;

    @BeforeEach
    void setup() {
      note = makeMe.aNote().creatorAndOwner(currentUser).please();
      reviewQuestionInstance =
          makeMe.aReviewQuestionInstance().spellingQuestionOf(note).answerChoiceIndex(1).please();
    }

    @Test
    void shouldCreateConversationWithInitialSystemMessage() {
      Conversation conversation =
          conversationService.startConversationAboutReviewQuestion(
              reviewQuestionInstance, currentUser.getEntity());

      makeMe.refresh(conversation);
      List<ConversationMessage> messages = conversation.getConversationMessages();

      assertEquals(1, messages.size());
      ConversationMessage systemMessage = messages.getFirst();
      assertNull(systemMessage.getSender()); // System message has null sender

      String messageContent = systemMessage.getMessage();
      assertTrue(messageContent.contains("\"question\""));
      assertTrue(messageContent.contains("\"userAnswer\""));
      assertTrue(messageContent.contains("\"isCorrect\""));
    }

    @Test
    void shouldSetCorrectOwnershipAndSubject() {
      Conversation conversation =
          conversationService.startConversationAboutReviewQuestion(
              reviewQuestionInstance, currentUser.getEntity());

      makeMe.refresh(conversation);
      assertEquals(reviewQuestionInstance, conversation.getSubject().getReviewQuestionInstance());
      assertEquals(note.getNotebook().getOwnership(), conversation.getSubjectOwnership());
      assertEquals(currentUser.getEntity(), conversation.getConversationInitiator());
    }
  }
}
