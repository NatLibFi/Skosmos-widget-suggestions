SUGGESTION_PLUGIN.suggestionNewFormComponent = {
  data() {
    return {
      lang: '',
      selectedVocab: this.vocab,
      termLabels: { // This is used until translation framework is implemented
        'fi': 'Termi suomeksi:',
        'sv': 'Termi ruotsiksi:',
        'en': 'Termi englanniksi:',
        'se': 'Termi pohjoissaameksi:'
      },
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
      submitted: false,
      renderKey: 0
    }
  },
  computed: {
    formIsValid () {
      return Object.values(this.terms).every(v => v.isValid)
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
  },
  emits: ['updateFormIsValid'],
  inject: ['vocab', 'UILang'],
  created () {
    // Make required term field Swedish if UI language is Swedish, otherwise make it Finnish
    this.lang = this.UILang === 'sv' ? 'sv' : 'fi'
    this.terms[this.lang].isValid = false
    this.terms[this.lang].required = true
  },
  watch: {
    selectedVocab() {
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

      this.submitted = false

      // Rerender all field components
      this.renderKey += 1
    },
    formIsValid () {
      this.$emit('updateFormIsValid', this.formIsValid)
    }
  },
  methods: {
    submit () {
      // This method is called by the parent component 'suggestion-new'
      console.log('submit', this.selectedVocab, this.terms, this.broader, this.narrower, this.associative, this.submitted, this.formIsValid)
      this.submitted = true
    }
  },
  template: `
    <div id="suggestion-form" role="form">
      <div id="suggestion-form-inputs">
        <div class="suggestion-input-container">
          <fieldset id="suggestion-vocab-wrapper">
            <legend class="suggestion-input-label" for="suggestion-vocab-wrapper">Kohdesanasto:</legend>
            <div>
              <input id="suggestion-vocab-yso" type="radio" name="suggestion-radio" value="yso"
                v-model="selectedVocab"
              />
              <label for="suggestion-vocab-yso">YSO</label>
              <input id="suggestion-vocab-yso-places" type="radio" name="suggestion-radio" value="yso-paikat"
                v-model="selectedVocab"
              />
              <label for="suggestion-vocab-yso-places">YSO-paikat</label>
              <input id="suggestion-vocab-slm" type="radio" name="suggestion-radio" value="slm"
                v-model="selectedVocab"
              />
              <label for="suggestion-vocab-slm">SLM</label>
            </div>
          </fieldset>
        </div>
        <div v-for="(term, key) in filteredTerms" :key="key">
          <term-input
            v-model:prefLabel="term.prefLabel"
            v-model:altLabels="term.altLabels"
            v-model:isValid="term.isValid"
            :label="{text: termLabels[key], id: 'suggestion-term-' + key + '-label'}"
            :vocab="selectedVocab"
            :lang="key"
            :submitted="submitted"
            :required="term.required"
            :key="renderKey"
          ></term-input>
        </div>
        <relation-input
          v-model:selectedConcepts="broader"
          :label="{text: 'Yläkäsite (LT):', id: 'suggestion-broader'}"
          :lang="lang"
          :vocab="selectedVocab"
          :key="renderKey"
        ></relation-input>
        <relation-input
          v-model:selectedConcepts="narrower"
          :label="{text: 'Alakäsitteet (ST):', id: 'suggestion-narrower'}"
          :lang="lang"
          :vocab="selectedVocab"
          :key="renderKey"
        ></relation-input>
        <relation-input
          v-model:selectedConcepts="associative"
          :label="{text: 'Assosiatiiviset käsitteet (RT):', id: 'suggestion-associative'}"
          :lang="lang"
          :vocab="selectedVocab"
          :key="renderKey"
        ></relation-input>
      </div>
    </div>
  `
}
