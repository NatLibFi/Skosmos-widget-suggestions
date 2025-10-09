SUGGESTION_PLUGIN.relationInputComponent = {
  props: {
    label: Object,
    vocab: String,
    selectedConcepts: Array
  },
  data () {
    return {
      controller: new AbortController(),
      searchTerm: '',
      searchResults: [],
      showSearchResults: false,
      loading: false
    }
  },
  computed: {
    lang () {
      if (this.vocab === 'slm') {
        return this.UILang === 'sv' ? 'sv' : 'fi'
      } else if (this.vocab === 'yso-paikat') {
        return this.UILang === 'se' ? 'fi': this.UILang
      } else {
        return this.UILang
      }
    }
  },
  emits: ['update:selectedConcepts'],
  inject: ['UILang'],
  watch: {
    searchTerm () {
      if (this.searchTerm.length > 1) {
        // Abort any previous fetch request before starting a new one
        this.controller.abort()
        this.controller = new AbortController()

        this.loading = true

        const query = this.searchTerm

        const params = new URLSearchParams({ lang: this.lang, query: query + '*', unique: true })
        fetch('rest/v1/' + this.vocab + '/search/?' + params.toString(), { signal: this.controller.signal })
          .then(res => res.json())
          .then(data => {
            this.loading = false

            // Only continue if the query matches current search term to prevent a race condition
            if (query !== this.searchTerm) return

            if (data.results.length > 0) {
              this.searchResults = data.results
            } else {
              this.searchResults = [{ prefLabel: 'Termejä ei löydy hakusanalla' }]
            }
          })
          .catch(error => {
            if (error.name === 'AbortError') {
              console.log('Fetch was aborted')
            } else {
              console.log('Fetch failed:', error)
              this.loading = false
            }
          })
      } else {
        this.searchResults = []
        this.loading = false
      }
    }
  },
  methods: {
    selectConcept (concept) {
      if (!this.selectedConcepts.some(c => c.uri === concept.uri)) {
        this.$emit('update:selectedConcepts', [...this.selectedConcepts, concept])
      }
      this.clearInput()
    },
    removeConcept (i) {
      this.$emit('update:selectedConcepts', this.selectedConcepts.filter((_, idx) => idx !== i))
    },
    clearInput () {
      this.searchTerm = ''
      this.searchResults = []
    }
  },
  template: `
    <div class="suggestion-input-container">
      <label class="suggestion-input-label" :for="label.id">{{ label.text }}</label>

      <chip-list
        v-if="selectedConcepts.length > 0"
        :chips="selectedConcepts"
        @remove-chip="(i) => removeConcept(i)"
      ></chip-list>

      <div class="suggestion-search-wrapper suggestion-dropdown">
        <div v-click-outside="() => showSearchResults = false">
          <clear-input
            v-if="searchTerm && !loading"
            @clear-input="clearInput()"
          ></clear-input>
          <div class="suggestion-clear-input"
            v-if="loading"
            @click="clearInput()"
          >
            <i class="spinner fa-solid fa-spinner fa-spin-pulse"></i>
          </div>
          <input class="suggestion-input" type="text"
            v-model="searchTerm"
            :id="label.id"
            @click="showSearchResults = true"
          >
        </div>
        <ul class="dropdown-menu"
          v-if="searchResults.length > 0"
          :class="{ 'show': showSearchResults }"
        >
          <li
            v-for="r in searchResults"
            :key="r.uri"
            @click="r.uri && selectConcept(r)"
          >
            <a class="dropdown-item">{{ r.prefLabel }}</a>
          </li>
        </ul>
      </div>
    </div>
  `
}
