SUGGESTION_PLUGIN.suggestionNewComponent = {
  inject: ['pageUrl', 'pageType'],
  data () {
    return {
      showDialog: false,
      formIsValid: false,
      showSuccessMessage: false,
      showFailureMessage: false,
      url: ''
    }
  },
  created () {
    if (this.pageUrl.includes("#suggestion") && this.pageType === 'vocab-home'){
      console.log('open new')
      this.showDialog = true
    }
  },
  methods: {
    handleSubmitEvent () {
      // Call submit method inside the child 'suggestion-new-form' component
      const res = this.$refs.newForm.submit()

      // Show success message if a response was received
      if (res) {
        this.url = res.replace('/repos', '').replace('api.', '')
        this.showSuccessMessage = true
      // Show failure message if no response was received but form is valid
      } else if (this.formIsValid) {
        this.showFailureMessage = true
      }
    },
  },
  template: `
    <div class="p-0 my-2">
      <a role="button" class="suggestion-link"
        :href="pageUrl.split('#')[0] + '#suggestion'"
        :class="{ 'suggestion-button': pageType === 'vocab-home' }"
        @click="showDialog = true"
      >
        <i class="fa-solid fa-pen-to-square"></i>&nbsp;
        <h2>{{ $t('new.button') }}</h2>
      </a>
      <template v-if="showDialog">
        <draggable-dialog
          :show-footer="!showSuccessMessage && !showFailureMessage"
          @close-dialog="showDialog = false"
        >
          <template #content>
            <template v-if="!showSuccessMessage && !showFailureMessage">
              <div id="suggestion-header">
                <h2 id="suggestion-title">
                  {{ $t('new.heading') }}
                </h2>
                <p id="suggestion-subtitle">
                  {{ $t('new.subheading') }}
                </p>
              </div>
              <suggestion-new-form
                ref="newForm"
                @update-form-is-valid="(e) => this.formIsValid = e"
              ></suggestion-new-form>
            </template>
            <message-success v-if="showSuccessMessage" :url="url" />
            <message-failure v-if="showFailureMessage" />
          </template>
          <template #footer>
            <submit-button
              :text="$t('new.submit')"
              :disabled="!formIsValid"
              @submit="handleSubmitEvent()"
            ></submit-button>
          </template>
        </draggable-dialog>
      </template>
    </div>
  `
}
