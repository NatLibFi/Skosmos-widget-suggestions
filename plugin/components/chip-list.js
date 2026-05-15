SUGGESTION_PLUGIN.chipListComponent = {
  props: {
    chips: Array
  },
  emits: ['remove-chip'],
  template: `
    <div class="suggestion-chip-list">
      <div class="suggestion-chip" role="button" tabindex="0"
        v-for="(c, i) in chips"
        :aria-label="$t('common.aria.deselect') + ' ' + c.prefLabel"
        :ref="'chip' + i"
        @click="$emit('remove-chip', i, $event)"
        @keydown.enter="$emit('remove-chip', i, $event)"
        @keydown.space="$emit('remove-chip', i, $event)"
      >
        <span>{{ c.prefLabel }}</span>
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </div>
    </div>
  `
}
