SUGGESTION_PLUGIN.suggestionChangeComponent = {
  data() {
    return {
      showDialog: false
    }
  },
  inject: ['pageUrl'],
  template: `
    <div class="p-0 my-2">
      <a role="button" class="suggestion-link"
        @click="showDialog = true"
        :href="pageUrl.split('#')[0] + '#suggestion'"
        ref="button"
      >
        <i class="fa-solid fa-pen-to-square"></i>&nbsp;
        <h2>Ehdota muutosta käsitteeseen</h2>
      </a>
      <template v-if="showDialog">
        <draggable-dialog @close-dialog="showDialog = false">
          <div id="suggestion-header">
            <h2 id="suggestion-title">
              Ehdota muutosta käsitteeseen {{ }}
            </h2>
            <p id="suggestion-subtitle">
              Kuka tahansa sanaston käyttäjä saa ehdottaa muutoksia sanastoon
            </p>
          </div>
          <div id="suggestion-form" role="form">
            <div id="suggestion-form-inputs">
            </div>
          </div>
        </draggable-dialog>
      </template>
    </div>
  `
}
