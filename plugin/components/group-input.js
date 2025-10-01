SUGGESTION_PLUGIN.groupInputComponent = {
  props: {
    lang: String,
    selectedGroups: Array
  },
  data () {
    return {
      groups: []
    }
  },
  emits: ['update:selectedGroups'],
  created () {
    fetch('rest/v1/yso/groups?lang=' + this.lang)
      .then(res => res.json())
      .then(data => {
        this.groups = data.groups
      })
      .catch(error => {
        console.log('Fetch failed:', error)
      })
  },
  methods: {
    selectGroup (group) {
      // Remove selected group from list
      this.groups = this.groups.filter(g => g.uri !== group.uri)

      this.$emit('update:selectedGroups', [...this.selectedGroups, group])
    },
    removeGroup (i) {
      // Add the group back to the list and order the list alphabetically
      const group = this.selectedGroups[i]
      this.groups.push(group)
      this.groups.sort((a, b) => (a.prefLabel > b.prefLabel) ? 1 : ((b.prefLabel > a.prefLabel) ? -1 : 0))

      this.$emit('update:selectedGroups', this.selectedGroups.filter((_, idx) => idx !== i))
    }
  },
  template: `
    <div class="suggestion-input-container">
      <h3 id="suggestion-group-label" class="suggestion-input-label">YSOn temaattinen ryhmä:</h3>

      <chip-list
        v-if="selectedGroups.length > 0"
        :chips="selectedGroups"
        @remove-chip="(i) => removeGroup(i)"
      ></chip-list>

      <div class="suggestion-dropdown btn-group" aria-labelledby="suggestion-group-label">
        <button id="suggestion-group" class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" data-bs-display="static" aria-expanded="false">
          Valitse ryhmät listalta
        </button>
        <ul class="dropdown-menu" aria-labelledby="suggestion-group">
          <li
            v-for="g in groups"
            :key="g.uri"
            @click="selectGroup(g)"
          >
            <a class="dropdown-item">{{ g.prefLabel }}</a>
          </li>
        </ul>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </div>
    </div>
  `
}
