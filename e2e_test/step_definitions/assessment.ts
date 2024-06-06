import { Then, When } from "@badeball/cypress-cucumber-preprocessor"
import "../support/string_util"

When("I start the assessment on the {string} notebook", (notebook: string) => {
  cy.contains(notebook).parents(".card").findByTitle("Start Assessment").click()
})

Then("I answer the question {string} with {string}", function (stem: string, answer: string) {
  cy.findByRole("question")
  cy.findByText(stem)
  cy.findByText(answer).click()
})