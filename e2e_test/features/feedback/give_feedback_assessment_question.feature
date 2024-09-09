Feature: Learner gives feedback on an assessment question
    As a learner, I want to give feedback on an assessment question

    Background:
        Given I am logged in as "old_learner"
        And there is a certified notebook "Just say 'Yes'" by "a_trainer" with 2 questions, shared to the Bazaar

    Scenario: I have the option to give feedback
        When I start the assessment on the "Just say 'Yes'" notebook in the bazaar
        And I answer the question wrongly
        And I submit my feedback: 'I think the question is wrong'
        Then "a_trainer" can see the feedback "\"I think the question is wrong\""
        And "a_trainer" can see name "Old Learner" in the conversation
        And "old_learner" can see name "A Trainer" in the conversation
