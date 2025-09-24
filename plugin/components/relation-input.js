SUGGESTION_PLUGIN.relationInputComponent = {
  props: {
    label: Object,
    vocab: String,
    lang: String,
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
  emits: ['update:selectedConcepts'],
  watch: {
    searchTerm () {
      if (this.searchTerm.length > 1) {
        // Abort any previous fetch request before starting a new one
        this.controller.abort()
        this.controller = new AbortController()

        this.loading = true

        const params = new URLSearchParams({ lang: this.lang, query: this.searchTerm + '*', unique: true })
        return fetch('rest/v1/' + this.vocab + '/search/?' + params.toString(), { signal: this.controller.signal })
          .then(res => res.json())
          .then(data => {
            console.log(data)
            this.searchResults = data.results
            this.loading = false
          })
          .catch(error => {
            if (error.name === 'AbortError') {
              console.log('Fetch was aborted', this.controller.signal)
            } else {
              console.log('Fetch failed:', error)
              this.loading = false
            }
          })
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
            @click="selectConcept(r)"
          >
            <a class="dropdown-item">{{ r.prefLabel }}</a>
          </li>
        </ul>
      </div>
    </div>
  `
}
