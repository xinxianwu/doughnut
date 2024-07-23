Feature: Get certificate by an assessment
  As a trainer, I want to provide certificate to the learner when they pass the assessment,
  so that they can use it to show their skill level on the topic.

  As a learner, I want to obtain a certificate when I pass the assessment.

  Background:
    Given I am logged in as an existing user
    And there is an assessment on nootbook "Countries" with 2 questions certified by "Korn"

  Scenario: As a learner, I receive a certificate when pass the assessment.
    When I get <score> percent score when do the assessment on "Countries"
    Then I should <receive or not> my certificate of "Countries" certified by "Korn"

    Examples:
      | score | receive or not | certified by |
      | 100   | receive        | Korn         |
      | 50    | not receive    | Mindo        |

  Scenario: As a learner, I receive Certification with correct expiration date
    Given The note owner sets the certificate expiration period for the "Countries" notebook to <expired days> days
    And today is "<today>"
    When I pass the assessment for the "Countries" notebook with score 80
    Then I should receive my "Countries" certificate with the issue date today and expiring on "<expiration date>"

    Examples:
      | today      | expired days | expiration date |
      | 2024-07-15 | 100          | 2024-10-23      |
      | 2024-01-01 | 80           | 2024-03-21      |
