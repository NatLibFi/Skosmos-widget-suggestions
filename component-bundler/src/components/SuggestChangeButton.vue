<template>
  <div>
    <a role="button" @click="isOpened = !isOpened" id="fordirectmodify" :href="`${pageUrl.split('#')[0]}#suggestion`">
      <span>{{ $t('edit.button') }}</span>
    </a>
    <centered-dialog v-if="isOpened" @close="closeDialog()">
      <edit-suggestion
          v-if="!showSuccessMessage && !showFailureMessage"
          :d="formData"
          :label="labelX"
          :uri="uriX"
          @update:conceptType="formData.conceptType.value = $event"
          @update:primaryPrefLabel="formData.prefLabel.primary = $event"
          @update:description="formData.description = $event"
          @update:reason="formData.reason = $event"
          @update:fromOrg="formData.fromOrg = $event"
          @submitForm="submitForm"
      />
      <success-message v-if="showSuccessMessage" :suggestionUrl="suggestionUrl" :url="url" />
      <failure-message v-if="showFailureMessage" />
    </centered-dialog>
  </div>
</template>

<script>
import EditSuggestion from './EditSuggestion.vue';
import CenteredDialog from './common/CenteredDialog.vue';
import SuccessMessage from './common/SuccessMessage.vue';
import FailureMessage from './common/FailureMessage.vue';
import { required } from 'vuelidate';
import axios from 'axios';
import { defineComponent, ref, reactive, watchEffect, inject, watch } from 'vue';

export default {
  components: {
    EditSuggestion,
    CenteredDialog,
    SuccessMessage,
    FailureMessage,
  },
  props: {
    lang: String,
    vocab: String,
    label: String,
    uri: String,
    url: String,
    moikkelis: String,
  },
  setup(props) {
    const testi = inject('testi')
    const labelX = inject('labelX', null);
    const uriX = inject('uriX', null);
    const pageUrlX = inject('pageUrlX', null);
    const $t = inject('$t');
    let pageUrl = ref(pageUrlX);
    // console.log('pageUrl at refs', pageUrl)
    const isOpened = ref(false);
    const showSuccessMessage = ref(false);
    const showFailureMessage = ref(false);
    const suggestionUrl = ref('');
    const formData = reactive({
      description: '',
      reason: '',
      fromOrg: '',
    });

    const getUrl = async () => {
      pageUrl.value = window.location.href;
    };

    const submitForm = () => {
      if (true) {
        sendData();
      } else {
        console.log('Data not sent: required data of the form was not provided.');
      }
    };

    const sendData = async () => {
      let data = `
**Käsitteen tyyppi**

Muutos olemassa olevaan käsitteeseen

**prefabel**

[${labelX}](${uriX})

**Tila**

Käsittelyssä

**Ehdotettu muutos**

${formData.description}

**Perustelut ehdotukselle**

${formData.reason}

**Ehdottajan organisaatio**

${formData.fromOrg}
`;

      let dataBundle = {
        title: labelX,
        body: data,
        state: 'open',
        labels: ['muutos'],
      };

      const payload = encodeURIComponent(JSON.stringify(dataBundle));

      var urlToPrx = require('../prx.json');
      await axios
          .post(`${urlToPrx[0].url}?payload=${payload}`)
          .then((response) => {
            toggleSuccessMessage(`${response.data.url.replace('/repos', '').replace('api.', '')}`);
          })
          .catch((error) => {
            toggleFailureMessage();
          });
    };

    const toggleSuccessMessage = (responseUrl) => {
      if (responseUrl && responseUrl.length > 0) {
        suggestionUrl.value = responseUrl;
        showSuccessMessage.value = true;
      }
      showSuccessMessage.value = true;
    };

    const toggleFailureMessage = () => {
      showFailureMessage.value = true;
    };

    const handlePrefLabelLanguages = () => {
      if (lang === 'sv') {
        return {
          sv: {
            value: labelX,
            uri: uriX,
          },
          en: '',
          fi: {
            value: '',
            uri: '',
          },
        };
      }
      return {
        fi: {
          value: labelX,
          uri: uriX,
        },
        en: '',
        sv: {
          value: '',
          uri: '',
        },
      };
    };

    const closeDialog = () => {
      isOpened.value = !isOpened.value;
      showSuccessMessage.value = false;
      showFailureMessage.value = false;
      suggestionUrl.value = '';
      // $v.formData.$reset();
      formData.description = '';
      formData.reason = '';
      formData.fromOrg = '';
    };

    return {
      pageUrl,
      pageUrlX,
      isOpened,
      showSuccessMessage,
      showFailureMessage,
      suggestionUrl,
      formData,
      getUrl,
      submitForm,
      toggleFailureMessage,
      handlePrefLabelLanguages,
      closeDialog,
      labelX,
      testi
    };
  },
  validations() {
    return {
      formData: {
        description: { required },
        reason: { required },
      },
    };
  },
};
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
