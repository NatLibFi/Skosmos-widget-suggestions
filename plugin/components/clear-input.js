SUGGESTION_PLUGIN.clearInputComponent = {
  props: {
    forTextarea: {
      type: Boolean,
      default: false
    }
  },
  emits: ['clear-input'],
  template: `
    <div class="suggestion-clear-input" :class="{ 'suggestion-clear-textarea': forTextarea }">
      <i class="fa-solid fa-xmark" aria-label="Clear" role="button"
        @click="$emit('clear-input')"
      ></i>
    </div>
  `
}
