SUGGESTION_PLUGIN.clearInputComponent = {
  emits: ['clear-input'],
  template: `
    <div class="suggestion-clear-input">
      <i class="fa-solid fa-xmark" aria-label="Clear" role="button"
        @click="this.$emit('clear-input')"
      ></i>
    </div>
  `
}
