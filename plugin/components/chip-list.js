SUGGESTION_PLUGIN.chipListComponent = {
  props: {
    chips: Array
  },
  emits: ['remove-chip'],
  template: `
    <div class="suggestion-chip-list">
      <div class="suggestion-chip" role="button"
        v-for="(c, i) in chips"
        :aria-label="$t('common.aria.remove')"
        @click="$emit('remove-chip', i)"
      >
        <span>{{ c.prefLabel }}</span>
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </div>
    </div>
  `
}
