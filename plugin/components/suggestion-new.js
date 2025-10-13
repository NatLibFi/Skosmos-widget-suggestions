SUGGESTION_PLUGIN.suggestionNewComponent = {
  data() {
    return {
      showDialog: false,
      formIsValid: false
    }
  },
  inject: ['pageUrl', 'pageType'],
  mounted() {
    if (this.pageUrl.includes("#suggestion") && this.pageType === 'vocab-home'){
      console.log('open new')
      this.showDialog = true
    }
  },
  methods: {
    handleSubmitEvent() {
      // Call submit method inside newForm component
      this.$refs.newForm.submit()
    }
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
        <draggable-dialog @close-dialog="showDialog = false">
          <template #content>
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
