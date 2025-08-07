SUGGESTION_PLUGIN.basicTextareaComponent = {
  props: {
    text: String,
    label: Object,
    isValid: {
      type: Boolean,
      default: false
    },
    submitted: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:text', 'update:isValid'],
  methods: {
    updateText(value) {
      this.$emit('update:text', value)
      if(value.length > 2) {
        this.$emit('update:isValid', true)
      } else {
        this.$emit('update:isValid', false)
      }
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
        :for-textarea="true"
        @clear-input="updateText('')"
      ></clear-input>
      <textarea class="suggestion-input" rows="3"
        :class="{ 'suggestion-error': !isValid && submitted }"
        :id="label.id"
        :value="text"
        @input="updateText($event.target.value)"
      ></textarea>
      <p class="suggestion-error"
        v-if="!isValid && submitted"
      >Tämä on pakollinen tieto.</p>
    </div>
  `
}
