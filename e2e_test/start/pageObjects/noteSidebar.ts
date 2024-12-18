export const noteSidebar = () => {
  cy.findByRole('button', { name: 'toggle sidebar' }).click()
  cy.get('aside').should('exist')

  return {
    expand: (noteTopology: string) => {
      cy.get('aside').within(() => {
        cy.findByText(noteTopology)
          .parent()
          .parent()
          .within(() => {
            cy.findByTitle('expand children').click()
          })
      })
    },
    siblingOrder: (higher: string, lower: string) => {
      cy.get('aside').within(() => {
        cy.contains(higher).parent().parent().nextAll().contains(lower)
      })
    },
    expectOrderedNotes(expectedNotes: Record<string, string>[]) {
      cy.pageIsNotLoading()
      cy.get('aside ul li .card-title').then(($els) => {
        const actualNotes = Array.from($els, (el) => el.innerText)
        const expectedNoteTopics = expectedNotes.map(
          (note) => note['note-title']
        )

        // Check both length and order
        expect(actualNotes.length, 'Number of notes should match').to.equal(
          expectedNoteTopics.length
        )

        // Check each note is in the correct position
        actualNotes.forEach((actualNote, index) => {
          expect(actualNote, `Note at position ${index + 1}`).to.equal(
            expectedNoteTopics[index]
          )
        })
      })
    },
  }
}
