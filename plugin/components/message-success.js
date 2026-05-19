SUGGESTION_PLUGIN.messageSuccessComponent = {
  props: {
    url: String
  },
  methods: {
    handleTabDownEvent (e) {
      // Move focus to close button
      e.preventDefault()
      document.querySelector('#suggestion-dialog-close button').focus({ preventScroll: true })
    }
  },
  template: `
    <div id="suggestion-header">
      <h2 id="suggestion-title" tabindex="-1">
        {{ $t('common.success.heading') }}
      </h2>
      <span id="suggestion-subtitle">
        <p>{{ $t('common.success.subheading1') }}</p>
        <p>
          {{ $t('common.success.subheading2') }}
          <a id="suggestion-success-link" target="_blank"
            :href="url"
            @keydown.tab="handleTabDownEvent($event)"
          >
            {{ $t('common.success.link') }}
          </a>.
        </p>
      </span>
    </div>
  `
}
