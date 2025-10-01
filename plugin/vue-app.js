SUGGESTION_PLUGIN.createVueApp = function(params) {
  const vueApp = Vue.createApp({
    data() {
      return {
        pageType: params.pageType,
      }
    },
    provide() {
      return {
        pageUrl: window.location.href,
        pageType: params.pageType,
        prefLabels: params.prefLabels,
        uri: params.uri,
        vocab: window.SKOSMOS.vocab, // This should be added to params in Skosmos
        UILang: window.SKOSMOS.lang // This should be added to params in Skosmos
      }
    },
    template: `
      <template v-if="pageType === 'concept'">
        <suggestion-change></suggestion-change>
      </template>
      <template v-if="pageType === 'vocab-home' || pageType === 'concept'">
        <suggestion-new></suggestion-new>
      </template>
    `
  })

  // Register components
  vueApp.component('suggestion-new', this.suggestionNewComponent)
  vueApp.component('suggestion-change', this.suggestionChangeComponent)
  vueApp.component('suggestion-new-form', this.suggestionNewFormComponent)
  vueApp.component('suggestion-change-form', this.suggestionChangeFormComponent)
  vueApp.component('draggable-dialog', this.draggableDialogComponent)
  vueApp.component('basic-input', this.basicInputComponent)
  vueApp.component('basic-textarea', this.basicTextareaComponent)
  vueApp.component('group-input', this.groupInputComponent)
  vueApp.component('term-input', this.termInputComponent)
  vueApp.component('relation-input', this.relationInputComponent)
  vueApp.component('chip-list', this.chipListComponent)
  vueApp.component('clear-input', this.clearInputComponent)
  vueApp.component('submit-button', this.submitButtonComponent)

  // Register custom directives
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

  vueApp.directive('click-outside', {
    beforeMount: (el, binding) => {
      el.clickOutsideEvent = event => {
        // Ensure the click was outside the element
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event) // Call the method provided in the directive's value
        }
      }
      window.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted: el => {
      window.removeEventListener('click', el.clickOutsideEvent)
    }
  })

  return vueApp
}
