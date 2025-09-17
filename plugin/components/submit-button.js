SUGGESTION_PLUGIN.submitButtonComponent = {
  props: {
    text: String,
    disabled: Boolean
  },
  emits: ['submit'],
  template: `
    <div id="suggestion-form-submit">
      <button role="button"
        :class="{ 'disabled': disabled }"
        @click="$emit('submit')"
      >
        {{ text }}
      </button>
    </div>
  `
}
