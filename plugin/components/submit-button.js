SUGGESTION_PLUGIN.submitButtonComponent = {
  props: {
    text: String
  },
  emits: ['submit'],
  methods: {
    handleTabDownEvent() {
      document.getElementById('suggestion-dialog-top').focus({ preventScroll: true })
    }
  },
  template: `
    <div id="suggestion-form-submit">
      <button role="button"
        @click="$emit('submit')"
        @keydown.tab="handleTabDownEvent()"
      >
        {{ text }}
      </button>
    </div>
  `
}
