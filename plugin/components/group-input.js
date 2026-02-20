SUGGESTION_PLUGIN.groupInputComponent = {
  inject: ['UILang'],
  props: {
    selectedGroups: Array
  },
  emits: ['update:selectedGroups'],
  data () {
    return {
      groups: [],
      loading: false
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

      this.$emit('update:selectedGroups', [...this.selectedGroups, group])
    },
    removeGroup (i) {
      // Add the group back to the list of selectable groups and order the list alphabetically
      const group = this.selectedGroups[i]
      this.groups.push(group)
      this.groups.sort((a, b) => (a.prefLabel > b.prefLabel) ? 1 : ((b.prefLabel > a.prefLabel) ? -1 : 0))

      this.$emit('update:selectedGroups', this.selectedGroups.filter((_, idx) => idx !== i))
    }
  },
  template: `
    <div class="suggestion-input-container">
      <h3 id="suggestion-group-label" class="suggestion-input-label">{{ $t('new.groups.label' )}}</h3>

      <chip-list
        v-if="selectedGroups.length > 0"
        :chips="selectedGroups"
        @remove-chip="(i) => removeGroup(i)"
      ></chip-list>

      <div class="suggestion-dropdown btn-group" aria-labelledby="suggestion-group-label">
        <button id="suggestion-group" class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" data-bs-display="static" aria-expanded="false">
          {{ $t('new.groups.placeholder') }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="suggestion-group">
          <template v-if="loading">
            <li>
              <a class="dropdown-item"><i class="spinner fa-solid fa-spinner fa-spin-pulse" aria-hidden="true"></i></a>
            </li>
          </template>
          <template v-else>
            <li
              v-for="g in groups"
              :key="g.uri"
              @click="selectGroup(g)"
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
