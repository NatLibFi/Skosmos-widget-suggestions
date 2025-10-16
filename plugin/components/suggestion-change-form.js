SUGGESTION_PLUGIN.suggestionChangeFormComponent = {
  inject:['prefLabels', 'uri'],
  emits: ['updateFormIsValid'],
  data () {
    return {
      description: '',
      explanation: '',
      organization: '',
      descriptionIsValid: false,
      submitted: false
    }
  },
  watch: {
    descriptionIsValid () {
      this.$emit('updateFormIsValid', this.descriptionIsValid)
    }
  },
  methods: {
    submit () {
      // This method is called by the parent component 'suggestion-change'
      console.log('submit', this.$data)
      this.submitted = true

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
      if (!this.descriptionIsValid) {
        return null
      } else {
        // TODO: make request to proxy server and return response
        console.log('submitted:\n', data)
        return "https://api.github.com/repos/Finto-ehdotus/YSE/issues/14086"
      }
    }
  },
  template: `
    <div id="suggestion-form" role="form">
      <div id="suggestion-form-inputs">
        <basic-input
          v-model:text="description"
          v-model:isValid="descriptionIsValid"
          :label="{text: $t('change.description'), id: 'suggestion-description'}"
          :submitted="submitted"
          :is-textarea="true"
        ></basic-input>
        <basic-input
          v-model:text="explanation"
          :label="{text: $t('change.explanation'), id: 'suggestion-explanation'}"
          :is-textarea="true"
        ></basic-input>
        <basic-input
          v-model:text="organization"
          :label="{text: $t('change.organization'), id: 'suggestion-organization'}"
        ></basic-input>
      </div>
    </div>
  `
}
