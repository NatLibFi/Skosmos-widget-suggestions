import { testBasicInput, testBasicTextarea, testTermInput } from '../support/form-field-tests'

describe('Vocab page', () => {
  it('shows a clickable new button', () => {
    // Go to YSO vocab home page
    cy.visit('/yso/en/')
    // Find button for new suggestion form
    cy.get('#main-content .main-content-section #suggestion-plugin a').first().as('new-button')
    // Check that button text is correct
    cy.get('@new-button').invoke('text').should('contain', 'Ehdota uutta käsitettä tähän sanastoon')
    // Click button
    cy.get('@new-button').click()
    // Check that form opens and has correct content
    cy.get('#suggestion-dialog-content').invoke('text').should('contain', 'Ehdota uutta käsitettä sanastoon ')
    // Check that url is updated
    cy.url().should('include', '/yso/en/#suggestion')
  })

  it('opens new suggestion form with suggestion url', () => {
    // Go to YSO vocab home suggestion page
    cy.visit('/yso/en/#suggestion')
    // Check that form opens and has correct content
    cy.get('#suggestion-dialog-content').invoke('text').should('contain', 'Ehdota uutta käsitettä sanastoon ')
  })

  it('YSO form has all correct fields', () => {
    // Go to YSO vocab home page
    cy.visit('/yso/en/')
    // Click the change link
    cy.get('#main-content .main-content-section #suggestion-plugin a').first().click()
    // Check that the correct vocab is selected
    cy.get('.suggestion-input-container').eq(0).find('input').eq(0).should('be.checked')
    cy.get('.suggestion-input-container').eq(1).find('input').eq(0).should('not.be.checked')
    // Check that term input fields are correct
    testTermInput('Termi suomeksi:', 1, 'fi', 'yso', 'kissa', 'test')
    testTermInput('Termi ruotsiksi:', 2, 'sv', 'yso', 'katt', 'test')
    testTermInput('Termi englanniksi:', 3, 'en', 'yso', 'cat', 'test')
    testTermInput('Termi pohjoissaameksi:', 4, 'se', 'yso', 'bussá', 'test')
    // Click submit button with empty fields
    cy.get('#suggestion-form-submit-button').click()
    // Check that fields are validated correctly
    cy.get('.suggestion-input-container').eq(1).find('.suggestion-error').should('be.visible')
    cy.get('.suggestion-input-container').eq(2).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(3).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(4).find('.suggestion-error').should('not.exist')
  })

  it('new suggestion dialog moves when dragging with mouse', () => {

  })
})
