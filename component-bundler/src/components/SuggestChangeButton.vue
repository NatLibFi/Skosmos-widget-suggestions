<template>
  <div>
    <div id="progressBox" v-bind:class="{ invisible: toBeShown }">
      <img :src="wait" height="20px" width="200px" />
    </div>
    <div :class="{ invisible: !toBeShown }">
      <a role="button" @click="isOpened = !isOpened" id="fordirectmodify" :href="`${pageUrl.split('#')[0]}#suggestion`" >
        <span>{{ $t('edit.button') }}</span>
      </a>
      <centered-dialog
        v-if="isOpened"
        @close="closeDialog()">
        <edit-suggestion
          v-if="!showSuccessMessage && !showFailureMessage"
          :d="formData"
          :v="$v.formData"
          :label="label"
          :uri="uri"
          @update:conceptType="formData.conceptType.value = $event"
          @update:primaryPrefLabel="formData.prefLabel.primary = $event"
          @update:description="formData.description = $event"
          @update:reason="formData.reason = $event"
          @update:fromOrg="formData.fromOrg = $event"
          @submitForm="submitForm()"
          />
          <success-message v-if="showSuccessMessage" :suggestionUrl="suggestionUrl" :url="url"/>
          <failure-message v-if="showFailureMessage" />
      </centered-dialog>
    </div>
  </div>
</template>

<script>
import EditSuggestion from './EditSuggestion';
import CenteredDialog from './common/CenteredDialog';
import SuccessMessage from './common/SuccessMessage';
import FailureMessage from './common/FailureMessage';
import { required, minLength } from 'vuelidate/lib/validators';
import axios from 'axios';
import wait from "./resources/wait.gif";

export default {
  components: {
    EditSuggestion,
    CenteredDialog,
    SuccessMessage,
    FailureMessage
  },
  props: {
    lang: String,
    vocab: String,
    label: String,
    uri: String,
    url: String
  },
  beforeMount: function () {
    if (this.lang === 'sv') {
      this.$i18n.locale = this.lang;
    }
  },
  data: () => {
    return {
      wait: wait,
      toBeShown: false,
      // toBeDisplayed: 'content',
      tempWidth: 100,
      pageUrl : "",
      isOpened: false,
      showSuccessMessage: false,
      showFailureMessage: false,
      suggestionUrl: '',
      formData: {
        description: '',
        reason: '',
        fromOrg: ''
      }
    }
  },
  created: function() {
    this.delay();
    this.getUrl();
  },
  methods: {
    delay: async function(){
      const timeToWait = 10000;
      const waitAWhile = ms => new Promise(resolved => setTimeout(resolved, ms));
      await waitAWhile(timeToWait);
      this.toBeShown = true;
    },
    async getUrl () {
      this.pageUrl = window.location.href;
    },
    submitForm () {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.sendData();
      } else {
        console.log('Data not sent: required data of the form was not provided.');
      }
    },
    async sendData () {
      let data = `
**Käsitteen tyyppi**

Muutos olemassa olevaan käsitteeseen

**prefabel**

[${this.label}](${this.uri})

**Tila**

Käsittelyssä

**Ehdotettu muutos**

${this.formData.description}

**Perustelut ehdotukselle**

${this.formData.reason}

**Ehdottajan organisaatio**

${this.formData.fromOrg}

`
      let dataBundle = {
        "title": this.label,
        "body": data,
        "state": "open",
        "labels": ["muutos"]
      };

      var urlencode = require('urlencode');
      const payload = encodeURIComponent(JSON.stringify(dataBundle));

      var urlToPrx = require('../prx.json');
      await axios.post(`${urlToPrx[0].url}?payload=${payload}`).then(response => {
        this.toggleSuccessMessage(`${response.data.url.replace("/repos", "").replace("api.", "")}`);
      })
      .catch(error => {
        console.log(error)
        this.toggleFailureMessage();
      });
    },
    toggleSuccessMessage(responseUrl) {
      if (responseUrl && responseUrl.length > 0) {
        this.suggestionUrl = responseUrl;
        this.showSuccessMessage = true;
      }
      this.showSuccessMessage = true;
    },
    toggleFailureMessage() {
      this.showFailureMessage = true;
    },
    handlePrefLabelLanguages () {
      if (this.lang === 'sv') {
        return {
          sv: {
            value: this.label,
            uri: this.uri
          },
          en: '',
          fi: {
            value: '',
            uri: ''
          }
        }
      }
      return {
        fi: {
          value: this.label,
          uri: this.uri
        },
        en: '',
        sv: {
          value: '',
          uri: ''
        }
      }
    },
    closeDialog () {
      this.isOpened = !this.isOpened;
      this.showSuccessMessage = false;
      this.showFailureMessage = false;
      this.suggestionUrl = '';
      this.$v.$reset();
      this.formData = {
        description: '',
        reason: '',
        fromOrg: ''
      };
    }
  },
  validations: {
    formData: {
      description: { required },
      reason: { required }
    }
  }
}
</script>

<style>
  .invisible {
    visibility: hidden;
  }
  #progressBox {
    /*background-color: #83cfc8;*/
    height: 1px;
    width: 15px;
  }
  ::placeholder {
    color: #5ea8B7;
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: #5ea8B7;
    opacity: 1;
  }

  ::-ms-input-placeholder {
    color: #5ea8B7;
    opacity: 1;
  }
</style>

<style scoped>
  a {
    cursor: pointer;
    cursor: hand;
  }
</style>
