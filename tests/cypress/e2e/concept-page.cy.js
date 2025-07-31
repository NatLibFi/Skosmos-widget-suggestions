describe('Concept page', () => {
  it('shows a clickable new link', () => {
    // Go to abstract objects concept page in YSO vocab
    cy.visit('/yso/en/page/p8318')
    // Find link for new suggestion form
    cy.get('#main-content .main-content-section #suggestion-plugin a').eq(1).as('new-link')
    // Check that link text is correct
    cy.get('@new-link').invoke('text').should('contain', 'Ehdota uutta käsitettä tähän sanastoon')
    // Click link
    cy.get('@new-link').click()
    // Check that form opens and has correct content
    cy.get('#suggestion-dialog-content').invoke('text').should('contain', 'New')
    // Check that url is updated
    cy.url().should('include', '/yso/en/page/p8318#suggestion')
  })

  it('shows a clickable change link', () => {
    // Go to abstract objects concept page in YSO vocab
    cy.visit('/yso/en/page/p8318')
    // Find link for change suggestion form
    cy.get('#main-content .main-content-section #suggestion-plugin a').first().as('change-link')
    // Check that link text is correct
    cy.get('@change-link').invoke('text').should('contain', 'Ehdota muutosta käsitteeseen')
    // Click link
    cy.get('@change-link').click()
    // Check that form opens and has correct content
    cy.get('#suggestion-dialog-content').invoke('text').should('contain', 'Change')
    // Check that url is updated
    cy.url().should('include', '/yso/en/page/p8318#suggestion')
  })

  it('has all correct change suggestion form fields', () => {

  })

  it('change suggestion dialog moves when dragging with mouse', () => {

  })
})
