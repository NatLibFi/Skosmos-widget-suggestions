SUGGESTION_PLUGIN.termInputComponent = {
  props: {
    vocab: String,
    prefLabel: String,
    altLabels: Array,
    label: Object,
    lang: String,
    isValid: {
      type: Boolean,
      default: false
    },
    submitted: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:prefLabel', 'update:altLabels', 'update:isValid'],
  data () {
    return {
      controller: new AbortController(),
      concept: null,
      loading: false
    }
  },
  computed: {
    showError () {
      return (!this.isValid && this.submitted && this.required) || this.concept
    },
    errorString () {
      if (!this.concept && this.required) {
        // Show error for required empty field
        return this.$t('common.error')
      } else if (this.concept) {
        if (this.concept.altLabel && this.prefLabel.trim().toLowerCase() === this.concept.altLabel.toLowerCase() ) {
          // If matching label is an altLabel of an existing concept, show a separate error message
          return this.$t('new.terms.if.alt', {link: `<a href="${this.concept.uri}">${this.concept.prefLabel}</a>`})
        } else {
          return this.$t(`new.terms.if.${this.concept.vocab}`, {link: `<a href="${this.concept.uri}">${this.concept.prefLabel}</a>`})
        }
      }
    }
  },
  methods: {
    updatePrefLabel (value) {
      this.$emit('update:prefLabel', value)
      this.loading = true
      if (value.length > 1) {
        const vocabs = [this.vocab, ...['yso' ,'yso-paikat', 'slm', 'yse'].filter(v => v !== this.vocab)] // All vocabs with selected vocab first
        this.search(value, vocabs)
          .then(res => {
            // Only continue if the value matches current prefLabel to prevent a race condition
            if (value !== this.prefLabel) return

            if (res) {
              this.$emit('update:isValid', false)
              this.concept = res
            } else {
              this.$emit('update:isValid', true)
              this.concept = null
            }
            this.loading = false
          })
      } else {
        if (!this.required) {
          this.$emit('update:isValid', true)
        } else {
          this.$emit('update:isValid', false)
        }
        this.concept = null
        this.loading = false
      }
    },
    search (query, vocabs) {
      // Abort any previous fetch request before starting a new one
      this.controller.abort()
      this.controller = new AbortController()

      const q = query.trim().toLowerCase()
      // YSO concepts should not block suggestions for SLM (if selected vocab is SLM, searches are not made to YSO)
      const vocab = this.vocab === 'slm' ? 'yso-paikat slm yse' : 'yso yso-paikat slm yse'
      const params = new URLSearchParams({ lang: this.lang, query: q, vocab })
      return fetch('rest/v1/search/?' + params.toString(), { signal: this.controller.signal })
        .then(res => res.json())
        .then(data => {
          // Find first matching pref/hiddenLabel according to vocab order
          for (const vocab of vocabs) {
            const match = data.results.find(r =>
              r.vocab === vocab &&
              (
                r.prefLabel.toLowerCase() === q ||
                (r.hiddenLabel && r.hiddenLabel.toLowerCase() === q)
              )
            )
            // Proposed YSO concepts should not block suggestions for SLM (if selected vocab is SLM, matches in YSE should only be proposals to SLM or YSO places)
            if (
              match && 
              !(
                this.vocab === 'slm' && 
                match.vocab === 'yse' && 
                !match.type.some(t => ['http://www.yso.fi/onto/yse-meta/GeographicalConcept', 'http://www.yso.fi/onto/yse-meta/GenreConcept'].includes(t))
              )
            ) {
              return match
            }
          }

          // If no matching pref/hiddenLabel is found, find first matching altLabel according to selected vocab
          // i.e. show warning for matching altLabels of concepts in slm and yso-places when selected vocab is SLM and yso and yso-places otherwise
          for (const r of data.results) {
            if (
              r.altLabel && 
              r.altLabel.toLowerCase() === q &&
              (this.vocab === 'slm' ? ['slm', 'yso-paikat'] : ['yso', 'yso-paikat']).includes(r.vocab)
            ) {
              return r
            }
          }

          // If no matches are found, return null
          return null
        })
        .catch(error => {
          if (error.name === 'AbortError') {
            console.log('Fetch was aborted')
          } else {
            console.log('Fetch failed:', error)
          }
        })
    },
    updateAltLabels (i, value, createNew = true) {
      let newAltLabels = [...this.altLabels] // Copy of altLabels array
      newAltLabels[i] = value
      this.$emit('update:altLabels', newAltLabels)

      // If updating last label, add a new empty label to the end of the array
      if (i === newAltLabels.length - 1 && createNew) {
        this.$emit('update:altLabels', [ ...newAltLabels, '' ])
      }
    },
    removeAltLabelInput (i) {
      this.$emit('update:altLabels', this.altLabels.filter((_, idx) => idx !== i))
    }
  },
  template: `
    <div class="suggestion-input-container">
      <h3 class="suggestion-input-label"
        :id="label.id"
      >{{ label.text }}</h3>

      <div :aria-labelledby="label.id">
        <div class="row">
          <label class="suggestion-term-label col-lg-4 pt-lg-2"
            :for="'suggestion-preflabel-' + lang"
          >{{ $t('new.terms.prefLabel') }}{{ required ? ' *' : '' }}</label>
          <div class="col-lg-8">
            <clear-input
              v-if="prefLabel && !loading"
              @clear-input="updatePrefLabel('')"
            ></clear-input>
            <div class="suggestion-clear-input" v-if="loading" @click="updatePrefLabel('')">
              <i class="spinner fa-solid fa-spinner fa-spin-pulse"></i>
            </div>
            <input class="suggestion-input" type="text"
              :class="{ 'suggestion-error': showError }"
              :id="'suggestion-preflabel-' + lang"
              :value="prefLabel"
              @input="updatePrefLabel($event.target.value)"
            >
            <p class="suggestion-error"
              v-if="showError"
              v-html="errorString"
            ></p>
          </div>
        </div>

        <div class="row">
          <label class="suggestion-term-label col-lg-4 pt-lg-2"
            :for="'suggestion-altlabel-' + lang + '-0'"
          >{{ $t('new.terms.altLabel') }}</label>
          <div class="col-lg-8">
            <clear-input
              v-if="altLabels[0]"
              @clear-input="updateAltLabels(0, '', false)"
            ></clear-input>
            <input class="suggestion-input" type="text"
              :id="'suggestion-altlabel-' + lang + '-0'" 
              :value="altLabels[0]"
              @input="updateAltLabels(0, $event.target.value)"
            >
            <template v-if="altLabels.length > 1">
              <template v-for="(l, i) in altLabels.slice(1)">
                <label class="suggestion-term-label col-lg-3 pt-lg-2 sr-only"
                  :for="'suggestion-altlabel-' + lang + '-' + (i + 1)"
                >{{ $t('new.terms.altLabel') }}</label>
                <clear-input @clear-input="removeAltLabelInput(i + 1)"></clear-input>
                <input class="suggestion-input" type="text"
                  :id="'suggestion-altlabel-' + lang + '-' + (i + 1)"
                  :value="l"
                  @input="updateAltLabels(i + 1, $event.target.value)"
                >
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  `
}
