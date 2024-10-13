package com.odde.doughnut.services;

import com.odde.doughnut.entities.AssessmentQuestionInstance;
import com.odde.doughnut.entities.Conversation;
import com.odde.doughnut.entities.ConversationMessage;
import com.odde.doughnut.entities.User;
import com.odde.doughnut.factoryServices.ModelFactoryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ConversationService {

  private final ModelFactoryService modelFactoryService;

  public Conversation startConversation(
      AssessmentQuestionInstance assessmentQuestionInstance, User initiator, String feedback) {
    Conversation conversation = new Conversation();
    conversation.setAssessmentQuestionInstance(assessmentQuestionInstance);
    conversation.setConversationInitiator(initiator);
    conversation.setMessage(feedback);
    modelFactoryService.conversationRepository.save(conversation);
    return conversation;
  }

  public List<Conversation> conversationRelatedToUser(User user) {
    return modelFactoryService.conversationRepository
        .findByUserInSubjectOwnershipOrConversationInitiator(user);
  }

  public ConversationMessage addConversationDetail(
      Conversation conversation, User user, String message) {
    ConversationMessage conversationMessage = new ConversationMessage();
    conversationMessage.setConversation(conversation);
    conversationMessage.setConversationDetailInitiator(user);
    conversationMessage.setMessage(message);
    return modelFactoryService.conversationDetailRepository.save(conversationMessage);
  }

  public List<ConversationMessage> getConversionDetailRelatedByConversationId(int conversationId) {
    return modelFactoryService.conversationDetailRepository.findByConversationInitiator(
        conversationId);
  }
}
