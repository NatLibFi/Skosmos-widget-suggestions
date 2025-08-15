SUGGESTION_PLUGIN.suggestionNewComponent = {
  data() {
    return {
      showDialog: false
    }
  },
  inject: ['pageUrl', 'pageType'],
  mounted() {
    if (this.pageUrl.includes("#suggestion") && this.pageType === 'vocab-home'){
      console.log('open new')
      this.showDialog = true
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
        <h2>Ehdota uutta käsitettä tähän sanastoon</h2>
      </a>
      <template v-if="showDialog">
        <draggable-dialog @close-dialog="showDialog = false">
          <div id="suggestion-header">
            <h2 id="suggestion-title">
              Ehdota uutta käsitettä sanastoon
            </h2>
            <p id="suggestion-subtitle">
              Sanastossa jo oleviin käsitteisiin voit ehdottaa muutoksia käsitesivulta
            </p>
          </div>
          <suggestion-new-form></suggestion-new-form>
        </draggable-dialog>
      </template>
    </div>
  `
}
