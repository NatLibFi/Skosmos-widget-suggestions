<template>
  <div>
    <a role="button" @click="isOpened = !isOpened" id="fordirectnew" :href="`${pageUrl.split('#')[0]}#suggestion`" >
      <span>
        <div id="vocab-info">
          <div>
            <h3>{{ $t('new.button') }}</h3>
          </div>
        </div>
      </span>
    </a>
    <centered-dialog
      v-if="isOpened"
      @close="closeDialog()">
      <new-suggestion
        v-if="!showSuccessMessage && !showFailureMessage"
        :d="formData"
        :v="$v.formData"
        @update:vocabulary="formData.vocabulary = $event"
        @update:conceptType="formData.conceptType.value = $event"
        @update:primaryPrefLabel="formData.prefLabel.primary = $event"
        @update:secondaryPrefLabel="formData.prefLabel.secondary = $event"
        @update:enPrefLabel="formData.prefLabel.en = $event"
        @update:altLabels="formData.altLabels = $event"
        @update:broaderLabels="formData.broaderLabels = $event"
        @update:narrowerLabels="formData.narrowerLabels = $event"
        @update:relatedLabels="formData.relatedLabels = $event"
        @update:groups="formData.groups.selectedGroups = $event"
        @update:exactMatches="formData.exactMatches = $event"
        @update:scopeNote="formData.scopeNote = $event"
        @update:explanation="formData.explanation = $event"
        @update:neededFor="formData.neededFor = $event"
        @update:fromOrg="formData.fromOrg = $event"
        @submitForm="submitForm()"
        />

        <success-message v-if="showSuccessMessage" :suggestionUrl="suggestionUrl" :url="url"/>
        <failure-message v-if="showFailureMessage" />
    </centered-dialog>
  </div>
</template>

<script>
import NewSuggestion from './NewSuggestion';
import CenteredDialog from './common/CenteredDialog';
import SuccessMessage from './common/SuccessMessage';
import FailureMessage from './common/FailureMessage';
import { required, minLength } from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  components: {
    NewSuggestion,
    CenteredDialog,
    SuccessMessage,
    FailureMessage
  },
  props: {
    lang: String,
    vocab: String,
    url: String
  },
  beforeMount: function () {
    if (this.lang === 'sv') {
      this.$i18n.locale = this.lang;
    }
    this.setDropDown();
    this.getGroups();
  },
  data: () => {
    return {
      pageUrl : "",
      isOpened: false,
      showSuccessMessage: false,
      showFailureMessage: false,
      suggestionUrl: '',
      formData: {
        // vocabulary: 'yso',
        vocabulary: vocab,
        conceptType: {
          value: '',
          options: [
            {
              value: '',
              vocab: 'yso'
            },
            {
              value: '',
              vocab: 'yso-paikat'
            }
          ]
        },
        prefLabel: {
          primary: '',
          secondary: '',
          fi: {
            value: ''
          },
          sv: {
            value: ''
          },
          en: ''
        },
        altLabels: [{
          value: '',
          isTouched: false
        }],
        broaderLabels: [{
          value: '',
          uri: '',
          isTouched: false
        }],
        narrowerLabels: [{
          value: '',
          uri: '',
          isTouched: false
        }],
        relatedLabels: [{
          value: '',
          uri: '',
          isTouched: false
        }],
        groups: {
          allGroups: [],
          selectedGroups: []
        },
        exactMatches: [{
          vocab: '',
          value: '',
          isTouched: false
        }],
        scopeNote: '',
        explanation: '',
        neededFor: '',
        fromOrg: '',
        tags: []
      }
    }
  },
  created: function() {
    this.getGroups();
    this.getUrl();
  },
  methods: {
    getUrl: async function () {
      this.pageUrl = window.location.href;
    },
    getGroups: async function() {
      if (this.lang === 'sv') {
        this.$i18n.locale = this.lang;
      }
      await axios
        .get(
          // The next following should be a value from a config file - fix it - use key value pair
          // 'http://api.finto.fi/rest/v1/' + this.formData.vocabulary + '/groups', {
          'https://api.finto.fi/rest/v1/' + this.formData.vocabulary + '/groups', {
            params: {
              lang: this.$i18n.locale
            }
          }
        )
        .then(response => this.formData.groups.allGroups = response.data.groups); // orig
    },

setDropDown: function() {
      this.formData.conceptType.options[0].value = this.$t('new.common.concept');
      this.formData.conceptType.options[1].value = this.$t('new.common.geo');
    },

    addHTTPOrHTTPS(str){
      if(!(/(http(s?)):\/\//.test(str))){
        return `http://${str}`;
      } else {
        return `${str}`;
      }
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
      this.handlePrefLabelLanguages();
      var ontTypeInTargetSuggestionSystem = '';
      const labelsInTargetSuggestionSystem = [];
      if (this.formData.vocabulary === 'yso-paikat') {
        labelsInTargetSuggestionSystem.push("uusi");
        labelsInTargetSuggestionSystem.push("MAANTIETEELLINEN");
        ontTypeInTargetSuggestionSystem = "GEO";
      } else if (this.formData.vocabulary === 'yso') {
        labelsInTargetSuggestionSystem.push("uusi");
        ontTypeInTargetSuggestionSystem = "CONCEPT";
      } else {
        labelsInTargetSuggestionSystem.push("uusi");
        labelsInTargetSuggestionSystem.push(vocab.toUpperCase());
        ontTypeInTargetSuggestionSystem = "CONCEPT";
      }
      const altTerms = []
      this.formData.altLabels.forEach(item => item.value !== "" ? altTerms.push(` ${item.value}`) : null);

      const brdLabls = []
      this.formData.broaderLabels.forEach(item => item.value !== "" ? brdLabls.push(` [${ item.value }](${item.uri})`) : null);

      const groups = []
      this.formData.groups.selectedGroups.forEach(item => item.prefLabel !== "" ? groups.push(` [${ item.prefLabel }](${item.uri})`) : null);

      const nrrLabls = []
      this.formData.narrowerLabels.forEach(item => item.value !== "" ? nrrLabls.push(` [${ item.value }](${item.uri})`) : null);


      const rltdLabls = []
      this.formData.relatedLabels.forEach(item => item.value !== "" ? rltdLabls.push(` [${ item.value }](${item.uri})`) : null);

      const exctLabls = []
      this.formData.exactMatches.forEach(item => item.value !== "" ? exctLabls.push(` [${ item.vocab }](${this.addHTTPOrHTTPS(item.value)})`) : null);
// Very strange newlines, taken from the GitHub issue body by "blind" copying
      let data = `
**Käsitteen tyyppi**

${ ontTypeInTargetSuggestionSystem }

**Ehdotettu termi suomeksi**

${ this.formData.prefLabel.fi.value }

**Ehdotettu termi ruotsiksi**

${ this.formData.prefLabel.sv.value }

**Ehdotettu termi englanniksi**

${ this.formData.prefLabel.en }

**Tarkoitusta täsmentävä selite**

${ this.formData.scopeNote }

**Perustelut ehdotukselle**

${ this.formData.explanation }

**Ehdotettu yläkäsite YSOssa (LT)**

${ brdLabls }

**Ehdotetut temaattiset ryhmät**

${ groups }

**Vaihtoehtoiset termit**

${ altTerms }

**Alakäsitteet (RT)**

${ nrrLabls }

**Assosiatiiviset (RT)**

${ rltdLabls }

**Vastaava käsite muussa sanastossa**

${ exctLabls }

**Aineisto jonka kuvailussa käsitettä tarvitaan (esim. nimeke tai URL)**

${ this.formData.neededFor }

**Ehdottajan organisaatio**

${ this.formData.fromOrg }
`

      let dataBundle = {
        "title": (this.$i18n.locale === 'sv' ? this.formData.prefLabel.sv.value : this.formData.prefLabel.fi.value),
        "body": data,
        "state": "open",
        "labels": labelsInTargetSuggestionSystem
      };
      var urlencode = require('urlencode');
      const payload = encodeURIComponent(JSON.stringify(dataBundle));
      const headers = {
          'Access-Control-Allow-Origin': '*'
      };
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
      if (this.$i18n.locale === 'fi') {
        this.formData.prefLabel.fi.value = this.formData.prefLabel.primary;
        this.formData.prefLabel.sv.value = this.formData.prefLabel.secondary;
      } else if (this.$i18n.locale === 'sv') {
        this.formData.prefLabel.sv.value = this.formData.prefLabel.primary;
        this.formData.prefLabel.fi.value = this.formData.prefLabel.secondary;
      }
    },
    closeDialog () {
      this.isOpened = !this.isOpened;
      this.showSuccessMessage = false;
      this.showFailureMessage = false;
      this.suggestionUrl = '';
      this.formData = {
        // vocabulary: 'yso',
        vocabulary: vocab,
        conceptType: {
          value: '',
          options: [
            {
              value: '',
              vocab: 'yso'
            },
            {
              value: '',
              vocab: 'yso-paikat'
            }
          ]
        },
        prefLabel: {
          primary: '',
          secondary: '',
          fi: {
            value: ''
          },
          sv: {
            value: ''
          },
          en: ''
        },
        altLabels: [{
          value: '',
          isTouched: false
        }],
        broaderLabels: [{
          value: '',
          uri: '',
          isTouched: false
        }],
        narrowerLabels: [{
          value: '',
          uri: '',
          isTouched: false
        }],
        relatedLabels: [{
          value: '',
          uri: '',
          isTouched: false
        }],
        groups: {
          allGroups: [],
          selectedGroups: []
        },
        exactMatches: [{
          vocab: '',
          value: '',
          isTouched: false
        }],
        scopeNote: '',
        explanation: '',
        neededFor: '',
        fromOrg: ''
      };
      this.setDropDown();
      this.$v.$reset();
      this.getGroups();
    }
  },
  validations: {
    formData: {
      conceptType: vocab === 'yso' || vocab === 'yso-paikat' ? { value: { required } } : '',
      // conceptType: { value: { required } },
      prefLabel: { primary: { required, minLength: minLength(1) }},
      explanation: { required },
      neededFor: { required }
    }
  }
}
</script>

<style>
  .error {
    color: #e83a30;
    text-indent: 2px;
    font-size: 13px;
    margin-top: -10px;
    margin-bottom: 16px;
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
