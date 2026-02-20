const SUGGESTION_PLUGIN = {
  vueApp: null,
  render: function(params) {
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
    newMountPoint.classList = 'row py-3'

    // Find parent element and add the mount point to it as a child
    let parentElement
    if (params.pageType === 'vocab-home') {
      parentElement = document.getElementById('vocab-download-links').parentElement
    } else {
      parentElement = document.getElementById('concept-heading').parentElement
    }
    parentElement.appendChild(newMountPoint)
  
    // Create a new Vue app instance and mount it to the new mount point
    this.vueApp = this.createVueApp(params) // createVueApp defined in vue-app.js
    this.vueApp.mount('#suggestions')
  },
  remove: function() {
    if (this.vueApp) {
      this.vueApp.unmount()
      this.vueApp = null
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  window.suggestionCallback = function(params) {
    if (params.pageType === 'concept' || params.pageType === 'vocab-home') {
      SUGGESTION_PLUGIN.render(params)
    } else {
      SUGGESTION_PLUGIN.remove()
    }
  }
})
