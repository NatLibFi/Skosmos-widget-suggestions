<template>
  <div>
    <a role="button" @click="isOpened = !isOpened">
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
</template>

<script>
import EditSuggestion from './EditSuggestion';
import CenteredDialog from './common/CenteredDialog';
import SuccessMessage from './common/SuccessMessage';
import FailureMessage from './common/FailureMessage';
import { required, minLength } from 'vuelidate/lib/validators';
import axios from 'axios';

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
        description: '',
        reason: '',
        fromOrg: ''
      }
    }
  },
  methods: {
    submitForm () {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.sendData();
      } else {
        console.log('Data not sent: required data of the form was not provided.');
      }
    },
    async sendData () {
      let data = {
        "suggestion_type": "MODIFY",
        "uri": "",
        "preferred_label": this.handlePrefLabelLanguages(),
        "description": this.formData.description,
        "reason": this.formData.reason,
        "organization": this.formData.fromOrg
      };
      console.log(data);
      await axios
        .post(
          this.url + 'suggestions', data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              "Access-Control-Allow-Origin": "*"
            }
          }
        )
        .then(response => {
          this.toggleSuccessMessage(response.data.suggestionUrl);
        })
        .catch(error => {
          this.toggleFailureMessage();
        })
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