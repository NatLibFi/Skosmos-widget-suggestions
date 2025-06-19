SUGGESTION_PLUGIN.dialogComponent = {
  emits: ['close-dialog'],
  template: `
    <div>
      <div class="suggestion-dialog-overlay"></div>
      <div class="suggestion-dialog-modal">
        <div id="suggestion-dialog-top" class="row">
          <div id="suggestion-dialog-handle" class="col">
            <i class="fa-solid fa-grip-vertical align-middle" aria-hidden="true"></i>
          </div>
          <div id="suggestion-dialog-close" class="col text-end">
            <i class="fa-solid fa-xmark align-middle" aria-label="Close" role="button"
              @click="this.$emit('close-dialog')"
            ></i>
          </div>
        </div>
        <div id="suggestion-dialog-content">
          <slot></slot>
        </div>
      </div>
    </div>
  `
}

SUGGESTION_PLUGIN.basicInputComponent = {
  props: ['text', 'label'],
  emits: ['update:text'],
  methods: {
    updateText(value) {
      this.$emit('update:text', value)
    }
  },
  template: `
    <div class="suggestion-input-container">
      <label class="suggestion-input-label"
        :for="label.id"
      >
        {{ label.text }}
      </label>
      <input class="suggestion-input" type="text"
        @input="updateText($event.target.value)"
        :value="text"
        :id="label.id"
      >
      <clear-input
        v-if="text"
        @clear-input="updateText('')"
      ></clear-input>
    </div>
  `
}

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
