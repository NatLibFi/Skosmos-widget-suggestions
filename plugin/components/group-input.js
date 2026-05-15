SUGGESTION_PLUGIN.groupInputComponent = {
  inject: ['UILang'],
  props: {
    selectedGroups: Array
  },
  emits: ['update:selectedGroups'],
  data () {
    return {
      groups: [],
      loading: false,
      optionInFocus: 0
    }
  },
  created () {
    this.loading = true
    fetch('rest/v1/yso/groups?lang=' + this.UILang)
      .then(res => res.json())
      .then(data => {
        this.groups = data.groups
        this.loading = false
      })
      .catch(error => {
        console.log('Fetch failed:', error)
        this.loading = false
      })
  },
  methods: {
    selectGroup (group) {
      // Remove selected group from the list of selectable groups
      this.groups = this.groups.filter(g => g.uri !== group.uri)
      this.optionInFocus = 0

      this.$emit('update:selectedGroups', [...this.selectedGroups, group])
    },
    removeGroup (i, e) {
      // Add the group back to the list of selectable groups and order the list alphabetically
      const group = this.selectedGroups[i]
      this.groups.push(group)
      this.groups.sort((a, b) => (a.prefLabel > b.prefLabel) ? 1 : ((b.prefLabel > a.prefLabel) ? -1 : 0))

      this.$emit('update:selectedGroups', this.selectedGroups.filter((_, idx) => idx !== i))

      // If last chip was removed using keyboard, move focus manually
      this.$nextTick(() => {
        if (e.type === 'keydown') {
          if (this.selectedGroups.length === 0) {
            // Last remaining chip -> focus to input
            this.$refs.button.focus()
          } else if (i === this.selectedGroups.length) {
            // Last chip otherwise -> focus to remaining last chip
            console.log(this.$refs.chiplist.$refs, i)
            this.$refs.chiplist.$refs['chip' + (i - 1)][0].focus()
          }
        }
      })
    },
    handleDropdownButtonKeyupEvent (e) {
      if (e.key === 'ArrowUp') {
        // Move focus to last list item
        this.optionInFocus = this.groups.length - 1
        this.$refs['option' + this.optionInFocus][0].focus()
      } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
        // Move focus to first list item
        this.optionInFocus = 0
        this.$refs['option' + this.optionInFocus][0].focus()
      } else if (e.key === ' ') {
        // Open dropdown and move focus to first list item
        e.preventDefault()
        const dropdown = bootstrap.Dropdown.getOrCreateInstance(this.$refs.button)
        dropdown.show()
        this.optionInFocus = 0
        this.$refs['option' + this.optionInFocus][0].focus()
      } else if (e.key === 'Tab') {
        // Close dropdown and move focus to previous/next form field
        const dropdown = bootstrap.Dropdown.getOrCreateInstance(this.$refs.button)
        dropdown.hide()
        this.optionInFocus = 0
      }
    },
    handleListItemKeydownEvent (e, g) {
      if (e.key === 'Enter' || e.key === ' ') {
        // Select group and close dropdown
        e.preventDefault()
        this.selectGroup(g)
        const dropdown = bootstrap.Dropdown.getOrCreateInstance(this.$refs.button)
        dropdown.hide()
      } else if (e.key === 'Tab') {
        // Close dropdown and move focus to previous/next form field
        const dropdown = bootstrap.Dropdown.getOrCreateInstance(this.$refs.button)
        dropdown.hide()
        this.optionInFocus = 0
      }
    },
    handleListItemKeyupEvent (e) {
      if (e.key === 'ArrowUp') {
        // On first element close dropdown, otherwise move focus to previous list item
        if (this.optionInFocus === 0) {
          const dropdown = bootstrap.Dropdown.getOrCreateInstance(this.$refs.button)
          dropdown.hide()
        } else {
          this.optionInFocus = this.optionInFocus - 1
          this.$refs['option' + this.optionInFocus][0].focus()
        }
      } else if (e.key === 'ArrowDown') {
        // On last element move focus to first list item, otherwise next list item
        this.optionInFocus = (this.optionInFocus + 1) % this.groups.length
        this.$refs['option' + this.optionInFocus][0].focus()
      } else if (e.key === 'End') {
        // Move focus to last list item
        e.preventDefault()
        this.optionInFocus = this.groups.length - 1
        this.$refs['option' + this.optionInFocus][0].focus()
      } else if (e.key === 'Home') {
        // Move focus to first list item
        e.preventDefault()
        this.optionInFocus = 0
        this.$refs['option' + this.optionInFocus][0].focus()
      }
    }
  },
  template: `
    <div class="suggestion-input-container">
      <h3 id="suggestion-group-label" class="suggestion-input-label">{{ $t('new.groups.label' )}}</h3>

      <chip-list ref="chiplist"
        v-if="selectedGroups.length > 0"
        :chips="selectedGroups"
        @remove-chip="(i, e) => removeGroup(i, e)"
      ></chip-list>

      <div id="suggestion-group" class="suggestion-dropdown btn-group" aria-labelledby="suggestion-group-label">
        <button id="suggestion-group-button" class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" data-bs-display="static" aria-expanded="false" aria-haspopup="listbox"
          ref="button"
          v-click-outside="() => optionInFocus = 0"
          @keyup="handleDropdownButtonKeyupEvent($event)"
        >
          {{ $t('new.groups.placeholder') }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="suggestion-group" tabindex="-1" role="listbox">
          <template v-if="loading">
            <li>
              <a class="dropdown-item"><i class="spinner fa-solid fa-spinner fa-spin-pulse" aria-hidden="true"></i></a>
            </li>
          </template>
          <template v-else>
            <li tabindex="0" role="option"
              v-for="(g, i) in groups"
              :key="g.uri"
              :ref="'option' + i"
              @click="selectGroup(g)"
              @keydown="handleListItemKeydownEvent($event, g)"
              @keyup="handleListItemKeyupEvent($event)"
            >
              <a class="dropdown-item">{{ g.prefLabel }}</a>
            </li>
          </template>
        </ul>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </div>
    </div>
  `
}
