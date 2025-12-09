SUGGESTION_PLUGIN.suggestionNewFormComponent = {
  inject: ['vocab', 'UILang'],
  emits: ['updateFormIsValid'],
  data () {
    return {
      lang: '',
      selectedVocab: this.vocab,
      terms: {
        fi: {
          prefLabel: '',
          altLabels: [''],
          isValid: true,
          required: false,
        },
        sv: {
          prefLabel: '',
          altLabels: [''],
          isValid: true,
          required: false,
        },
        en: {
          prefLabel: '',
          altLabels: [''],
          isValid: true,
          required: false,
        },
        se: {
          prefLabel: '',
          altLabels: [''],
          isValid: true,
          required: false,
        },
      },
      broader: [],
      narrower: [],
      associative: [],
      groups: [],
      exactMatches: [],
      explanation: '',
      neededFor: '',
      neededForIsValid: false,
      organization: '',
      submitted: false,
      deadlineDate: '',
      meetingDate: '',
      renderKey: 0
    }
  },
  computed: {
    formIsValid () {
      return Object.values(this.terms).every(v => v.isValid) && this.neededForIsValid
    },
    filteredTerms () {
      const vocabMap = {
        'slm': ['fi', 'sv'],
        'yso-paikat': ['fi', 'sv', 'en'],
        'yso': ['fi', 'sv', 'en', 'se']
      }

      // Return only the term fields that are allowed for the selected vocab
      return Object.fromEntries(
        Object.entries(this.terms).filter(([key]) => vocabMap[this.selectedVocab].includes(key))
      )
    },
    issueData () {
      return `
**Käsitteen tyyppi**

${this.selectedVocab === 'yso-paikat' ? 'GEO' : this.selectedVocab === 'slm' ? 'SLM' : 'CONCEPT'}

**Ehdotettu termi suomeksi**

${this.terms.fi.prefLabel}

**Ehdotettu termi ruotsiksi**

${this.terms.sv.prefLabel}

**Ehdotettu termi englanniksi**

${this.terms.en.prefLabel}

**Ehdotettu termi pohjoissaameksi**

${this.terms.en.prefLabel}

**Perustelut ehdotukselle**

${this.explanation}

**Ehdotettu yläkäsite (LT)**

${this.broader.map(x => '[' + x.prefLabel + '](' + x.uri + ')').join(', ')}

**Ehdotetut temaattiset ryhmät**

${this.groups.map(x => '[' + x.prefLabel + '](' + x.uri + ')').join(', ')}

**Vaihtoehtoiset termit suomeksi**

${this.terms.fi.altLabels.filter(x => x !== '').join(', ')}

**Vaihtoehtoiset termit ruotsiksi**

${this.terms.sv.altLabels.filter(x => x !== '').join(', ')}

**Vaihtoehtoiset termit englanniksi**

${this.terms.en.altLabels.filter(x => x !== '').join(', ')}

**Vaihtoehtoiset termit pohjoissaameksi**

${this.terms.se.altLabels.filter(x => x !== '').join(', ')}

**Alakäsitteet (ST)**

${this.narrower.map(x => '[' + x.prefLabel + '](' + x.uri + ')').join(', ')}

**Assosiatiiviset käsitteet (RT)**

${this.associative.map(x => '[' + x.prefLabel + '](' + x.uri + ')').join(', ')}

**Vastaava käsite muussa sanastossa**

${this.exactMatches.filter(x => x !== '').join(', ')}

**Aineisto jonka kuvailussa käsitettä tarvitaan (esim. nimeke tai URL)**

${this.neededFor}

**Ehdottajan organisaatio**

${this.organization}
`
    }
  },
  created () {
    // Make required term field Swedish if UI language is Swedish, otherwise make it Finnish
    this.lang = this.UILang === 'sv' ? 'sv' : 'fi'
    this.terms[this.lang].isValid = false
    this.terms[this.lang].required = true

    // Parse YSO meeting dates from util/meeting-dates.js
    const deadline = new Date(Date.parse(SUGGESTION_PLUGIN.deadlineDate))
    const meeting = new Date(Date.parse(SUGGESTION_PLUGIN.meetingDate))

    this.deadlineDate = `${deadline.getDate()}.${deadline.getMonth() + 1}.${deadline.getFullYear()}`
    this.meetingDate = `${meeting.getDate()}.${meeting.getMonth() + 1}.${meeting.getFullYear()}`
  },
  watch: {
    selectedVocab () {
      // When selected vocab is changed, reset form data
      Object.keys(this.terms).forEach(x => {
        this.terms[x] = {
          prefLabel: '',
          altLabels: [''],
          isValid: true,
          required: false
        }
      })
      this.terms[this.lang].isValid = false
      this.terms[this.lang].required = true

      this.broader = []
      this.narrower = []
      this.associative = []

      this.groups = []

      this.exactMatches = []

      this.explanation = ''

      this.neededFor = ''
      this.neededForIsValid = false

      this.organization = ''

      this.submitted = false

      // Rerender all field components
      this.renderKey += 1
    },
    formIsValid () {
      this.$emit('updateFormIsValid', this.formIsValid)
    }
  },
  methods: {
    async submit () {
      // This method is called by the parent component 'suggestion-new'
      console.log('submit', this.$data)
      this.submitted = true

      if (!this.formIsValid) {
        // Scroll the topmost invalid field into view after DOM has updated
        this.$nextTick(() => {
          const firstError = document.querySelector('.suggestion-error')
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        })
        return null
      } else {
        console.log(this.issueData)

        const labels = ['uusi']
        if (this.selectedVocab === 'yso-paikat') {
          labels.push('maantieteellinen')
        } else if (this.selectedVocab === 'slm') {
          labels.push('SLM')
        }

        const dataBundle = {
          title:  this.terms.fi.prefLabel || this.terms.sv.prefLabel,
          body: this.issueData,
          state: 'open',
          labels
        }

        try {
          const params = new URLSearchParams({ payload: JSON.stringify(dataBundle) })
          const res = await fetch('plugins/suggestion-plugin/gh_prx.php?' + params.toString(), { method: 'POST', headers: { 'Access-Control-Allow-Origin': '*' } })
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
        <div class="suggestion-input-container">
          <fieldset id="suggestion-vocab-wrapper">
            <legend class="suggestion-input-label" for="suggestion-vocab-wrapper">{{ $t('new.vocab.label') }}</legend>
            <div>
              <input id="suggestion-vocab-yso" type="radio" name="suggestion-radio" value="yso"
                v-model="selectedVocab"
              />
              <label for="suggestion-vocab-yso">{{ $t('new.vocab.yso') }}</label>
              <input id="suggestion-vocab-yso-places" type="radio" name="suggestion-radio" value="yso-paikat"
                v-model="selectedVocab"
              />
              <label for="suggestion-vocab-yso-places">{{ $t('new.vocab.ysoPlaces') }}</label>
              <input id="suggestion-vocab-slm" type="radio" name="suggestion-radio" value="slm"
                v-model="selectedVocab"
              />
              <label for="suggestion-vocab-slm">{{ $t('new.vocab.slm') }}</label>
            </div>
          </fieldset>
        </div>
        <div v-for="(term, key) in filteredTerms" :key="key">
          <term-input
            v-model:prefLabel="term.prefLabel"
            v-model:altLabels="term.altLabels"
            v-model:isValid="term.isValid"
            :label="{text: $t('new.terms.' + key), id: 'suggestion-term-' + key + '-label'}"
            :vocab="selectedVocab"
            :lang="key"
            :submitted="submitted"
            :required="term.required"
            :key="renderKey"
          ></term-input>
        </div>
        <relation-input
          v-model:selectedConcepts="broader"
          :label="{text: $t('new.broader'), id: 'suggestion-broader'}"
          :vocab="selectedVocab"
          :key="renderKey"
        ></relation-input>
        <relation-input
          v-model:selectedConcepts="narrower"
          :label="{text: $t('new.narrower'), id: 'suggestion-narrower'}"
          :vocab="selectedVocab"
          :key="renderKey"
        ></relation-input>
        <relation-input
          v-model:selectedConcepts="associative"
          :label="{text: $t('new.associative'), id: 'suggestion-associative'}"
          :vocab="selectedVocab"
          :key="renderKey"
        ></relation-input>
        <group-input
          v-if="selectedVocab === 'yso'"
          v-model:selectedGroups="groups"
          :lang="UILang"
          :key="renderKey"
        ></group-input>
        <exact-match-input
          v-if="selectedVocab === 'slm'"
          v-model:matches="exactMatches"
          :links="[{url: '', text: 'LCGFT'}, {url: '', text: 'SAOGF'}]"
          :key="renderKey"
        ></exact-match-input>
        <exact-match-input
          v-if="selectedVocab === 'yso' || selectedVocab === 'yso-paikat'"
          v-model:matches="exactMatches"
          :links="[{url: '', text: 'LCSH'}, {url: '', text: 'SAO'}, {url: '', text: 'Wikipedia'}]"
          :key="renderKey"
        ></exact-match-input>
        <basic-input
          v-model:text="explanation"
          :label="{text: $t('new.explanation'), id: 'suggestion-explanation'}"
          :is-textarea="true"
        ></basic-input>
        <basic-input
          v-model:text="neededFor"
          v-model:isValid="neededForIsValid"
          :submitted="submitted"
          :label="{text: $t('new.neededFor'), id: 'suggestion-needed-for'}"
        ></basic-input>
        <basic-input
          v-model:text="organization"
          :label="{text: $t('new.organization'), id: 'suggestion-organization'}"
        ></basic-input>
        <div id="suggestion-meeting-info" v-if="selectedVocab === 'yso'">
          <p>{{ $t('new.meetingInfo', {deadlineDate, meetingDate}) }}</p>
        </div>
      </div>
    </div>
  `
}
