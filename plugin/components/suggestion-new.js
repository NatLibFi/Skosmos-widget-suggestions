SUGGESTION_PLUGIN.suggestionNewComponent = {
  inject: ['pageUrl', 'pageType'],
  data () {
    return {
      showDialog: false,
      formIsValid: false,
      showSuccessMessage: false,
      showFailureMessage: false,
      url: '',
      submissionPending: false
    }
  },
  computed: {
    linkUrl() {
      return this.pageType === 'vocab-home' ? this.pageUrl.split('#')[0] + '#suggestion' : null
    }
  },
  created () {
    if (this.pageUrl.includes("#suggestion") && this.pageType === 'vocab-home'){
      this.showDialog = true
    }
  },
  methods: {
    async handleSubmitEvent () {
      // Only make a submission if a previous submission is not pending
      if (!this.submissionPending) {
        this.submissionPending = true

        // Call submit method inside the child 'suggestion-new-form' component
        const res = await this.$refs.newForm.submit()

        // Show success message if a response was received
        if (res) {
          this.url = res.replace('/repos', '').replace('api.', '')
          this.showSuccessMessage = true
        // Show failure message if no response was received but form is valid
        } else if (this.formIsValid) {
          this.showFailureMessage = true
        }

        this.submissionPending = false
      }
    },
    handleCloseDialogEvent () {
      this.showDialog = false
      this.formIsValid = false
      this.showSuccessMessage = false
      this.showFailureMessage = false
      this.url = ''

      // Remove #suggestion from page URL
      window.history.replaceState(null, document.title, this.pageUrl.split('#')[0])
    }
  },
  template: `
    <div class="p-0 my-2">
      <a id="suggestion" role="button" class="suggestion-link"
        :href="linkUrl"
        :class="{ 'suggestion-button': pageType === 'vocab-home' }"
        @click="showDialog = true"
      >
        <i class="fa-solid fa-pen-to-square"></i>&nbsp;
        <h2>{{ $t('new.button') }}</h2>
      </a>
      <template v-if="showDialog">
        <draggable-dialog
          :show-footer="!showSuccessMessage && !showFailureMessage"
          :submit-text="$t('new.submit')"
          :submit-disabled="!formIsValid"
          @close-dialog="handleCloseDialogEvent()"
          @submit="handleSubmitEvent()"
        >
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
        </draggable-dialog>
      </template>
    </div>
  `
}
