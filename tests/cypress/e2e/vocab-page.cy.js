import { testBasicInput, testTermInput, testRelationInput, testGroupInput, testExactMatchInput } from '../support/form-field-tests'

describe('Vocab page', () => {
  it('shows a clickable new button', () => {
    // Go to YSO vocab home page
    cy.visit('/yso/fi/')
    // Find button for new suggestion form
    cy.get('#main-content .main-content-section #suggestions a').first().as('new-button')
    // Check that button text is correct
    cy.get('@new-button').invoke('text').should('contain', 'Ehdota uutta käsitettä tähän sanastoon')
    // Click button
    cy.get('@new-button').click()
    // Check that focus is moved correctly
    cy.get('#suggestion-title').should('have.focus')
    // Check that form opens and has correct content
    cy.get('#suggestion-dialog-content').invoke('text').should('contain', 'Ehdota uutta käsitettä sanastoon')
    // Check that url is updated
    cy.url().should('include', '/yso/fi/#suggestion')
    // Close form
    cy.get('#suggestion-dialog-close i').click()
    // Check that form is not visible
    cy.get('.suggestion-dialog-modal').should('not.exist')
    // Check that url is updated
    cy.url().should('not.include', '#suggestion')
  })

  it('opens new suggestion form with suggestion url', () => {
    // Go to YSO vocab home suggestion page
    cy.visit('/yso/fi/#suggestion')
    // Check that form opens and has correct content
    cy.get('#suggestion-dialog-content').invoke('text').should('contain', 'Ehdota uutta käsitettä sanastoon')
  })

  it('has all correct fields in YSO form', () => {
    // Go to YSO vocab home page
    cy.visit('/yso/fi/')
    // Click the new link
    cy.get('#main-content .main-content-section #suggestions a').first().click()
    // Check that the correct vocab is selected
    cy.get('.suggestion-input-container').eq(0).find('input').eq(0).should('be.checked')
    cy.get('.suggestion-input-container').eq(1).find('input').eq(0).should('not.be.checked')
    // Check that term input fields are correct
    testTermInput('Termi suomeksi:', 1, 'fi', 'Termi löytyy jo YSOsta: ', 'kissa')
    testTermInput('Termi ruotsiksi:', 2, 'sv', 'Termi löytyy jo YSOsta: ', 'katt')
    testTermInput('Termi englanniksi:', 3, 'en', 'Termi löytyy jo YSOsta: ', 'cat')
    testTermInput('Termi pohjoissaameksi:', 4, 'se', 'Termi löytyy jo YSOsta: ', 'bussá')
    // Check that relation input fields are correct
    testRelationInput('Yläkäsite (LT):', 5, 'broader', 'kissa', 'kissa')
    testRelationInput('Alakäsitteet (ST):', 6, 'narrower', 'kissa', 'kissa')
    testRelationInput('Assosiatiiviset käsitteet (RT):', 7, 'associative', 'kissa', 'kissa')
    // Check that group input field is correct
    testGroupInput('YSOn temaattinen ryhmä:', 8)
    // Check that exact match input field is correct
    testExactMatchInput('Vastaava käsite muussa sanastossa (esim. LCSH, SAO, Wikipedia). Linkki käsitteeseen:', 9)
    // Check that explanation, needed for and organization fields are correct
    testBasicInput('Lisätietoa tai perusteluja ehdotukselle:', 10, true)
    testBasicInput('Minkä aineiston kuvailussa tarvitsit käsitettä? Julkaisun nimi, ISBN tai linkki: *', 11)
    testBasicInput('Ehdottajan organisaatio:', 12)
    // Click submit button with empty fields
    cy.get('#suggestion-form-submit button').click()
    // Check that focus is moved correctly
    cy.get('.suggestion-input-container').eq(1).find('.suggestion-error').should('have.focus')
    // Check that fields are validated correctly
    cy.get('.suggestion-input-container').eq(1).find('.suggestion-error').should('exist')
    cy.get('.suggestion-input-container').eq(2).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(3).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(4).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(5).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(6).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(7).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(8).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(9).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(10).find('.suggestion-error').should('not.exist')
    cy.get('.suggestion-input-container').eq(11).find('.suggestion-error').should('exist')
    cy.get('.suggestion-input-container').eq(12).find('.suggestion-error').should('not.exist')
    // Check that aria live message is updated correctly
    cy.get('#suggestion-aria-live').invoke('text').should('contain', 'Lomaketta ei lähetetty. 2 kentässä on virheitä.')
  })

  it ('submits form successfully with valid inputs', () => {
    // Go to YSO vocab home page
    cy.visit('/yso/fi/')
    // Click the new link
    cy.get('#main-content .main-content-section #suggestions a').first().click()

    // Fill out form with valid inputs
    cy.get('.suggestion-input-container').eq(1).find('#suggestion-preflabel-fi').type('test')
    cy.get('.suggestion-input-container').eq(1).find('#suggestion-preflabel-fi i.fa-spinner').should('not.exist', {timeout: 20000})
    cy.get('.suggestion-input-container').eq(11).find('#suggestion-needed-for').type('test')
    
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
    cy.wait('@submitRequest', { timeout: 20000 }).then(({ request, response }) => {
      const body = typeof response.body === 'string'
        ? JSON.parse(response.body)
        : response.body
      
      expect(request.method).to.eq('POST')
      
      expect(response?.statusCode).to.eq(200)
      expect(body).to.have.property('url', 'https://api.github.com/repos/test/yse-test/issues/x')
      expect(body).to.have.property('status', 201)
    })

    // Check success message
    cy.get('#suggestion-header').invoke('text').should('contain', 'Ehdotus lähetetty onnistuneesti')
    cy.get('#suggestion-subtitle a').invoke('attr', 'href').should('contain', 'https://github.com/test/yse-test/issues/x')
  })

  it('has a note about YSO meeting dates', () => {
    // Go to YSO vocab home page
    cy.visit('/yso/fi/')
    // Click the new link
    cy.get('#main-content .main-content-section #suggestions a').first().click()
    // Check that meeting info is in correct format
    const regex = /((0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[0-2])\.(\d{4})) mennessä tehdyt ehdotukset otetaan asialistalle ((0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[0-2])\.(\d{4})) sanastokokouksessa\./
    cy.get('#suggestion-meeting-info').invoke('text').should('match', regex)
  })

  it('new suggestion dialog moves when dragging with mouse', () => {

  })
})
