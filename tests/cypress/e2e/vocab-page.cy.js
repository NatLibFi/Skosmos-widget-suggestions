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
    cy.get('#suggestion-dialog-content').invoke('text').should('contain', 'Nw')
    // Check that url is updated
    cy.url().should('include', '/yso/en/#suggestion')
  })

  it('opens new suggestion form with suggestion url', () => {
    // Go to YSO vocab home suggestion page
    cy.visit('/yso/en/#suggestion')
    // Check that form opens and has correct content
    cy.get('#suggestion-dialog-content').invoke('text').should('contain', 'New')
  })

  it('has all correct suggestion form fields', () => {

  })

  it('new suggestion dialog moves when dragging with mouse', () => {

  })
})
