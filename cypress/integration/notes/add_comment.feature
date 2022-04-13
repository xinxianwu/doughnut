Feature: Add Comment
  As a learner, I want to add comments on a note.

  Background:
    Given I've logged in as an existing user
    And there are some notes for the current user
      | title        |
      | Less is More |

  @featureToggle
  Scenario: Add a comment on a note:w
    When I visit note "Less is More"
    And I add a comment "hello world"
    Then I should see "hello world" in the page

