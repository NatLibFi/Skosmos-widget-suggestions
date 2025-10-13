SUGGESTION_PLUGIN.suggestionChangeFormComponent = {
  data() {
    return {
      description: '',
      explanation: '',
      organization: '',
      descriptionIsValid: false,
      submitted: false
    }
  },
  emits: ['updateFormIsValid'],
  inject:['prefLabels', 'uri'],
  watch: {
    descriptionIsValid () {
      this.$emit('updateFormIsValid', this.descriptionIsValid)
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

${this.description}

**Perustelut ehdotukselle**

${this.explanation}

**Ehdottajan organisaatio**

${this.organization}
`
      if(this.descriptionIsValid) {
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
          v-model:text="description"
          v-model:isValid="descriptionIsValid"
          :label="{text: $t('change.description'), id: 'suggestion-description'}"
          :submitted="submitted"
        ></basic-textarea>
        <basic-textarea
          v-model:text="explanation"
          :label="{text: $t('change.explanation'), id: 'suggestion-explanation'}"
        ></basic-textarea>
        <basic-input
          v-model:text="organization"
          :label="{text: $t('change.organization'), id: 'suggestion-organization'}"
        ></basic-input>
      </div>
    </div>
  `
}
