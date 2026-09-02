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
  created () {
    // Open dialog automatically on vocab home page if url includes #suggestion
    if (this.pageUrl.includes('#suggestion') && this.pageType === 'vocab-home') {
      this.showDialog = true
    }
  },
  methods: {
    async handleSubmitEvent () {
      // Only make a submission if a previous submission is not pending to prevent multiple submissions
      if (!this.submissionPending) {
        this.submissionPending = true

        // Call submit method inside the child 'suggestion-new-form' component
        const res = await this.$refs.newForm.submit()

        if (res) {
          // Show success message if a response was received
          this.url = res.replace('/repos', '').replace('api.', '')
          this.showSuccessMessage = true
          // Move focus to success message title after DOM has updated
          this.$nextTick(() => {
            document.getElementById('suggestion-title').focus({ preventScroll: true })
          })
        } else if (this.formIsValid) {
          // Show failure message if no response was received but form is valid
          this.showFailureMessage = true
          // Move focus to failure message title after DOM has updated
          this.$nextTick(() => {
            document.getElementById('suggestion-title').focus({ preventScroll: true })
          })
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
    },
    openDialog (e) {
      e.preventDefault()

      window.history.replaceState(null, document.title, this.pageUrl.split('#')[0] + '#suggestion')
      this.showDialog = true
      // Move focus to heading after DOM has updated
      this.$nextTick(() => {
        this.$refs.title.focus({ preventScroll: true })
      })
    }
  },
  template: `
    <div :class="{ 'p-0 my-2': pageType === 'concept' }">
      <a role="button" class="suggestion-link"
        :href="pageUrl.split('#')[0] + '#suggestion'"
        :class="{ 'suggestion-button': pageType === 'vocab-home' }"
        @click="openDialog($event)"
        @keydown.space="openDialog($event)"
      >
        <i class="fa-solid fa-pen-to-square"></i>&nbsp;
        <h2>
          {{ $t('new.button.line1') }}
          <span>{{ $t('new.button.line2') }}</span>
        </h2>
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
              <h2 id="suggestion-title" tabindex="-1" ref="title">
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
