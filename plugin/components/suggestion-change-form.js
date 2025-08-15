SUGGESTION_PLUGIN.suggestionChangeFormComponent = {
  data() {
    return {
      change: '',
      explanation: '',
      organization: '',
      changeIsValid: false,
      explanationIsValid: false,
      submitted: false
    }
  },
  inject:['prefLabels', 'uri'],
  methods: {
    submit () {
      const data = `
**Käsitteen tyyppi**

Muutos olemassa olevaan käsitteeseen

**prefabel**

[${this.prefLabels[0].label}](${this.uri})

**Tila**

Käsittelyssä

**Ehdotettu muutos**

${this.change}

**Perustelut ehdotukselle**

${this.explanation}

**Ehdottajan organisaatio**

${this.organization}
`
      if(this.changeIsValid && this.explanationIsValid) {
        console.log('submitted:\n', data)
      } else {
        console.log('Required fields missing')
      }
      this.submitted = true
    }
  },
  template: `
    <div id="suggestion-form" role="form">
      <div id="suggestion-form-inputs">
        <basic-textarea
          v-model:text="change"
          v-model:isValid="changeIsValid"
          :label="{text: 'Ehdotettu muutos: *', id: 'suggestion-change'}"
          :submitted="submitted"
        ></basic-textarea>
        <basic-textarea
          v-model:text="explanation"
          v-model:isValid="explanationIsValid"
          :label="{text: 'Perustelut ehdotukselle: *', id: 'suggestion-explanation'}"
          :submitted="submitted"
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
