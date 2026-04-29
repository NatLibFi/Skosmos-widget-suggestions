SUGGESTION_PLUGIN.messageFailureComponent = {
  methods: {
    handleTabDownEvent (e) {
      // Move focus to close button
      e.preventDefault()
      document.querySelector('#suggestion-dialog-close button').focus({ preventScroll: true })
    }
  },
  template: `
    <div id="suggestion-header">
      <h2 id="suggestion-title" tabindex="-1" @keydown.tab="handleTabDownEvent($event)">
        {{ $t('common.failure.heading') }}
      </h2>
      <span id="suggestion-subtitle">
        <p>{{ $t('common.failure.subheading1') }}</p>
        <p>{{ $t('common.failure.subheading2') }}</p>
      </span>
    </div>
  `
}
