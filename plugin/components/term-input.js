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
        return 'Tämä on pakollinen tieto.'
      } else if (this.concept) {
        if (this.concept.vocab === 'yse') {
          return `Termistä on jo olemassa käsite-ehdotus: <a href="${this.concept.uri}">${this.concept.prefLabel}</a>. Kommentoi tai kannata ehdotusta sen tiedoista löytyvän kotisivulinkin kautta.`
        } else {
          return `Termi löytyy jo ${this.concept.vocab}: <a href="${this.concept.uri}">${this.concept.prefLabel}</a>`
        }
      }
    }
  },
  emits: ['update:prefLabel', 'update:altLabels', 'update:isValid'],
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
    updateAltLabels (i, value, createNew = true) {
      let newLabels = [...this.altLabels]
      newLabels[i] = value
      this.$emit('update:altLabels', newLabels)

      // If updating last label, add a new one to the end of the array
      if (i === newLabels.length - 1 && createNew) {
        this.$emit('update:altLabels', [ ...newLabels, '' ])
      }
    },
    search (query, vocabs) {
      // Abort any previous fetch request before starting a new one
      this.controller.abort()
      this.controller = new AbortController()

      const tryNext = (i) => {
        if (i >= vocabs.length) return null // No match found

        const params = new URLSearchParams({ lang: this.lang, query: query })
        return fetch('rest/v1/' + vocabs[i] + '/search/?' + params.toString(), { signal: this.controller.signal })
          .then(res => res.json())
          .then(data => {
            if (data.results[0] && data.results[0].prefLabel.toLowerCase() === query.toLowerCase()) {
              // Only return a perfect match
              return data.results[0]
            } else {
              // Try the next vocab
              return tryNext(i + 1)
            }
          })
      }

      return tryNext(0)
        .then(res => {
          return res
        })
        .catch(error => {
          if (error.name === 'AbortError') {
            console.log('Fetch was aborted')
          } else {
            console.log('Fetch failed:', error)
          }
        })
    },
    removeAltLabelInput (i) {
      this.updateAltLabels(i, '')
      this.$emit('update:altLabels', this.altLabels.filter((l, idx) => idx !== i))
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
          >Päätermi:{{ required ? ' *' : '' }}</label>
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
          >Vaihtoehtoinen termi:</label>
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
                >Vaihtoehtoinen termi:</label>
                <clear-input
                  v-if="altLabels[i + 1] || true"
                  @clear-input="removeAltLabelInput(i + 1)"
                ></clear-input>
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
