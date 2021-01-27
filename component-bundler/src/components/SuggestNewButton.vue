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
// import os;
// import dotenv from 'dotenv'
// import load_dotenv from 'dotenv';
// from dotenv import load_dotenv
// from dotenv import load_dotenv
// TÄMÄ TOIMI
// import dotenv from 'dotenv';

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
              value: 'Käsite',
              vocab: 'yso'
            },
            {
              value: 'Maantieteellinen paikka',
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
          value: '',      // load_dotenv()
      // var os = require('os');
      // API_KEY = os.getenv('PROJECT_API_KEY')
      // console.log(API_KEY)
          isTouched: false
        }],
        scopeNote: '',
        explanation: '',
        neededFor: '',
        fromOrg: '',
        tags: []
        // title: '',
        // body: '',
        // state: ''
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
    submitForm () {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.sendData();
      } else {
        console.log('Data not sent: required data of the form was not provided.');
      }
    },
    async sendData () {
      // *************
      // var xhr = new XMLHttpRequest();
      // xhr.open('POST', '../../php/some_simple_test.php');
      // // xhr.onload() = function() {
      // //   console.log(this.response);
      // // }
      // xhr.send("moikka");

      // $.ajax({
      //   url: '../../php/some_simple_test.php',
      //   type: 'post',
      //   success: function(response){
      //
      //   }
      // });


      // *********
      const gh_secret = require('../secrets.json')
      this.handlePrefLabelLanguages();
      if (this.formData.vocabulary === 'yso-paikat') {
        this.formData.tags = [{"label": "MAANTIETEELLINEN"}];
      }
      const altTerms = []
      this.formData.altLabels.forEach(item => item.value !== "" ? altTerms.push(item.value) : null);
      const brdLabls = []
      this.formData.broaderLabels.forEach(item => item.value !== "" ? brdLabls.push(item.value) : null);
      const groups = []
      // console.log(this.formData.groups.selectedGroups)
      // this.formData.groups.selectedGroups.forEach(item => item.prefLabel !== "" ? groups.push(item.prefLabel) : null);
      console.log(this.formData.groups.selectedGroups)
      this.formData.groups.selectedGroups.forEach(item => item.prefLabel !== "" ? groups.push(`[${ item.prefLabel }](${item.uri})`) : null);

// organization:  [sdfsdf](http://www.google.fi)


      // this.formData.broaderLabels

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
        "tags": this.formData.tags
      };

// Very strange newlines, taken from the GitHub issue body by "blind" copying
      let data = `
**Käsitteen tyyppi**

CONCEPT

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

${ this.formData.narrowerLabels }

**Assosiatiiviset (RT)**

${ this.formData.relatedLabels }

**Vastaava käsite muussa sanastossa**

${ this.formData.exactMatches }

**Aineisto jonka kuvailussa käsitettä tarvitaan (esim. nimeke tai URL)**

${ this.formData.neededFor }

**Ehdottajan organisaatio**

${ this.formData.fromOrg }

**Tunnisteet**

${ this.formData.tags }`
    // )

      console.log(data);

      let dataBundle = {
        "title": this.formData.prefLabel.fi.value,
        "body": data,
        "state": "open",
        "labels": ["uusi"]
      };


      var urlencode = require('urlencode');
      const payload = encodeURIComponent(JSON.stringify(dataBundle));
      console.log("*****")
      console.log(payload)
      console.log("*****")
      const headers = {
          'Access-Control-Allow-Origin': '*'
      };
      // encodeURIcomp JSON.stringify(dataBundle)
      // await axios.get(`http://localhost:3301/test/1/${payload}`)
      await axios.post(`http://localhost:8000/some_simple_test.php?payload=${payload}`).then(response => {
        // https://api.github.com/repos/miguelahonen/c/issues/236 https://github.com/miguelahonen/c/issues/235
        var n = response.data.url.lastIndexOf('/');
        response.data.url.substring(n + 1)
        console.log(response.data.url.substring(n + 1));
        this.toggleSuccessMessage(`https://github.com/miguelahonen/c/issues/${response.data.url.substring(n + 1)}`);
        // this.toggleSuccessMessage(response.data.suggestionUrl);
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
      this.$v.$reset();
      this.formData = {
        vocabulary: 'yso',
        conceptType: {
          value: '',
          options: [
            {
              value: 'Käsite',
              vocab: 'yso'
            },
            {
              value: 'Maantieteellinen paikka',
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
