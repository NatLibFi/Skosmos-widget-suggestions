SUGGESTION_PLUGIN.createVueApp = function(pageType) {
  const vueApp = Vue.createApp({
    data() {
      return {
        pageType: pageType,
      }
    },
    provide() {
      return {
        pageUrl: window.location.href
      }
    },
    template: `
      <template v-if="pageType === 'concept'">
        <suggestion-change></suggestion-change>
      </template>
      <template v-if="pageType === 'vocab-home' || pageType === 'concept'">
        <suggestion-new :page-type="pageType"></suggestion-new>
      </template>
    `
  })

  vueApp.component('suggestion-new', {
    props: ['pageType'],
    data() {
      return {
        showDialog: false
      }
    },
    inject: ['pageUrl'],
    mounted() {
      if (this.pageUrl.includes("#suggestion") && this.pageType === 'vocab-home'){
        console.log('open new')
        this.$refs.button.click()
      }
    },
    template: `
      <div class="p-0 my-2">
        <a role="button" class="suggestion-link"
          @click="showDialog = true"
          :href="pageUrl.split('#')[0] + '#suggestion'"
          :class="{ 'suggestion-button': pageType === 'vocab-home' }"
          ref="button"
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
            <div id="suggestion-form" role="form">
              <div id="suggestion-form-inputs">
              </div>
            </div>
          </draggable-dialog>
        </template>
      </div>
    `
  })

  vueApp.component('suggestion-change', {
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
  })

  vueApp.component('draggable-dialog', this.draggableDialogComponent)
  vueApp.component('basic-input', this.basicInputComponent)
  vueApp.component('clear-input', this.clearInputComponent)

  return vueApp
}
