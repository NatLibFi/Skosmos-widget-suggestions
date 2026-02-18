SUGGESTION_PLUGIN.exactMatchInputComponent = {
  props: {
    matches: Array,
    links: Array
  },
  emits: ['update:matches'],
  computed: {
    labelString () {
      return this.$t('new.exactMatches.label', {links: this.links.map(l => `<a target="_blank" href="${l.url}">${l.text}</a>`).join(', ')})
    }
  },
  methods: {
    updateMatches (i, value, createNew = true) {
      let newMatches = [...this.matches] // Copy of matches array
      newMatches[i] = value
      this.$emit('update:matches', newMatches)

      // If updating last match, add a new one to the end of the array
      if (i === newMatches.length - 1 && createNew) {
        this.$emit('update:matches', [ ...newMatches, '' ])
      }
    },
    removeMatchInput (i) {
      this.$emit('update:matches', this.matches.filter((_, idx) => idx !== i))
    }
  },
  template: `
    <div class="suggestion-input-container">
        <h3 class="suggestion-input-label" id="suggestion-match-label" v-html="labelString"></h3>

        <div aria-labelledby="suggestion-match-label">
          <label class="suggestion-input-label sr-only" for="suggestion-match-input-0">
            $t('new.exactMatches.ariaLabel')
          </label>
          <clear-input
            v-if="matches[0]"
            @clear-input="updateMatches(0, '', false)"
          ></clear-input>
          <input class="suggestion-input" id="suggestion-match-input-0" type="text"
            :placeholder="$t('new.exactMatches.placeholder')"
            :value="matches[0]"
            @input="updateMatches(0, $event.target.value)"
          >
          <template v-if="matches.length > 1">
            <template v-for="(m, i) in matches.slice(1)">
              <label class="suggestion-input-label sr-only"
                :for="'suggestion-match-input-' + (i + 1)"
              >$t('new.exactMatches.ariaLabel')</label>
              <clear-input @clear-input="removeMatchInput(i + 1)"></clear-input>
              <input class="suggestion-input" type="text"
                :id="'suggestion-match-input-' + (i + 1)"
                :placeholder="$t('new.exactMatches.placeholder')"
                :value="m"
                @input="updateMatches(i + 1, $event.target.value)"
              >
            </template>
          </template>
        </div>
      </div>
  `
}
