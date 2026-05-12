export const testBasicInput = (label, i, isTextarea=false) => {
  // Find correct input container
  cy.get('#suggestion-dialog-content .suggestion-input-container').eq(i).as('container')
  // Check label
  cy.get('@container').find('.suggestion-input-label').invoke('text').should('contain', label)
  // Check clearing input
  const inputClass = isTextarea ? 'textarea' : 'input'
  cy.get('@container').find(inputClass).type('test')
  cy.get('@container').find(inputClass).should('have.value', 'test')
  cy.get('@container').find('.suggestion-clear-input i').click()
  cy.get('@container').find(inputClass).should('have.value', '')
}

export const testTermInput = (label, i, lang, foundInVocab, text) => {
  // Find correct input container
  cy.get('#suggestion-dialog-content .suggestion-input-container').eq(i).as('container')
  // Check label
  cy.get('@container').find('.suggestion-input-label').invoke('text').should('contain', label)
  // Check inputting existing concept
  cy.get('@container').find(`#suggestion-preflabel-${lang}`).type(text)
  cy.get('@container').find('.suggestion-clear-input i.fa-spinner').should('not.exist', {timeout: 20000})
  cy.get('@container').find('.suggestion-error').invoke('text').should('contain', foundInVocab + text)
  // Check clearing prefLabel
  cy.get('@container').find('#suggestion-preflabel-' + lang).should('have.value', text)
  cy.get('@container').find('.suggestion-clear-input i').eq(0).click()
  cy.get('@container').find('#suggestion-preflabel-' + lang).should('have.value', '')
  cy.get('@container').find('.suggestion-error').should('not.exist')
  // Check adding and removing altLabel inputs
  cy.get('@container').find(`#suggestion-altlabel-${lang}-1`).should('not.exist')
  cy.get('@container').find(`#suggestion-altlabel-${lang}-0`).type('test')
  cy.get('@container').find(`#suggestion-altlabel-${lang}-1`).should('exist')
  cy.get('@container').find('.suggestion-clear-input i').eq(1).click()
  cy.get('@container').find(`#suggestion-altlabel-${lang}-1`).should('not.exist')
  // Check clearing altLabel
  cy.get('@container').find('.suggestion-clear-input i').eq(0).click()
  cy.get('@container').find(`#suggestion-altlabel-${lang}-0`).should('have.value', '')
  cy.get('@container').find(`#suggestion-altlabel-${lang}-1`).should('not.exist')
}

export const testRelationInput = (label, i, type, text, result) => {
  // Find correct input container
  cy.get('#suggestion-dialog-content .suggestion-input-container').eq(i).as('container')
  // Check label
  cy.get('@container').find('.suggestion-input-label').invoke('text').should('contain', label)
  // Check inputting existing concept
  cy.get('@container').find(`#suggestion-${type}`).click().type(text)
  cy.get('@container').find('.suggestion-clear-input i.fa-spinner').should('not.exist', {timeout: 20000})
  cy.get('@container').find('.dropdown-menu').should('have.class', 'show')
  cy.get('@container').find('.dropdown-menu .dropdown-item').eq(0).invoke('text').should('contain', result)
  // Check adding and removing concepts from chip list
  cy.get('@container').find('.dropdown-menu .dropdown-item').eq(0).click()
  cy.get('@container').find('.suggestion-chip-list .suggestion-chip').invoke('text').should('contain', result)
  cy.get('@container').find('.suggestion-chip-list .suggestion-chip').click()
  cy.get('@container').find('.suggestion-chip-list').should('not.exist')
}

export const testGroupInput = (label, i) => {
  // Find correct input container
  cy.get('#suggestion-dialog-content .suggestion-input-container').eq(i).as('container')
  // Check label
  cy.get('@container').find('.suggestion-input-label').invoke('text').should('contain', label)
  // Check opening group list
  cy.get('@container').find('#suggestion-group-button').click()
  cy.get('@container').find('.dropdown-menu').should('have.class', 'show')
  cy.get('@container').find('.dropdown-menu .dropdown-item').should('have.length', 61)
  cy.get('@container').find('.dropdown-menu .dropdown-item').eq(0).invoke('text').should('contain', '00 Yleistermit')
  // Check adding and removing groups from chip list
  cy.get('@container').find('.dropdown-menu .dropdown-item').eq(0).click()
  cy.get('@container').find('.suggestion-chip-list .suggestion-chip').invoke('text').should('contain', '00 Yleistermit')
  cy.get('@container').find('.suggestion-chip-list .suggestion-chip').click()
  cy.get('@container').find('.suggestion-chip-list').should('not.exist')
  cy.get('@container').find('.dropdown-menu .dropdown-item').eq(0).invoke('text').should('contain', '00 Yleistermit')
}

export const testExactMatchInput = (label, i) => {
  // Find correct input container
  cy.get('#suggestion-dialog-content .suggestion-input-container').eq(i).as('container')
  // Check label
  cy.get('@container').find('.suggestion-input-label').invoke('text').should('contain', label)
  // Check adding and removing link inputs
  cy.get('@container').find('#suggestion-match-input-1').should('not.exist')
  cy.get('@container').find('#suggestion-match-input-0').type('test')
  cy.get('@container').find('#suggestion-match-input-1').should('exist')
  cy.get('@container').find('.suggestion-clear-input i').eq(1).click()
  cy.get('@container').find('#suggestion-match-input-1').should('not.exist')
  // Check clearing first link input
  cy.get('@container').find('.suggestion-clear-input i').eq(0).click()
  cy.get('@container').find('#suggestion-match-input-0').should('have.value', '')
  cy.get('@container').find('#suggestion-match-input-1').should('not.exist')
}
