SUGGESTION_PLUGIN.suggestionNewFormComponent = {
  data() {
    return {
      selectedVocab: this.vocab,
      prefLabelFi: '',
      altLabelsFi: [''],
      prefLabelIsValidFi: false,
      submitted: false
    }
  },
  inject: ['vocab'],
  methods: {
    submit () {
      console.log('submit', this.selectedVocab, this.prefLabelFi, this.altLabelsFi)
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
          v-model:prefLabel="prefLabelFi"
          v-model:altLabels="altLabelsFi"
          :label="{text: 'Termi suomeksi:', id: 'suggestion-term-fi-label'}"
          :vocab="selectedVocab"
          :lang="'fi'"
          :isValid="prefLabelIsValidFi"
          :submitted="submitted"
        ></term-input>
      </div>
      <submit-button
        :text="'Lähetä käsite-ehdotus'"
        @submit="submit()"
      ></submit-button>
    </div>
  `
}
