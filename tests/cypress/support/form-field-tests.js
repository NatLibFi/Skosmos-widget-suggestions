export const testBasicInput = (label, i, text) => {
  // Find correct input container
  cy.get('#suggestion-dialog-content .suggestion-input-container').eq(i).as('container')
  // Check label
  cy.get('@container').find('.suggestion-input-label').invoke('text').should('contain', label)
  // Check clearing input
  cy.get('@container').find('input').type('test')
  cy.get('@container').find('input').should('have.value', 'test')
  cy.get('@container').find('.suggestion-clear-input i').click()
  cy.get('@container').find('input').should('have.value', '')
  // Type final text in
  if (text) {
    cy.get('@container').find('input').type(text)
  }
}

export const testBasicTextarea = (label, i, text) => {
  // Find correct input container
  cy.get('#suggestion-dialog-content .suggestion-input-container').eq(i).as('container')
  // Check label
  cy.get('@container').find('.suggestion-input-label').invoke('text').should('contain', label)
  // Check clearing textarea
  cy.get('@container').find('textarea').type('test')
  cy.get('@container').find('textarea').should('have.value', 'test')
  cy.get('@container').find('.suggestion-clear-input i').click()
  cy.get('@container').find('textarea').should('have.value', '')
  // Type final text in
  if (text) {
    cy.get('@container').find('textarea').type(text)
  }
}
