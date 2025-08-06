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
          :label="{text: 'Ehdotettu muutos:', id: 'suggestion-change'}"
          v-model:text="change"
        ></basic-textarea>
        <basic-textarea
          :label="{text: 'Perustelut ehdotukselle:', id: 'suggestion-explanation'}"
          v-model:text="explanation"
        ></basic-textarea>
        <basic-input
          :label="{text: 'Ehdottajan organisaatio:', id: 'suggestion-organization'}"
          v-model:text="organization"
        ></basic-input>
      </div>
      <submit-button
        :text="'Lähetä muutosehdotus'"
        @submit="submit()"
      ></submit-button>
    </div>
  `
}
