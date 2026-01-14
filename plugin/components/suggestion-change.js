SUGGESTION_PLUGIN.suggestionChangeComponent = {
  inject: ['prefLabels'],
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
  methods: {
    async handleSubmitEvent () {
      // Only make submission if a previous submission is not pending
      if (!this.submissionPending) {
        this.submissionPending = true

        // Call submit method inside the child 'suggestion-change-form' component
        const res = await this.$refs.changeForm.submit()

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
    }
  },
  template: `
    <div class="p-0 my-2">
      <a role="button" class="suggestion-link"
        ref="button"
        @click="showDialog = true"
      >
        <i class="fa-solid fa-pen-to-square"></i>&nbsp;
        <h2>{{ $t('change.button') }}</h2>
      </a>
      <template v-if="showDialog">
        <draggable-dialog
          :show-footer="!showSuccessMessage && !showFailureMessage"
          :submit-text="$t('change.submit')"
          :submit-disabled="!formIsValid"
          @close-dialog="handleCloseDialogEvent()"
          @submit="handleSubmitEvent()"
        >
          <template v-if="!showSuccessMessage && !showFailureMessage">
            <div id="suggestion-header">
              <h2 id="suggestion-title">
                {{ $t('change.heading') }} {{ prefLabels[0].label }}
              </h2>
              <p id="suggestion-subtitle">
                {{ $t('change.subheading') }}
              </p>
            </div>
            <suggestion-change-form
              ref="changeForm"
              @update-form-is-valid="(e) => this.formIsValid = e"
            ></suggestion-change-form>
          </template>
          <message-success v-if="showSuccessMessage" :url="url" />
          <message-failure v-if="showFailureMessage" />
        </draggable-dialog>
      </template>
    </div>
  `
}
