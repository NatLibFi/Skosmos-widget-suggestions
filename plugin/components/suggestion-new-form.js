SUGGESTION_PLUGIN.suggestionNewFormComponent = {
  data() {
    return {}
  },
  methods: {
    submit () {
      console.log('submit')
    }
  },
  template: `
    <div id="suggestion-form" role="form">
      <div id="suggestion-form-inputs">
      </div>
      <submit-button
        :text="'Lähetä käsite-ehdotus'"
        @submit="submit()"
      ></submit-button>
    </div>
  `
}
