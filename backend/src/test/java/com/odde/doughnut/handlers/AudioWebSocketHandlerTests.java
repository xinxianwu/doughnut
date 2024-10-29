package com.odde.doughnut.handlers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.odde.doughnut.controllers.dto.AudioUploadDTO;
import com.odde.doughnut.services.ai.TextFromAudio;
import com.odde.doughnut.services.openAiApis.OpenAiApiExtended;
import com.odde.doughnut.testability.MakeMe;
import com.odde.doughnut.testability.OpenAIChatCompletionMock;
import io.reactivex.Single;
import java.io.IOException;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AudioWebSocketHandlerTests {

  @Autowired MakeMe makeMe;

  @Mock OpenAiApiExtended openAiApi;

  @Mock WebSocketSession session;

  private AudioWebSocketHandler handler;
  OpenAIChatCompletionMock openAIChatCompletionMock;
  ObjectMapper objectMapper;

  @BeforeEach
  void setup() {
    objectMapper = new ObjectMapper();
    handler = new AudioWebSocketHandler(openAiApi, makeMe.modelFactoryService, objectMapper);
    when(openAiApi.createTranscriptionSrt(any(RequestBody.class)))
        .thenReturn(Single.just(ResponseBody.create("test", null)));
    TextFromAudio completionMarkdownFromAudio = new TextFromAudio();
    completionMarkdownFromAudio.setCompletionMarkdownFromAudio("test123");
    openAIChatCompletionMock = new OpenAIChatCompletionMock(openAiApi);
    openAIChatCompletionMock.mockChatCompletionAndReturnToolCall(
        completionMarkdownFromAudio, "audio_transcription_to_text");
  }

  @Test
  void handleBinaryMessage_shouldSendTextMessageWhenTextFromAudioIsPresent() throws IOException {
    // Create a sample AudioUploadDTO
    AudioUploadDTO audioUploadDTO = new AudioUploadDTO();
    audioUploadDTO.setAudioData("test audio data".getBytes());
    audioUploadDTO.setPreviousNoteDetails("Previous note details");

    // Serialize the AudioUploadDTO to JSON
    byte[] jsonBytes = objectMapper.writeValueAsBytes(audioUploadDTO);
    BinaryMessage binaryMessage = new BinaryMessage(jsonBytes);

    TextFromAudio textFromAudio = new TextFromAudio();
    textFromAudio.setCompletionMarkdownFromAudio("Transcribed text");

    handler.handleBinaryMessage(session, binaryMessage);

    verify(session).sendMessage(any(TextMessage.class));
  }
}