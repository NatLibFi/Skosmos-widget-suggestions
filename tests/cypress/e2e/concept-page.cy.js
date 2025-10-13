import { testBasicInput, testBasicTextarea } from '../support/form-field-tests'

describe('Concept page', () => {
  it('shows a clickable new link', () => {
    // Go to abstract objects concept page in YSO vocab
    cy.visit('/yso/fi/page/p8318')
    // Find link for new suggestion form
    cy.get('#main-content .main-content-section #suggestion-plugin a').eq(1).as('new-link')
    // Check that link text is correct
    cy.get('@new-link').invoke('text').should('contain', 'Ehdota uutta käsitettä tähän sanastoon')
    // Click link
    cy.get('@new-link').click()
    // Check that form opens and has correct content
    cy.get('#suggestion-title').invoke('text').should('contain', 'Ehdota uutta käsitettä sanastoon')
    // Check that url is updated
    cy.url().should('include', '/yso/fi/page/p8318#suggestion')
  })

  it('shows a clickable change link', () => {
    // Go to abstract objects concept page in YSO vocab
    cy.visit('/yso/fi/page/p8318')
    // Find link for change suggestion form
    cy.get('#main-content .main-content-section #suggestion-plugin a').first().as('change-link')
    // Check that link text is correct
    cy.get('@change-link').invoke('text').should('contain', 'Ehdota muutosta käsitteeseen')
    // Click link
    cy.get('@change-link').click()
    // Check that form opens and has correct title
    cy.get('#suggestion-title').invoke('text').should('contain', 'Ehdota muutosta käsitteeseen abstraktit objektit')
    // Check that url is updated
    cy.url().should('include', '/yso/fi/page/p8318#suggestion')
  })

  it('has all correct change form fields', () => {
    // Go to abstract objects concept page in YSO vocab
    cy.visit('/yso/fi/page/p8318')
    // Click the change link
    cy.get('#main-content .main-content-section #suggestion-plugin a').first().click()
    // Check that form fields are correct
    testBasicTextarea('Ehdotettu muutos: *', 0)
    testBasicTextarea('Lisätietoa tai perusteluja ehdotukselle:', 1)
    testBasicInput('Ehdottajan organisaatio:', 2)
    // Click submit button with empty fields and check that it is disabled
    cy.get('#suggestion-form-submit button').should('have.class', 'disabled')
    cy.get('#suggestion-form-submit button').click()
    // Check that fields are validated correctly
    cy.get('.suggestion-input-container').eq(0).find('.suggestion-error').should('be.visible')
    cy.get('.suggestion-input-container').eq(1).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(2).find('.suggestion-error').should('not.exist')
    // Check that submit button is not disabled with valid inputs
    cy.get('.suggestion-input-container').eq(0).find('textarea').type('test')
    cy.get('#suggestion-form-submit button').should('not.have.class', 'disabled')
  })

  it('change suggestion dialog moves when dragging with mouse', () => {
    
  })
})
