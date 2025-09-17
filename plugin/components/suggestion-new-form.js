SUGGESTION_PLUGIN.suggestionNewFormComponent = {
  data() {
    return {
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
      submitted: false,
      renderKey: 0
    }
  },
  computed: {
    formIsValid () {
      return Object.values(this.terms).every(v => v.isValid)
    }
  },
  emits: ['updateFormIsValid'],
  inject: ['vocab'],
  created () {
    // Make required term field Swedish if UI language is Swedish, otherwise make it Finnish
    const lang = window.SKOSMOS.lang === 'sv' ? 'sv' : 'fi'
    this.terms[lang].isValid = false
    this.terms[lang].required = true
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

      const lang = window.SKOSMOS.lang === 'sv' ? 'sv' : 'fi'
      this.terms[lang].isValid = false
      this.terms[lang].required = true

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
      console.log('submit', this.selectedVocab, this.terms, this.submitted, this.formIsValid)
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
        <term-input
          v-model:prefLabel="terms.fi.prefLabel"
          v-model:altLabels="terms.fi.altLabels"
          v-model:isValid="terms.fi.isValid"
          :label="{text: 'Termi suomeksi:', id: 'suggestion-term-fi-label'}"
          :vocab="selectedVocab"
          :lang="'fi'"
          :submitted="submitted"
          :required="terms.fi.required"
          :key="renderKey"
        ></term-input>
        <term-input
          v-model:prefLabel="terms.sv.prefLabel"
          v-model:altLabels="terms.sv.altLabels"
          v-model:isValid="terms.sv.isValid"
          :label="{text: 'Termi ruotsiksi:', id: 'suggestion-term-sv-label'}"
          :vocab="selectedVocab"
          :lang="'sv'"
          :submitted="submitted"
          :required="terms.sv.required"
          :key="renderKey"
        ></term-input>
        <term-input
          v-if="selectedVocab === 'yso' || selectedVocab === 'yso-paikat'"
          v-model:prefLabel="terms.en.prefLabel"
          v-model:altLabels="terms.en.altLabels"
          v-model:isValid="terms.en.isValid"
          :label="{text: 'Termi englanniksi:', id: 'suggestion-term-en-label'}"
          :vocab="selectedVocab"
          :lang="'en'"
          :submitted="submitted"
          :required="terms.en.required"
          :key="renderKey"
        ></term-input>
        <term-input
          v-if="selectedVocab === 'yso'"
          v-model:prefLabel="terms.se.prefLabel"
          v-model:altLabels="terms.se.altLabels"
          v-model:isValid="terms.se.isValid"
          :label="{text: 'Termi pohjoissaameksi:', id: 'suggestion-term-se-label'}"
          :vocab="selectedVocab"
          :lang="'se'"
          :submitted="submitted"
          :required="terms.se.required"
          :key="renderKey"
        ></term-input>
      </div>
    </div>
  `
}
