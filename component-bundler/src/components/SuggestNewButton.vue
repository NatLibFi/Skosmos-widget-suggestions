<template>
  <div>
    <a role="button" @click="isOpened = !isOpened" id="fordirectnew" :href="`${pageUrl.split('#')[0]}#suggestion`">
      <span>
        <div id="vocab-info">
          <div>
            <h3>{{ $t('new.button') }}</h3>
            <div>{{ prefLabelOkay }}</div>
          </div>
        </div>
      </span>
    </a>
    <centered-dialog v-if="isOpened" @close="closeDialog()">
      <new-suggestion
        :conceptTypeIsSelected="conceptTypeIsSelected"
        :prefLabelOkay="prefLabelOkay"
        :explanationOkay="explanationOkay"
        :neededForOkay="neededForOkay"
        :sending="sending"
        @update:conceptTypeIsSelected="conceptTypeIsSelected = true"
        @update:prefLabelOkay="prefLabelOkay = true"
        @update:explanationOkay="explanationOkay = true"
        @update:neededForOkay="neededForOkay = true"
        v-if="!showSuccessMessage && !showFailureMessage"
        :d="formData"
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

      <success-message v-if="showSuccessMessage" :suggestionUrl="suggestionUrl" :url="url" />
      <failure-message v-if="showFailureMessage" />
    </centered-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watchEffect, inject, watch } from 'vue';
import NewSuggestion from './NewSuggestion.vue';
import CenteredDialog from './common/CenteredDialog.vue';
import SuccessMessage from './common/SuccessMessage.vue';
import FailureMessage from './common/FailureMessage.vue';
import axios from 'axios';
import urlToPrx from "../prx.json";

export default defineComponent({
  components: {
    NewSuggestion,
    CenteredDialog,
    SuccessMessage,
    FailureMessage,
  },
  props: {
    lang: String,
    vocab: String,
  },
  setup(props) {
    setTimeout(() => {
    }, 500)

    // Inject the i18n $t function and pageUrl variable
    const $t = inject('$t');
    const pageUrl = inject('pageUrl');
    const isOpened = ref(false);
    const showSuccessMessage = ref(false);
    const showFailureMessage = ref(false);
    const suggestionUrl = ref('');
    let conceptTypeIsSelected = ref(false)
    let prefLabelOkay = ref(false)
    let explanationOkay = ref(false)
    let neededForOkay = ref(false)
    let dataCanBeSentArray = ref([])
    let sending = ref(false)

    const formData = reactive({
      vocabulary: 'yso',
      conceptType: {
        value: '',
        options: [
          { value: '', vocab: 'yso' },
          { value: '', vocab: 'yso-paikat' },
        ],
      },
      prefLabel: {
        primary: '',
        secondary: '',
        fi: { value: '' },
        sv: { value: '' },
        en: '',
      },
      altLabels: [{ value: '', isTouched: false }],
      broaderLabels: [{ value: '', uri: '', isTouched: false }],
      narrowerLabels: [{ value: '', uri: '', isTouched: false }],
      relatedLabels: [{ value: '', uri: '', isTouched: false }],
      groups: { allGroups: [], selectedGroups: [] },
      exactMatches: [{ vocab: '', value: '', isTouched: false }],
      scopeNote: '',
      explanation: '',
      neededFor: '',
      fromOrg: '',
      tags: [],
    });

    watch(
        () => [formData.conceptType.value, formData.conceptType.value.length],
        (newValues, oldValues) => {
          const conceptTypeLength = newValues[1];

          if (conceptTypeLength > 0) {
            conceptTypeIsSelected.value = true;
            dataCanBeSentArray.value[0] = true
          } else {
            conceptTypeIsSelected.value = false;
            dataCanBeSentArray.value[0] = false
          }
        },
        { deep: true }
    );

    watch(
        () => [formData.prefLabel.primary, formData.prefLabel.primary.length],
        (newValues, oldValues) => {
          const primaryLabelLength = newValues[1];
          if (primaryLabelLength > 2) {
            prefLabelOkay.value = true;
            dataCanBeSentArray.value[1] = true
          } else {
            prefLabelOkay.value = false;
            dataCanBeSentArray.value[1] = false
          }
          prefLabelOkay.value ? console.log("Toimiiko?", prefLabelOkay.value) : console.log("hutiin meni");
        },
        { deep: true }
    );

    watch(
        () => [formData.explanation, formData.explanation.length],
        (newValues, oldValues) => {
          const explanationLength = newValues[1];
          if (explanationLength > 2) {
            explanationOkay.value = true;
            dataCanBeSentArray.value[2] = true;
          } else {
            explanationOkay.value = false;
            dataCanBeSentArray.value[2] = false;
          }
        },
        { deep: true }
    );

    watch(
        () => [formData.neededFor, formData.neededFor.length],
        (newValues, oldValues) => {
          const needdForLength = newValues[1];
          if (needdForLength > 2) {
            neededForOkay.value = true;
            dataCanBeSentArray.value[3] = true;
          } else {
            neededForOkay.value = false;
            dataCanBeSentArray.value[3] = false;
          }
        },
        { deep: true }
    );

    // Methods
    const setDropDown = () => {
      formData.conceptType.options[0].value = 'new.common.concept';
      formData.conceptType.options[1].value = 'new.common.geo';
    };

    const addHTTPOrHTTPS = (str) => {
      if (!/^(http(s?)):\/\//.test(str)) {
        return `http://${str}`;
      } else {
        return `${str}`;
      }
    };

    const submitForm = () => {
      // $v.$touch();
      sending.value = true

      dataCanBeSentArray.value.forEach((value, index) => {
        console.log(`Element at index ${index}: ${value}`);
      });

      const countTrueValues = dataCanBeSentArray.value.reduce((count, currentValue) => {
        if (currentValue === true) {
          return count + 1;
        } else {
          return count;
        }
      }, 0);


      console.log('countTrueValues', countTrueValues)
      if (countTrueValues === 4) {
        sendData();
      } else {
        console.log('Data not sent: required data of the form was not provided.');
      }
    };

    const sendData = async () => {
      handlePrefLabelLanguages();
      let ontTypeInTargetSuggestionSystem = '';
      const labelsInTargetSuggestionSystem = [];
      if (formData.vocabulary === 'yso-paikat') {
        labelsInTargetSuggestionSystem.push('uusi');
        labelsInTargetSuggestionSystem.push('MAANTIETEELLINEN');
        ontTypeInTargetSuggestionSystem = 'GEO';
      } else {
        labelsInTargetSuggestionSystem.push('uusi');
        ontTypeInTargetSuggestionSystem = 'CONCEPT';
      }

      const altTerms = [];
      formData.altLabels.forEach((item) => (item.value !== '' ? altTerms.push(` ${item.value}`) : null));

      const brdLabls = [];
      formData.broaderLabels.forEach((item) =>
          item.value !== '' ? brdLabls.push(` [${item.value}](${item.uri})`) : null
      );

      const groups = [];
      formData.groups.selectedGroups.forEach((item) =>
          item.prefLabel !== '' ? groups.push(` [${item.prefLabel}](${item.uri})`) : null
      );

      const nrrLabls = [];
      formData.narrowerLabels.forEach((item) =>
          item.value !== '' ? nrrLabls.push(` [${item.value}](${item.uri})`) : null
      );

      const rltdLabls = [];
      formData.relatedLabels.forEach((item) =>
          item.value !== '' ? rltdLabls.push(` [${item.value}](${item.uri})`) : null
      );

      const exctLabls = [];
      formData.exactMatches.forEach((item) =>
          item.value !== '' ? exctLabls.push(` [${item.vocab}](${addHTTPOrHTTPS(item.value)})`) : null
      );

      let data = `
**Käsitteen tyyppi**

${ontTypeInTargetSuggestionSystem}

**Ehdotettu termi suomeksi**

${formData.prefLabel.fi.value}

**Ehdotettu termi ruotsiksi**

${formData.prefLabel.sv.value}

**Ehdotettu termi englanniksi**

${formData.prefLabel.en}

**Tarkoitusta täsmentävä selite**

${formData.scopeNote}

**Perustelut ehdotukselle**

${formData.explanation}

**Ehdotettu yläkäsite YSOssa (LT)**

${brdLabls}

**Ehdotetut temaattiset ryhmät**

${groups}

**Vaihtoehtoiset termit**

${altTerms}

**Alakäsitteet (RT)**

${nrrLabls}

**Assosiatiiviset (RT)**

${rltdLabls}

**Vastaava käsite muussa sanastossa**

${exctLabls}

**Aineisto jonka kuvailussa käsitettä tarvitaan (esim. nimeke tai URL)**

${formData.neededFor}

**Ehdottajan organisaatio**

${formData.fromOrg}
`;

      let dataBundle = {
        title: formData.prefLabel.sv.value !== '' ? formData.prefLabel.sv.value : formData.prefLabel.fi.value,
        body: data,
        state: 'open',
        labels: labelsInTargetSuggestionSystem,
      };
      const payload = encodeURIComponent(JSON.stringify(dataBundle));
      console.log("payload", payload)
      const headers = {
        'Access-Control-Allow-Origin': '*',
      };
      const urlToPrx = require('../prx.json');
      await axios
      // https://finto.fi/plugins/suggestions/gh_prx.php
      // https://api.github.com/repos/:owner/:repo
      // https://github.com/Finto-ehdotus/YSE
          .post(`${urlToPrx[0].url}?payload=${payload}`, {}, { headers })
          .then((response) => {
            console.log(`URL: ${urlToPrx[0].url}?payload=${payload}`);
            console.log('Response:', response);
            // toggleSuccessMessage(`https://github.com/Finto-ehdotus/YSE`);
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
      formData.prefLabel.fi.value = formData.prefLabel.primary;
      if (window.lang === 'fi') {
        formData.prefLabel.fi.value = formData.prefLabel.primary;
        formData.prefLabel.sv.value = formData.prefLabel.secondary;
        console.log(formData.prefLabel.primary)
        console.log(formData.prefLabel.secondary)
      } else if (window.lang === 'sv') {
        formData.prefLabel.sv.value = formData.prefLabel.primary;
        formData.prefLabel.fi.value = formData.prefLabel.secondary;
        console.log(formData.prefLabel.primary)
        console.log(formData.prefLabel.secondary)
      }
    };

    const closeDialog = () => {
      isOpened.value = !isOpened.value;
      showSuccessMessage.value = false;
      showFailureMessage.value = false;
      suggestionUrl.value = '';
      formData.vocabulary = 'yso';
      formData.conceptType.value = '';
      formData.prefLabel.primary = '';
      formData.prefLabel.secondary = '';
      formData.prefLabel.fi.value = '';
      formData.prefLabel.sv.value = '';
      formData.prefLabel.en = '';
      formData.altLabels = [{ value: '', isTouched: false }];
      formData.broaderLabels = [{ value: '', uri: '', isTouched: false }];
      formData.narrowerLabels = [{ value: '', uri: '', isTouched: false }];
      formData.relatedLabels = [{ value: '', uri: '', isTouched: false }];
      formData.groups.selectedGroups = [];
      formData.exactMatches = [{ vocab: '', value: '', isTouched: false }];
      formData.scopeNote = '';
      formData.explanation = '';
      formData.neededFor = '';
      formData.fromOrg = '';
      setDropDown();
      // $v.$reset();
      getGroups();
      sending.value = false
    };

    const getUrl = async () => {
      pageUrl.value = window.location.href;
    };

    const getGroups = async () => {
/*      if (props.lang === 'sv') {
        // Note: 'this' is not available in the setup function.
        // Instead, you can use 'props' directly.
      }*/
      await axios
          .get(`https://api.finto.fi/rest/v1/${formData.vocabulary}/groups`, {
            params: {
              // lang: props.lang,
              lang: window.lang === 'en' ? 'fi' : window.lang
            },
          })
          .then((response) => (formData.groups.allGroups = response.data.groups));
    };

    // Lifecycle hooks
    watchEffect(() => {
  /*    if (props.lang === 'sv') {
        // Note: 'this' is not available in the setup function.
        // Instead, you can use 'props' directly.
      }*/
      setDropDown();
      getGroups();
    });

    getGroups();

    // Return the variables and methods you want to expose to the template
    return {
      pageUrl,
      isOpened,
      showSuccessMessage,
      showFailureMessage,
      suggestionUrl,
      formData,
      conceptTypeIsSelected,
      prefLabelOkay,
      explanationOkay,
      neededForOkay,
      setDropDown,
      addHTTPOrHTTPS,
      submitForm,
      sendData,
      toggleSuccessMessage,
      toggleFailureMessage,
      handlePrefLabelLanguages,
      closeDialog,
      getUrl,
      getGroups,
      dataCanBeSentArray,
      sending
    };
  },
});
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
