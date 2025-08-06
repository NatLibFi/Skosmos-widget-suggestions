const SUGGESTION_PLUGIN = {
  vueApp: null,
  render: function(params) {
    const mountPoint = document.getElementById('suggestion-plugin')
    if (mountPoint) {
      // Unmount the Vue app if it exists
      if (this.vueApp) {
        this.vueApp.unmount()
      }
      // Remove the old mount point div
      mountPoint.remove()
    }

    // Create a new div for the Vue app
    const newMountPoint = document.createElement('div')
    newMountPoint.id = 'suggestion-plugin'
    newMountPoint.classList = 'row py-3'

    // Find parent element and add the mount point as a child
    const parentElement = document.querySelector('#main-content .main-content-section')
    parentElement.appendChild(newMountPoint)
  
    // Create a new Vue app instance and mount it to the new mount point
    this.vueApp = this.createVueApp(params)
    this.vueApp.mount('#suggestion-plugin')
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
