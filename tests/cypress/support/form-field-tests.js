export const testBasicInput = (label, i) => {
  // Find correct input container
  cy.get('#suggestion-dialog-content .suggestion-input-container').eq(i).as('container')
  // Check label
  cy.get('@container').find('.suggestion-input-label').invoke('text').should('contain', label)
  // Check clearing input
  cy.get('@container').find('input').type('test')
  cy.get('@container').find('input').should('have.value', 'test')
  cy.get('@container').find('.suggestion-clear-input i').click()
  cy.get('@container').find('input').should('have.value', '')
}

export const testBasicTextarea = (label, i) => {
  // Find correct input container
  cy.get('#suggestion-dialog-content .suggestion-input-container').eq(i).as('container')
  // Check label
  cy.get('@container').find('.suggestion-input-label').invoke('text').should('contain', label)
  // Check clearing textarea
  cy.get('@container').find('textarea').type('test')
  cy.get('@container').find('textarea').should('have.value', 'test')
  cy.get('@container').find('.suggestion-clear-input i').click()
  cy.get('@container').find('textarea').should('have.value', '')
}

export const testTermInput = (label, i, lang, vocab, text) => {
  // Find correct input container
  cy.get('#suggestion-dialog-content .suggestion-input-container').eq(i).as('container')
  // Check label
  cy.get('@container').find('.suggestion-input-label').invoke('text').should('contain', label)
  // Check inputting existing concept
  cy.get('@container').find(`#suggestion-preflabel-${lang}`).type(text)
  cy.get('@container').find('.suggestion-existing-concept').invoke('text').should('contain', `Termi löytyy jo ${vocab}: ${text}`)
  // Check clearing prefLabel
  cy.get('@container').find('#suggestion-preflabel-' + lang).should('have.value', text)
  cy.get('@container').find('.suggestion-clear-input i').eq(0).click()
  cy.get('@container').find('#suggestion-preflabel-' + lang).should('have.value', '')
  cy.get('@container').find('.suggestion-existing-concept').should('not.exist')
  // Check adding and removing altlabel inputs
  cy.get('@container').find(`#suggestion-altlabel-${lang}-1`).should('not.exist')
  cy.get('@container').find(`#suggestion-altlabel-${lang}-0`).type('test')
  cy.get('@container').find(`#suggestion-altlabel-${lang}-1`).should('exist')
  cy.get('@container').find('.suggestion-clear-input i').eq(1).click()
  cy.get('@container').find(`#suggestion-altlabel-${lang}-1`).should('not.exist')
  // Check clearing altLabel
  cy.get('@container').find('.suggestion-clear-input i').eq(0).click()
  cy.get('@container').find(`#suggestion-altlabel-${lang}-0`).should('have.value', '')
}
