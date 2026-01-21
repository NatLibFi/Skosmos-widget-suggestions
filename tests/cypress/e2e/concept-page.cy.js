import { testBasicInput } from '../support/form-field-tests'

describe('Concept page', () => {
  it('shows a clickable new link', () => {
    // Go to abstract objects concept page in YSO vocab
    cy.visit('/yso/fi/page/p8318')
    // Find link for new suggestion form
    cy.get('#main-content .main-content-section #suggestions a').eq(1).as('new-link')
    // Check that link text is correct
    cy.get('@new-link').invoke('text').should('contain', 'Ehdota uutta käsitettä tähän sanastoon')
    // Click link
    cy.get('@new-link').click()
    // Check that form opens and has correct content
    cy.get('#suggestion-title').invoke('text').should('contain', 'Ehdota uutta käsitettä sanastoon')
    // Close form
    cy.get('#suggestion-dialog-close i').click()
    // Check that form is not visible
    cy.get('.suggestion-dialog-modal').should('not.exist')
    // Check that url is updated
    cy.url().should('not.include', '#suggestion')
  })

  it('shows a clickable change link', () => {
    // Go to abstract objects concept page in YSO vocab
    cy.visit('/yso/fi/page/p8318')
    // Find link for change suggestion form
    cy.get('#main-content .main-content-section #suggestions a').first().as('change-link')
    // Check that link text is correct
    cy.get('@change-link').invoke('text').should('contain', 'Ehdota muutosta käsitteeseen')
    // Click link
    cy.get('@change-link').click()
    // Check that form opens and has correct title
    cy.get('#suggestion-title').invoke('text').should('contain', 'Ehdota muutosta käsitteeseen abstraktit objektit')
  })

  it('has all correct change form fields', () => {
    // Go to abstract objects concept page in YSO vocab
    cy.visit('/yso/fi/page/p8318')
    // Click the change link
    cy.get('#main-content .main-content-section #suggestions a').first().click()
    // Check that form fields are correct
    testBasicInput('Ehdotettu muutos: *', 0, true)
    testBasicInput('Lisätietoa tai perusteluja ehdotukselle:', 1, true)
    testBasicInput('Ehdottajan organisaatio:', 2)
    // Click submit button with empty fields and check that it is disabled
    cy.get('#suggestion-form-submit button').should('have.class', 'disabled')
    cy.get('#suggestion-form-submit button').click()
    // Check that fields are validated correctly
    cy.get('.suggestion-input-container').eq(0).find('.suggestion-error').should('be.visible')
    cy.get('.suggestion-input-container').eq(1).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(2).find('.suggestion-error').should('not.exist')
    
  })

  it('submits form successfully with valid inputs', () => {
    // Go to abstract objects concept page in YSO vocab
    cy.visit('/yso/fi/page/p8318')
    // Click the change link
    cy.get('#main-content .main-content-section #suggestions a').first().click()

    // Check that submit button is not disabled with valid inputs
    cy.get('.suggestion-input-container').eq(0).find('textarea').type('test')
    cy.get('#suggestion-form-submit button').should('not.have.class', 'disabled')

    // Intercept submit
    cy.intercept(
      {
        method: 'POST',
        url: '**/plugins/suggestions/gh_prx.php*',
      },
      {
        statusCode: 200,
        headers: { 'content-type': 'text/html' },
        body: {
          "status": 201,
          "url": "https://api.github.com/repos/test/yse-test/issues/x"
        },
      }
    ).as('submitRequest')

    // Click submit button to submit form
    cy.get('#suggestion-form-submit button').click()

    // Check request and response
    cy.wait('@submitRequest').then(({ request, response }) => {
      const body = typeof response.body === 'string'
        ? JSON.parse(response.body)
        : response.body
      
      expect(request.method).to.eq('POST')
      
      expect(response?.statusCode).to.eq(200)
      expect(body).to.have.property('url', 'https://api.github.com/repos/test/yse-test/issues/x')
      expect(body).to.have.property('status', 201)
    })

    // Check that success message is displayed
    cy.get('#suggestion-header').invoke('text').should('contain', 'Ehdotus lähetetty onnistuneesti')
    cy.get('#suggestion-subtitle a').invoke('attr', 'href').should('contain', 'https://github.com/test/yse-test/issues/x')
  })

  it('change suggestion dialog moves when dragging with mouse', () => {
    
  })
})
