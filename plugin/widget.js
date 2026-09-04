const SUGGESTION_PLUGIN = {
  vueApp: null,
  render: function (params) {
    const mountPoint = document.getElementById('suggestions')
    if (mountPoint) {
      // Unmount the Vue app if it exists
      if (this.vueApp) {
        this.vueApp.unmount()
      }
      // Remove the old mount point div
      mountPoint.remove()
    }

    // Create a new mount point div for the Vue app
    const newMountPoint = document.createElement('div')
    newMountPoint.id = 'suggestions'
    newMountPoint.classList = params.pageType === 'vocab-home' ? 'mt-lg-0 mt-4' : 'row property'

    // Create/find parent element and add the mount point to it as a child
    let parentElement
    if (params.pageType === 'vocab-home') {
      // Create a new div as parent element
      parentElement = document.createElement('div')
      parentElement.id = 'suggestion-heading-wrapper'
      parentElement.classList = 'd-lg-flex align-items-lg-center justify-content-lg-between'

      // Modify vocab heading margins/padding and move it inside the new parent element
      headingElement = document.getElementById('vocab-heading')
      headingElement.classList = 'm-0 pb-0'
      headingElement.remove()
      parentElement.appendChild(headingElement)

      // Add the parent element to the beginning of main content
      document.querySelector('.main-content-section').prepend(parentElement)
    } else {
      parentElement = document.getElementById('concept-heading').parentElement
    }
    parentElement.appendChild(newMountPoint)

    // Create a new Vue app instance and mount it to the new mount point
    this.vueApp = this.createVueApp(params) // createVueApp defined in vue-app.js
    this.vueApp.mount('#suggestions')
  },
  remove: function () {
    if (this.vueApp) {
      this.vueApp.unmount()
      this.vueApp = null
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  window.suggestionCallback = function (params) {
    if (params.pageType === 'concept' || params.pageType === 'vocab-home') {
      SUGGESTION_PLUGIN.render(params)
    } else {
      SUGGESTION_PLUGIN.remove()
    }
  }
})
