Feature: link note
    As a learner, I want to maintain my newly acquired knowledge in
    notes that linking to each other, so that I can review them in the
    future.

    Background:
        Given I've logged in as an existing user
        And there are some notes for the current user
            | title           | description            |
            | Sedition        | Incite violence        |
            | Sedation        | Put to sleep           |
            | Sedative        | Sleep medicine         |

    Scenario: View all linkable notes for a note when no link exists
        When I am creating link for note "Sedition"
        And I should see the source note as "Sedition"
        And I should see "Sedation, Sedative" as targets only

    Scenario Outline: Search note for linking with partial input
        Given I am creating link for note "Sedition"
        When I search for notes with title "<search key>"
        And I should see "<targets>" as targets only
      Examples:
        | search key |  targets           |
        | Sed        | Sedation, Sedative |
        | Sedatio    | Sedation           |

    Scenario: linkable notes should not include notes already linked
        Given I link note "Sedition" as "belongs to" note "Sedation"
        When I am creating link for note "Sedition"
        And I should see "Sedative" as targets only

    Scenario: links should show in the view
        When I link note "Sedition" as "is similar to" note "Sedation"
        And I link note "Sedition" as "is similar to" note "Sedative"
        Then I should see "Sedition" has link "is similar to" "Sedation, Sedative"
        When I open link "Sedation"
        Then I should be able to change the link to "belongs to"
        And I should be able to delete the link to note "Sedation"
