SUGGESTION_PLUGIN.suggestionChangeFormComponent = {
  inject: ['prefLabels', 'uri', 'vocab'],
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
  computed: {
    issueData () {
      const hasText = x => x.trim() !== ''

      // Only include fields that have some input data
      const fields = [
        ['**Käsitteen tyyppi**', 'Muutos olemassa olevaan käsitteeseen'],
        ['**prefLabel**', `[${this.prefLabels[0].label}](${this.uri})`],
        ['**Muunkieliset termit**', this.prefLabels.slice(1).map(x => `${x.label} (${x.lang})`).join('; ')],
        ['**Tila**', 'Käsittelyssä'],
        hasText(this.description) && ['**Ehdotettu muutos**', this.description],
        hasText(this.explanation) && ['**Lisätietoa tai perusteluja ehdotukselle**', this.explanation],
        hasText(this.organization) && ['**Ehdottajan organisaatio**', this.organization]
      ].filter(Boolean)

      return fields.map(([title, value]) => `${title}\n\n${value}`).join('\n\n')
    }
  },
  watch: {
    descriptionIsValid () {
      this.$emit('updateFormIsValid', this.descriptionIsValid)
    }
  },
  methods: {
    async submit () {
      // This method is called by the parent component 'suggestion-change'
      this.submitted = true
      if (!this.descriptionIsValid) {
        return null
      } else {
        console.log(this.issueData)

        const labels = ['muutos']
        if (this.vocab === 'yso-paikat') {
          labels.push('maantieteellinen')
        } else if (this.vocab === 'slm') {
          labels.push('SLM')
        }

        const dataBundle = {
          title: this.prefLabels[0].label,
          body: this.issueData,
          state: 'open',
          labels
        }

        try {
          const params = new URLSearchParams({ payload: JSON.stringify(dataBundle) })
          const res = await fetch('plugins/suggestions/gh_prx.php?' + params.toString(), { method: 'POST', headers: { 'Access-Control-Allow-Origin': '*' } })
          const data = await res.json()
          return data.url
        } catch (error) {
          console.log(error)
          return null
        }
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
