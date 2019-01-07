<template>
  <div>
    <a role="button" @click="isOpened = !isOpened">
      <span>{{ $t('new.button') }} {{ vocab }}</span>
    </a>
    <centered-dialog
      v-if="isOpened"
      @close="closeDialog()">
      <new-suggestion
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
    </centered-dialog>
  </div>
</template>

<script>
import NewSuggestion from './NewSuggestion';
import CenteredDialog from './common/CenteredDialog';
import { required, minLength } from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  components: {
    NewSuggestion,
    CenteredDialog
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
          value: '',
          isTouched: false
        }],
        scopeNote: '',
        explanation: '',
        neededFor: '',
        fromOrg: ''
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
    sendData () {
      this.handlePrefLabelLanguages();
      let data = {
        "suggestion_type": "NEW",
        "uri": "",
        "preferred_label": {
          "fi": {value: this.formData.prefLabel.fi.value},
          "sv": {value: this.formData.prefLabel.sv.value},
          "en": {value: this.formData.prefLabel.en.value}
        },
        "alternative_label": this.formData.altLabels,
        "broader": this.formData.broaderLabels,
        "narrower": this.formData.narrowerLabels,
        "related": this.formData.relatedLabels,
        "group": this.formData.groups.selectedGroups,
        "exactMatches": this.formData.exactMatches,
        "scopeNote": this.formData.scopeNote,
        "description": this.formData.explanation,
        "reason": this.formData.neededFor,
        "organization": this.formData.fromOrg,
        "tags": {
          "label": this.formData.conceptType.value.toUpperCase()
        }
      };
      axios
        .post(
          this.url + 'suggestions', data
        )
        .then(response => console.log(response))
        .catch(error => console.log(error));
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

