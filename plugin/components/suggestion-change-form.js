SUGGESTION_PLUGIN.suggestionChangeFormComponent = {
  data() {
    return {
      change: '',
      explanation: '',
      organization: '',
      changeIsValid: false,
      submitted: false
    }
  },
  emits: ['updateFormIsValid'],
  inject:['prefLabels', 'uri'],
  watch: {
    changeIsValid () {
      this.$emit('updateFormIsValid', this.changeIsValid)
    }
  },
  methods: {
    submit () {
      // This method is called by the parent component 'suggestion-change'
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
      if(this.changeIsValid) {
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
          :label="{text: 'Lisätietoa tai perusteluja ehdotukselle:', id: 'suggestion-explanation'}"
        ></basic-textarea>
        <basic-input
          v-model:text="organization"
          :label="{text: 'Ehdottajan organisaatio:', id: 'suggestion-organization'}"
        ></basic-input>
      </div>
    </div>
  `
}
