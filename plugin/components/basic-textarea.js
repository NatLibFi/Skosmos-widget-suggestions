SUGGESTION_PLUGIN.basicTextareaComponent = {
  props: {
    text: String,
    label: Object
  },
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
      <clear-input
        v-if="text"
        @clear-input="updateText('')"
        :for-textarea="true"
      ></clear-input>
      <textarea class="suggestion-input" rows="3"
        @input="updateText($event.target.value)"
        :value="text"
        :id="label.id"
      ></textarea>
    </div>
  `
}
