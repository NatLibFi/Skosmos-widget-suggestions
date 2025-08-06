SUGGESTION_PLUGIN.createVueApp = function(pageType) {
  const vueApp = Vue.createApp({
    data() {
      return {
        pageType: pageType,
      }
    },
    provide() {
      return {
        pageUrl: window.location.href
      }
    },
    template: `
      <template v-if="pageType === 'concept'">
        <suggestion-change></suggestion-change>
      </template>
      <template v-if="pageType === 'vocab-home' || pageType === 'concept'">
        <suggestion-new :page-type="pageType"></suggestion-new>
      </template>
    `
  })

  vueApp.component('suggestion-new', this.suggestionNewComponent)
  vueApp.component('suggestion-change', this.suggestionChangeComponent)
  vueApp.component('draggable-dialog', this.draggableDialogComponent)
  vueApp.component('basic-input', this.basicInputComponent)
  vueApp.component('clear-input', this.clearInputComponent)

  vueApp.directive('drag', {
    beforeMount: (el, binding) => {
      el.dragEvent = event => {
        binding.value(event)
      }
      window.addEventListener("mousemove", el.dragEvent) // registering an event listener on dragging the dialog element
    },
    unmounted: el => {
      window.removeEventListener("mousemove", el.dragEvent)
    }
  })

  vueApp.directive('drag-stop', {
    beforeMount: (el, binding) => {
      el.dragStopEvent = event => {
        binding.value(event)
      }
      window.addEventListener("mouseup", el.dragStopEvent) // registering an event listener on stopping dragging the dialog element
    },
    unmounted: el => {
      window.removeEventListener("mouseup", el.dragStopEvent)
    }
  })

  return vueApp
}
