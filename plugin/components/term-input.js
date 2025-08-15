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
    }
  },
  data() {
    return {
      controller: new AbortController(),
      concept: null
    }
  },
  emits: ['update:prefLabel', 'update:altLabels', 'update:isValid'],
  methods: {
    updatePrefLabel(value) {
      this.$emit('update:prefLabel', value)
      if (value.length > 2) {
        const vocabs = [this.vocab, ...['yso' ,'yso-paikat', 'slm', 'yse'].filter(v => v !== this.vocab)] // All vocabs with selected vocab first
        this.search(value, vocabs)
          .then(res => {
            if (res) {
              this.$emit('update:isValid', false)
              this.concept = res
            } else {
              this.$emit('update:isValid', true)
              this.concept = null
            }
          })
      } else {
        this.$emit('update:isValid', false)
        this.concept = null
      }
    },
    updateAltLabels(idx, value) {
      let newLabels = [...this.altLabels]

      newLabels = newLabels.map((l, i) => i === idx ? value : l)
      this.$emit('update:altLabels', newLabels)

      // If updating last label, add a new one to the end of the array
      if (idx === newLabels.length - 1) {
        this.$emit('update:altLabels', [ ...newLabels, '' ])
      }
    },
    search(query, vocabs) {
      // Abort any previous fetch request before starting a new one
      this.controller.abort()
      this.controller = new AbortController()

      const tryNext = (i) => {
        if (i >= vocabs.length) return null // No match found

        return fetch('rest/v1/' + vocabs[i] + '/search/?lang=' + this.lang + '&query=' + query, { signal: this.controller.signal })
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
    }
  },
  template: `
    <div class="suggestion-input-container">
      <h3 class="suggestion-input-label"
        :id="label.id"
      >{{ label.text }}</h3>

      <p class="suggestion-existing-concept" v-if="concept">
        <template v-if="concept.vocab === 'yse'">
          Termistä on jo olemassa käsite-ehdotus: <a :href="concept.uri">{{ concept.prefLabel }}</a>. Kommentoi tai kannata ehdotusta sen tiedoista löytyvän kotisivulinkin kautta.
        </template>
        <template v-else>
          Termi löytyy jo {{ vocab }}: <a :href="concept.uri">{{ concept.prefLabel }}</a>
        </template>
      </p>

      <div :aria-labelledby="label.id">
        <div class="row">
          <label class="suggestion-term-label col-lg-4 pt-lg-2"
            :for="'suggestion-preflabel-' + lang"
          >Päätermi</label>
          <div class="col-lg-8">
            <clear-input
              v-if="prefLabel"
              @clear-input="updatePrefLabel('')"
            ></clear-input>
            <input class="suggestion-input" type="text"
              :class="{ 'suggestion-error': !isValid && submitted }"
              :id="'suggestion-preflabel-' + lang"
              :value="prefLabel"
              @input="updatePrefLabel($event.target.value)"
            >
            <p class="suggestion-error"
              v-if="!isValid && submitted"
            >{{ concept ? 'Päätermiksi tarvitaan uniikki termi.' : 'Tämä on pakollinen tieto.'}}</p>
          </div>
        </div>

        <div class="row">
          <label class="suggestion-term-label col-lg-4 pt-lg-2" for="suggestion-altlabel-fi-0">Vaihtoehtoinen termi</label>
          <div class="col-lg-8">
            <clear-input
              v-if="altLabels[0]"
              @clear-input="updateAltLabels(0, '')"
            ></clear-input>
            <input id="suggestion-altlabel-fi-0" class="suggestion-input" type="text"
              :value="altLabels[0]"
              @input="updateAltLabels(0, $event.target.value)"
            >
            <template v-if="altLabels.length > 1">
              <template v-for="(l, i) in altLabels.slice(1)">
                <label class="suggestion-term-label col-lg-3 pt-lg-2 sr-only"
                  :for="'suggestion-altlabel-fi-' + (i + 1)"
                >Vaihtoehtoinen termi</label>
                <clear-input
                  v-if="altLabels[i + 1]"
                  @clear-input="updateAltLabels(i + 1, '')"
                ></clear-input>
                <input class="suggestion-input" type="text"
                  :id="'suggestion-altlabel-fi-' + (i + 1)"
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
