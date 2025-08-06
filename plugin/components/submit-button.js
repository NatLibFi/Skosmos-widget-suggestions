SUGGESTION_PLUGIN.submitButtonComponent = {
  props: {
    text: String
  },
  emits: ['submit'],
  template: `
    <div id="suggestion-form-submit" class="d-flex justify-content-end">
      <button id="suggestion-form-submit-button" role="button"
        @click="$emit('submit')"
      >
        {{ text }}
      </button>
    </div>
  `
}
