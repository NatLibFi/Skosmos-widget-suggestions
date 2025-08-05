SUGGESTION_PLUGIN.basicInputComponent = {
  props: {
    'text': String,
    'label': Object
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
