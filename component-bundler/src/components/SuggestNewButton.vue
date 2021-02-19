<template>
  <div>
    <a role="button" @click="isOpened = !isOpened">
      <span>{{ $t('new.button') }} {{ vocab }}</span>
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
    // url for suggestion platform
    url: String
  },
  beforeMount: function () {
    if (this.lang === 'sv') {
      this.$i18n.locale = this.lang;
    }
    this.setDropDown();
  },
  data: () => {
    return {
      isOpened: false,
      showSuccessMessage: false,
      showFailureMessage: false,
      suggestionUrl: '',
      formData: {
        vocabulary: 'yso',
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
  },
  methods: {
    getGroups: async function() {
      await axios
        .get(
          'http://api.finto.fi/rest/v1/' + this.formData.vocabulary + '/groups', {
            params: {
              lang: this.$i18n.locale
            }
          }
        )
        .then(response => this.formData.groups.allGroups = response.data.groups);
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
      } else {
        labelsInTargetSuggestionSystem.push("uusi");
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

      let dataOrig_still_for_testing = {
        "suggestion_type": "NEW",
        "uri": "",
        "preferred_label": {
          "fi": { value: this.formData.prefLabel.fi.value, uri: '' },
          "sv": { value: this.formData.prefLabel.sv.value, uri: '' },
          "en": this.formData.prefLabel.en
        },
        "alternative_labels": this.formData.altLabels,
        "broader_labels": this.formData.broaderLabels,
        "narrower_labels": this.formData.narrowerLabels,
        "related_labels": this.formData.relatedLabels,
        "groups": this.formData.groups.selectedGroups,
        "exactMatches": this.formData.exactMatches,
        "scopeNote": this.formData.scopeNote,
        "reason": this.formData.explanation,
        "neededFor": this.formData.neededFor,
        "organization": this.formData.fromOrg,
      };
// Taken from the previous
      // "tags": this.formData.tags
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

// Takem from the variable above
//
// ${ this.formData.tags }

      let dataBundle = {
        "title": this.formData.prefLabel.fi.value,
        "body": data,
        "state": "open",
        "labels": labelsInTargetSuggestionSystem
      };
      var urlencode = require('urlencode');
      const payload = encodeURIComponent(JSON.stringify(dataBundle));
      const headers = {
          'Access-Control-Allow-Origin': '*'
      };

// $config['to_endpoint']

      var urlToPrx = require('../prx.json');
      await axios.post(`${urlToPrx[0].url}?payload=${payload}`).then(response => {
      // await axios.post(`http://localhost:8000/some_simple_test.php?payload=${payload}`).then(response => {
        // console.log(this.urlForGHEndpoint.firstname)
        // console.log(this.urlForGHEndpoint.lastname)
        // var n = response.data.url.lastIndexOf('/');
        // response.data.url.substring(n + 1)
        // console.log("Tämä on muokattu responseUrl")
        // console.log(response.data.url.substring(n + 1));
        // console.log("Tämä on toivottavasti lopullinen responseUrl")
        // console.log(response.data.url.replace("/repos", "").replace("api.", ""));
        // console.log(response.data.url.substring(n + 1));
        this.toggleSuccessMessage(`${response.data.url.replace("/repos", "").replace("api.", "")}`);
        // this.toggleSuccessMessage(`https://github.com/miguelahonen/c/issues/${response.data.url.substring(n + 1)}`);
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
        vocabulary: 'yso',
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
      conceptType: { value: { required } },
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
