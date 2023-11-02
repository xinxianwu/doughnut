/// <reference types="cypress" />
/// <reference types="../support" />
// @ts-check

import { Given, Then, DataTable, When } from "@badeball/cypress-cucumber-preprocessor"
import "../support/string.extensions"
import start, { mock_services } from "start"
import { MessageToMatch } from "start/mock_services/MessageToMatch"

Given("open AI service always think the system token is invalid", () => {
  mock_services.openAi().alwaysResponseAsUnauthorized()
})

Then("I should be prompted with an error message saying {string}", (errorMessage: string) => {
  cy.expectFieldErrorMessage("Prompt", errorMessage)
})

Given("OpenAI by default returns text completion {string}", (details: string) => {
  cy.then(async () => {
    await mock_services.openAi().restartImposter()
    mock_services.openAi().stubChatCompletion(details, "stop")
  })
})

Given(
  "OpenAI completes with {string} for context containing {string}",
  (returnMessage: string, context: string) => {
    mock_services.openAi().mockChatCompletionWithContext(returnMessage, context)
  },
)

Given(
  "OpenAI completes with {string} for messages containing:",
  (returnMessage: string, data: DataTable) => {
    const messages: MessageToMatch[] = data.hashes().map((row) => {
      return {
        role: row["role"],
        content: row["content"],
      } as MessageToMatch
    })
    mock_services.openAi().mockChatCompletionWithMessages(returnMessage, messages)
  },
)

Given(
  "OpenAI completes with {string} for assistant message {string}",
  (returnMessage: string, incompleteAssistantMessage: string) => {
    mock_services
      .openAi()
      .mockChatCompletionWithIncompleteAssistantMessage(
        incompleteAssistantMessage,
        returnMessage,
        "stop",
      )
  },
)

Given("OpenAI always return image of a moon", () => {
  mock_services.openAi().stubCreateImage()
})

Given(
  "OpenAI returns an incomplete text completion {string} for assistant message {string}",
  (details: string, assistantMessage: string) => {
    mock_services
      .openAi()
      .mockChatCompletionWithIncompleteAssistantMessage(assistantMessage, details, "length")
  },
)

Given("An OpenAI response is unavailable", () => {
  mock_services.openAi().stubOpenAiCompletionWithErrorResponse()
})

Given("OpenAI now generates this question:", (questionTable: DataTable) => {
  start.questionGenerationService().resetAndStubAskingMCQ(questionTable.hashes()[0])
})

Given("OpenAI evaluates the question as legitamate", () => {
  start
    .questionGenerationService()
    .stubEvaluationQuestion({ feasibleQuestion: true, correctChoices: [0] })
})

Given("OpenAI evaluates the question as not legitamate", () => {
  start.questionGenerationService().stubEvaluationQuestion({
    feasibleQuestion: false,
    correctChoices: [0],
    comment: "AI plainly doesn't like it.",
  })
})

Then("I contest the question", () => {
  cy.findByRole("button", { name: "Doesn't make sense?" }).click()
})

Given('there is a fine-tuning file "question_gerenation_examples" on my OpenAI account', () => {
  mock_services.openAi().stubListFiles()
})

Given(
  'the finetuning for the file "question_generation_examples" will be successful',
  (API_Response: string) => {},
)

When("I retrieve file list from my openAI account", () => {
  cy.findByText("Retrieve").click()
})

Then("I will see a list of files", () => {
  cy.get("#list > option").should("have.length", 1)
})

When('I choose the file "question generation examples"', () => {})
When('I train model with "question generation examples" data based on GPT3.5 model', () => {})

Then("I will see success message {string}", (expectedMessage: string) => {
  cy.findByText(expectedMessage)
})
