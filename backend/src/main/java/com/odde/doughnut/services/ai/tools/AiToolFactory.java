package com.odde.doughnut.services.ai.tools;

import static com.odde.doughnut.services.ai.tools.AiToolName.ASK_SINGLE_ANSWER_MULTIPLE_CHOICE_QUESTION;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.odde.doughnut.services.ai.*;
import com.theokanning.openai.function.FunctionDefinition;
import java.util.List;

public class AiToolFactory {

  public static AiTool askSingleAnswerMultipleChoiceQuestion() {
    return new AiTool(
        ASK_SINGLE_ANSWER_MULTIPLE_CHOICE_QUESTION.getValue(),
        "Ask a single-answer multiple-choice question to the user",
        MCQWithAnswer.class);
  }

  public static AiToolList mcqWithAnswerAiTool() {
    return new AiToolList(
        """
        Please act as a Question Designer, testing my memory, mastery and understanding of my focus note.
        My notes are atomic pieces of knowledge organized hierarchically and can include reifications to form lateral links.
        Your task is to create a memory-stimulating question by adhering to these guidelines:

        1. **Focus on the Focus Note**: Formulate one question EXCLUSIVELY around the focus note (its title / subject-predicate-object and details).
        2. **Leverage the Extended Graph**:
           - Use other focus note info and related notes to enrich the question formulation.
           - Avoid accidental bias by ensuring the focus note isn’t falsely assumed to be the sole specialization of a general concept.
           - Related notes often serve as excellent distractor choices for the MCQs. But avoid more than 1 correct answers.
        3. **Context Visibility**:
           - Avoid explicitly mentioning the focus note title in stem
           - Focus note can appear in the choices when necessary.
        4. **Generate Multiple-Choice Questions (MCQs)**:
           - Provide 2 to 3 options, with ONLY one correct answer.
           - Vary the length of answer choices to avoid patterns where the correct answer is consistently the longest.
           - Use markdown for both the question stem and the answer choices.
        6. **Ensure Question Self-Sufficiency**:
           - Ensure the question provides all necessary context within the stem and choices.
           - Avoid vague phrasing like "this X" or "the following X" unless the X is explicitly defined in the stem or choices.
           - IMPORTANT: Avoid using "this note"!!! User won't know which note you are referring to.
        7. **Empty Stems When Necessary**: Leave the question stem empty if there’s insufficient information to create a meaningful question.
        8. **Make sure correct choice index is accurate**:
           - The correct choice is also exclusive, and plausible.
           - Ensure distractor choices are logical but clearly incorrect (without needing to be obvious).
        9. **Output Handling**:
           - MUST provide the question via the function `%s`. If question generation fails, still output using this function.
           - Create only one question and make only one call to the function.

      """
            .formatted(ASK_SINGLE_ANSWER_MULTIPLE_CHOICE_QUESTION.getValue()),
        List.of(askSingleAnswerMultipleChoiceQuestion().getFunctionDefinition()));
  }

  public static AiToolList questionEvaluationAiTool(MCQWithAnswer question) {
    MultipleChoicesQuestion mcq = question.getMultipleChoicesQuestion();

    String messageBody =
        """
Please assume the role of a learner, who has learned the note of focus as well as many other notes.
Only the top-level of the contextual path is visible to you.
Without the specific note of focus and its more detailed contexts revealed to you,
please critically check if the following question makes sense and is possible to you:

%s

"""
            .formatted(new ObjectMapper().valueToTree(mcq).toString());

    return new AiToolList(
        messageBody,
        List.of(
            FunctionDefinition.<QuestionEvaluation>builder()
                .name("evaluate_question")
                .description("answer and evaluate the feasibility of the question")
                .parametersDefinitionByClass(QuestionEvaluation.class)
                .build()));
  }

  public static AiToolList questionRefineAiTool(MCQWithAnswer question) {
    MultipleChoicesQuestion mcq = question.getMultipleChoicesQuestion();

    String messageBody =
        """
Please assume the role of a Memory Assistant, which involves helping me review, recall, and reinforce information from my notes. As a Memory Assistant, focus on creating exercises that stimulate memory and comprehension. Please adhere to the following guidelines:

      1. Review the below MCQ which is based on the note in the current contextual path, the MCQ could be incomplete or incorrect.
      2. Only the top-level of the contextual path is visible to the user.
      3. Provide 2 to 4 choices with only 1 correct answer.
      4. Vary the lengths of the choice texts so that the correct answer isn't consistently the longest.
      5. Provide a better question based on my question and the note. Please correct any grammar.

      Note: The specific note of focus and its more detailed contexts are not known. Focus on memory reinforcement and recall across various subjects.
%s

"""
            .formatted(new ObjectMapper().valueToTree(mcq).toString());

    return new AiToolList(
        messageBody,
        List.of(
            FunctionDefinition.<MCQWithAnswer>builder()
                .name("refine_question")
                .description("refine the question")
                .parametersDefinitionByClass(MCQWithAnswer.class)
                .build()));
  }

  public static AiToolList transcriptionToTextAiTool(String transcriptionFromAudio) {
    return new AiToolList(
        """
            You are a helpful assistant for converting audio transcription in SRT format to text of paragraphs. Your task is to convert the following audio transcription to text with meaningful punctuations and paragraphs.
             * fix obvious audio transcription mistakes.
             * Do not translate the text to another language (unless asked to).
             * If the transcription is not clear, leave the text as it is.
             * Don't add any additional information than what is in the transcription.
             * the completionMarkdownFromAudio is to be appended after the previousTrailingNoteDetails, so add necessary white space or new line at the beginning to connect to existing text.
             * The context should be in markdown format.

             Here's the transcription from audio:
             ------------
            """
            + transcriptionFromAudio,
        List.of(
            FunctionDefinition.<TextFromAudio>builder()
                .name("audio_transcription_to_text")
                .description("Convert audio transcription to text")
                .parametersDefinitionByClass(TextFromAudio.class)
                .build()));
  }

  public static List<AiTool> getAllAssistantTools() {
    return List.of(
        completeNoteDetails(), suggestNoteTitle(), askSingleAnswerMultipleChoiceQuestion());
  }

  public static AiTool suggestNoteTitle() {
    return new AiTool(
        AiToolName.SUGGEST_NOTE_TITLE.getValue(),
        "Generate a concise and accurate note title based on the note content and pass it to the function for the use to update their note. The title should be a single word, a phrase or at most a single sentence that captures the atomic concept of the note. It should be specific within the note's contextual path and do not need to include general information that's already in the contextual path. Keep the existing title if it's already correct and concise.",
        TitleReplacement.class);
  }

  public static AiTool completeNoteDetails() {
    return new AiTool(
        AiToolName.COMPLETE_NOTE_DETAILS.getValue(),
        "Text completion for the details of the note of focus",
        NoteDetailsCompletion.class);
  }
}
