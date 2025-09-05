const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9090/',
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        }
      })
    },
    supportFile: false,
    specPattern: [
      'tests/cypress/e2e/**/*.cy.js'
    ],
    screenshotsFolder: 'tests/cypress/screenshots',
    videosFolder: 'tests/cypress/videos'
  },
});
