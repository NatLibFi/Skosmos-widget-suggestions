SUGGESTION_PLUGIN.suggestionChangeComponent = {
  data() {
    return {
      showDialog: false,
      formIsValid: false
    }
  },
  inject: ['pageUrl', 'prefLabels'],
  methods: {
    handleSubmitEvent() {
      // Call submit method inside changeForm component
      this.$refs.changeForm.submit()
    }
  },
  template: `
    <div class="p-0 my-2">
      <a role="button" class="suggestion-link"
        ref="button"
        :href="pageUrl.split('#')[0] + '#suggestion'"
        @click="showDialog = true"
      >
        <i class="fa-solid fa-pen-to-square"></i>&nbsp;
        <h2>{{ $t('change.button') }}</h2>
      </a>
      <template v-if="showDialog">
        <draggable-dialog @close-dialog="showDialog = false">
          <template #content>
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
          <template #footer>
            <submit-button
              :text="$t('change.submit')"
              :disabled="!formIsValid"
              @submit="handleSubmitEvent()"
            ></submit-button>
          </template>
        </draggable-dialog>
      </template>
    </div>
  `
}
