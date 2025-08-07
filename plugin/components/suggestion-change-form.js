SUGGESTION_PLUGIN.suggestionChangeFormComponent = {
  data() {
    return {
      change: '',
      explanation: '',
      organization: ''
    }
  },
  methods: {
    submit () {
      console.log('submit', this.change, this.explanation, this.organization)
    }
  },
  template: `
    <div id="suggestion-form" role="form">
      <div id="suggestion-form-inputs">
        <basic-textarea
          v-model:text="change"
          :label="{text: 'Ehdotettu muutos:', id: 'suggestion-change'}"
        ></basic-textarea>
        <basic-textarea
          v-model:text="explanation"
          :label="{text: 'Perustelut ehdotukselle:', id: 'suggestion-explanation'}"
        ></basic-textarea>
        <basic-input
          v-model:text="organization"
          :label="{text: 'Ehdottajan organisaatio:', id: 'suggestion-organization'}"
        ></basic-input>
      </div>
      <submit-button
        :text="'Lähetä muutosehdotus'"
        @submit="submit()"
      ></submit-button>
    </div>
  `
}
