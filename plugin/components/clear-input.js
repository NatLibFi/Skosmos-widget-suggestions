SUGGESTION_PLUGIN.clearInputComponent = {
  emits: ['clear-input'],
  template: `
    <div class="suggestion-clear-input">
      <i class="fa-solid fa-xmark" role="button"
        :aria-label="$t('common.aria.clear')"
        @click="$emit('clear-input')"
      ></i>
    </div>
  `
}
