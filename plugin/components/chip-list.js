SUGGESTION_PLUGIN.chipListComponent = {
  props: {
    chips: Array
  },
  emits: ['remove-chip'],
  template: `
    <div class="suggestion-chip-list">
      <div class="suggestion-chip" role="button" :aria-label="$t('common.aria.remove')"
        v-for="(c, i) in chips"
        @click="$emit('remove-chip', i)"
      >
        <span>{{ c.prefLabel }}</span>
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </div>
    </div>
  `
}
