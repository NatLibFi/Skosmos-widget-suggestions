SUGGESTION_PLUGIN.suggestionNewFormComponent = {
  data() {
    return {
      selectedVocab: this.vocab,
      terms: {
        fi: {
          prefLabel: '',
          altLabels: [''],
          prefLabelIsValid: false,
        },
        sv: {
          prefLabel: '',
          altLabels: [''],
          prefLabelIsValid: false,
        },
        en: {
          prefLabel: '',
          altLabels: [''],
          prefLabelIsValid: false,
        },
        se: {
          prefLabel: '',
          altLabels: [''],
          prefLabelIsValid: false,
        },
      },
      submitted: false,
      renderKey: 0
    }
  },
  inject: ['vocab'],
  watch: {
    selectedVocab() {
      // When selected vocab is changed, reset terms data
      Object.keys(this.terms).forEach(x => {
        this.terms[x] = {
          prefLabel: '',
          altLabels: [''],
          prefLabelIsValid: false,
        }
      })
      this.submitted = false
      // Rerender all field components
      this.renderKey += 1
    }
  },
  methods: {
    submit () {
      console.log('submit', this.selectedVocab, this.terms, this.submitted)
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
          v-model:isValid="terms.fi.prefLabelIsValid"
          :label="{text: 'Termi suomeksi:', id: 'suggestion-term-fi-label'}"
          :vocab="selectedVocab"
          :lang="'fi'"
          :submitted="submitted"
          :required="true"
          :key="renderKey"
        ></term-input>
        <term-input
          v-model:prefLabel="terms.sv.prefLabel"
          v-model:altLabels="terms.sv.altLabels"
          :label="{text: 'Termi ruotsiksi:', id: 'suggestion-term-sv-label'}"
          :vocab="selectedVocab"
          :lang="'sv'"
          :submitted="submitted"
          :key="renderKey"
        ></term-input>
        <term-input
          v-if="selectedVocab === 'yso' || selectedVocab === 'yso-paikat'"
          v-model:prefLabel="terms.en.prefLabel"
          v-model:altLabels="terms.en.altLabels"
          :label="{text: 'Termi englanniksi:', id: 'suggestion-term-en-label'}"
          :vocab="selectedVocab"
          :lang="'en'"
          :submitted="submitted"
          :key="renderKey"
        ></term-input>
        <term-input
          v-if="selectedVocab === 'yso'"
          v-model:prefLabel="terms.se.prefLabel"
          v-model:altLabels="terms.se.altLabels"
          :label="{text: 'Termi pohjoissaameksi:', id: 'suggestion-term-se-label'}"
          :vocab="selectedVocab"
          :lang="'se'"
          :submitted="submitted"
          :key="renderKey"
        ></term-input>
      </div>
    </div>
  `
}
