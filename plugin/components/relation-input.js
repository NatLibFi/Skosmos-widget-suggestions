SUGGESTION_PLUGIN.relationInputComponent = {
  inject: ['UILang'],
  props: {
    label: Object,
    vocab: String,
    selectedConcepts: Array
  },
  emits: ['update:selectedConcepts'],
  data () {
    return {
      controller: new AbortController(),
      searchTerm: '',
      searchResults: [],
      showSearchResults: false,
      loading: false,
      optionInFocus: 0
    }
  },
  computed: {
    lang () {
      // Determine language of searches based on supported languages of each vocab with Finnish as fallback
      if (this.vocab === 'slm') {
        return this.UILang === 'sv' ? 'sv' : 'fi'
      } else if (this.vocab === 'yso-paikat') {
        return this.UILang === 'se' ? 'fi' : this.UILang
      } else {
        return this.UILang
      }
    }
  },
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
              this.searchResults = [{ prefLabel: this.$t('new.common.none') }]
            }

            this.showSearchResults = true
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
      // Only select each concept once
      if (!this.selectedConcepts.some(c => c.uri === concept.uri)) {
        this.$emit('update:selectedConcepts', [...this.selectedConcepts, concept])
      }
      this.clearInput()
    },
    removeConcept (i, e) {
      this.$emit('update:selectedConcepts', this.selectedConcepts.filter((_, idx) => idx !== i))
      
      // If last chip was removed using keyboard, move focus to input
      this.$nextTick(() => {
        if (this.selectedConcepts.length === 0 && e.type === 'keydown') {
          this.$refs.input.focus()
        }
      })
    },
    clearInput () {
      this.searchTerm = ''
      this.searchResults = []
    },
    handleInputKeydownEvent (e) {
      if (e.key === 'Tab' || e.key === 'Escape') {
        // Close dropdown
        this.showSearchResults = false
      }

      // If there are no results, do nothing
      if (this.searchResults.length === 0 || !this.searchResults[0].uri) return

      if (e.key === 'ArrowUp') {
        // Move focus to last list item
        e.preventDefault()
        this.optionInFocus = this.searchResults.length - 1
        this.showSearchResults = true
        this.$nextTick(() => {
          this.$refs['option' + this.optionInFocus][0].focus()
        })
      } else if (e.key === 'ArrowDown') {
        // Move focus to first list item
        e.preventDefault()
        this.optionInFocus = 0
        this.showSearchResults = true
        this.$nextTick(() => {
          this.$refs['option' + this.optionInFocus][0].focus()
        })
      }
    },
    handleListItemKeydownEvent (e, r) {
      if (e.key === 'Enter' || e.key === ' ') {
        // Select group and close dropdown
        e.preventDefault()
        this.selectConcept(r)
        this.$refs.input.focus()
        this.showSearchResults = false
      } else if (e.key === 'Tab') {
        // Close dropdown and move focus to previous/next form field
        this.showSearchResults = false
      } else if (e.key === 'ArrowUp') {
        // On first element close dropdown, otherwise move focus to previous list item
        e.preventDefault()
        if (this.optionInFocus === 0) {
          this.$refs.input.focus()
          this.showSearchResults = false
        } else {
          this.optionInFocus = this.optionInFocus - 1
          this.$refs['option' + this.optionInFocus][0].focus()
        }
      } else if (e.key === 'ArrowDown') {
        // On last element move focus to first list item, otherwise next list item
        e.preventDefault()
        this.optionInFocus = (this.optionInFocus + 1) % this.searchResults.length
        this.$refs['option' + this.optionInFocus][0].focus()
      } else if (e.key === 'End') {
        // Move focus to last list item
        e.preventDefault()
        this.optionInFocus = this.searchResults.length - 1
        this.$refs['option' + this.optionInFocus][0].focus()
      } else if (e.key === 'Home') {
        // Move focus to first list item
        e.preventDefault()
        this.optionInFocus = 0
        this.$refs['option' + this.optionInFocus][0].focus()
      } else if (e.key === 'Escape') {
        // Close dropdown and focus on input
        this.$refs.input.focus()
        this.showSearchResults = false
      }
    }
  },
  template: `
    <div class="suggestion-input-container">
      <label class="suggestion-input-label" :for="label.id">{{ label.text }}</label>

      <chip-list
        v-if="selectedConcepts.length > 0"
        :chips="selectedConcepts"
        @remove-chip="(i, e) => removeConcept(i, e)"
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
            <i class="spinner fa-solid fa-spinner fa-spin-pulse" aria-hidden="true"></i>
          </div>
          <input class="suggestion-input" type="text" role="combobox" aria-autocomplete="list"
            ref="input"
            v-model="searchTerm"
            :id="label.id"
            :aria-controls="label.id + '-list'"
            :aria-expanded="showSearchResults"
            @focus="showSearchResults = true"
            @keydown="handleInputKeydownEvent($event)"
          >
        </div>
        <ul role="listbox" tabindex="-1"
          v-if="searchResults.length > 0"
          :class="{ 'show': showSearchResults }"
          :id="label.id + '-list'"
        >
          <li role="option"
            v-for="(r, i) in searchResults"
            :key="r.uri"
            :ref="'option' + i"
            :tabindex="r.uri ? 0 : -1"
            :aria-disabled="!r.uri"
            @click="r.uri && selectConcept(r)"
            @keydown="handleListItemKeydownEvent($event, r)"
          >
            <a>{{ r.prefLabel }}</a>
          </li>
        </ul>
      </div>
    </div>
  `
}
