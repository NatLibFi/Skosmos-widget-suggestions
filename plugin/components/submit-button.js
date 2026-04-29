SUGGESTION_PLUGIN.submitButtonComponent = {
  props: {
    text: String
  },
  emits: ['submit'],
  methods: {
    handleTabDownEvent(e) {
      // If shift key is pressed with tab, move focus to last input
      if (e.shiftKey) {
        document.querySelectorAll('.suggestion-input-container')[document.querySelectorAll('.suggestion-input-container').length - 1].focus({ preventScroll: true })
      } else {
        // If tab is pressed without shift, move focus to clear button
        e.preventDefault()
        document.querySelector('#suggestion-dialog-close button').focus({ preventScroll: true })
      }
    }
  },
  template: `
    <div id="suggestion-form-submit">
      <button role="button"
        @click="$emit('submit')"
        @keydown.tab="handleTabDownEvent($event)"
      >
        {{ text }}
      </button>
    </div>
  `
}
