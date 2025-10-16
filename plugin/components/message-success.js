SUGGESTION_PLUGIN.messageSuccessComponent = {
  props: {
    url: String
  },
  template: `
    <div id="suggestion-header">
      <h2 id="suggestion-title">
        {{ $t('common.success.heading') }}
      </h2>
      <span id="suggestion-subtitle">
        <p>{{ $t('common.success.subheading1') }}</p>
        <p>{{ $t('common.success.subheading2') }} <a :href="url">{{ $t('common.success.link') }}</a>.</p>
      </span>
    </div>
  `
}
