<template>

  <div>
    <a role="button" @click="isOpened = !isOpened" id="fordirectnew" :href="`${pageUrl.split('#')[0]}#suggestion`">
      <span>
        <div id="vocab-info">
          <div>
            <h3>{{ $t('new.button') }}</h3>
          </div>
        </div>
      </span>
    </a>
    <centered-dialog v-if="isOpened" @close="closeDialog()">
      <new-suggestion

          :conceptTypeIsSelected="conceptTypeIsSelected"
          :prefLabelIsSelected="prefLabelIsSelected"
          :explanationX="explanationX"
          :neededForX="neededForX"

        @update:conceptTypeIsSelected="conceptTypeIsSelected = true"
        @update:prefLabelIsSelected="prefLabelIsSelected = true"
        @update:explanationX="explanationX = true"
        @update:neededForX="neededForX = true"

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
// Versio ennen isoja muutoksia
import { defineComponent, ref, reactive, watchEffect, inject, watch } from 'vue';
import NewSuggestion from './NewSuggestion.vue';
import CenteredDialog from './common/CenteredDialog.vue';
import SuccessMessage from './common/SuccessMessage.vue';
import FailureMessage from './common/FailureMessage.vue';
import { required, minLength } from 'vuelidate/lib/validators';
import axios from 'axios';
import urlToPrx from "../prx.json";
// import { useVuelidate } from '@vuelidate/core';

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
    // url: String,
  },
  setup(props) {
    setTimeout(() => {
      // console.log("formData")
      // console.log(formData)

      // console.dir(formData);



    }, 500)


    // Inject the i18n $t function and pageUrl variable
    const $t = inject('$t');
    const pageUrl = inject('pageUrl');

    // Use $t for translations and pageUrl
    // console.log($t('new.button'));
    // console.log(pageUrl);

    const isOpened = ref(false);
    const showSuccessMessage = ref(false);
    const showFailureMessage = ref(false);
    const suggestionUrl = ref('');

    let conceptTypeIsSelected = ref(false)
    let prefLabelIsSelected = ref(false)
    let explanationX = ref(false)
    let neededForX = ref(false)

  /*  const formData = reactive({
      vocabulary: 'yso',
      conceptType: {
        value: 'Yleiskäsite',
        options: [
          { value: '', vocab: 'yso' },
          { value: '', vocab: 'yso-paikat' },
        ],
      },
      prefLabel: {
        primary: 'qweqwe',
        secondary: 'werwer',
        fi: { value: 'ertert' },
        sv: { value: 'rtyrty' },
        en: 'tyutyu',
      },
      altLabels: [{ value: 'asd', isTouched: false }],
      broaderLabels: [{ value: 'aaaaaaa', uri: '', isTouched: false }],
      narrowerLabels: [{ value: 'ggggggg', uri: '', isTouched: false }],
      relatedLabels: [{ value: 'ttttttt', uri: '', isTouched: false }],
      groups: { allGroups: [], selectedGroups: ["a", "b"] },
      exactMatches: [{ vocab: 'yso', value: 'wqe', isTouched: false }],
      scopeNote: 'qweqwewqe',
      explanation: 'qweqweqwe',
      neededFor: 'qweqweqwe',
      fromOrg: 'qweqweqwe',
      tags: ["uusi"],
    });*/



    // Älä muuta vielä
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

    // Watchers for formData properties
/*    watch(formData, (newValue) => {
      console.log('formData changed:', newValue);
    }, { deep: true });*/

    watch(() => formData.vocabulary, (newValue) => {
      console.log('vocabulary changed:', newValue);
    });

    watch(() => formData.conceptType, (newValue) => {
      console.log('conceptType changed:', newValue);
    }, { deep: true });

    watch(() => formData.prefLabel, (newValue) => {
      console.log('prefLabel changed:', newValue);
      // handlePrefLabelLanguages()
    }, { deep: true });

    watch(() => formData.altLabels, (newValue) => {
      console.log('altLabels changed:', newValue);
    }, { deep: true });

    watch(() => formData.broaderLabels, (newValue) => {
      console.log('broaderLabels changed:', newValue);
    }, { deep: true });

    watch(() => formData.narrowerLabels, (newValue) => {
      console.log('narrowerLabels changed:', newValue);
    }, { deep: true });

    watch(() => formData.relatedLabels, (newValue) => {
      console.log('relatedLabels changed:', newValue);
    }, { deep: true });

    watch(() => formData.groups, (newValue) => {
      console.log('groups changed:', newValue);
    }, { deep: true });

    watch(() => formData.exactMatches, (newValue) => {
      console.log('exactMatches changed:', newValue);
    }, { deep: true });

    watch(() => formData.scopeNote, (newValue) => {
      console.log('scopeNote changed:', newValue);
    });

    watch(() => formData.explanation, (newValue) => {
      console.log('explanation changed:', newValue);
    });

    watch(() => formData.neededFor, (newValue) => {
      console.log('neededFor changed:', newValue);
    });

    watch(() => formData.fromOrg, (newValue) => {
      console.log('fromOrg changed:', newValue);
    });

    watch(() => formData.tags, (newValue) => {
      console.log('tags changed:', newValue);
    });





















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

      if (formData.conceptType.value && formData.conceptType.value.length > 1) {
        conceptTypeIsSelected = true
        console.log("AAAAAAA", formData.conceptType.value.length > 1)
      }
      if (formData.prefLabel.primary && formData.prefLabel.primary.length > 1) {
        prefLabelIsSelected = true
        console.log("AAAAAAA", formData.prefLabel.primary.length > 1)
      }
      if (formData.explanation && formData.explanation.length > 1) {
        explanationX = true
        console.log("AAAAAAA", formData.explanation.length > 1)
      }
      if (formData.neededFor && formData.neededFor.length > 1) {
        neededForX = true
        console.log("AAAAAAA", formData.neededFor.length > 1)
      }

      if (conceptTypeIsSelected && prefLabelIsSelected && explanationX && neededForX) {
        console.log("BBBB", conceptTypeIsSelected)
        console.log("BBBB", prefLabelIsSelected)
        console.log("BBBB", explanationX)
        console.log("BBBB", neededForX)
        console.log("CCC", formData.conceptType.value.length)
        console.log("CCC", formData.prefLabel.primary.length)
        console.log("CCC", formData.explanation.length)
        console.log("CCC", formData.neededFor.length)
        sendData();
      } else {
        console.log('Data not sent: required data of the form was not provided.');
      }
    };

    const sendData = async () => {
      // console.log("SendData: Lähetetään!")
      handlePrefLabelLanguages(); // palauta tämä mahdollisesti eli mieti, missä kohtaa tätä kutsuttaisiin
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
/*
      if (formData.prefLabel.primary.length < 3) {
        console.log("tsot stos")
      }*/



      const altTerms = [];
      formData.altLabels.forEach((item) => (item.value !== '' ? altTerms.push(` ${item.value}`) : null));

      const brdLabls = [];
/*      console.log("In the SuggestNewButton")
      console.log("typeof(formData.broaderLabels)")
      console.log(typeof(formData.broaderLabels))*/
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
            // console.log(error);
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

    // Se, ettei ehdotus lähde, liittyy tähän:
    const handlePrefLabelLanguages = () => {

/*      console.log("window.lang")
      console.log(window.lang)*/

      formData.prefLabel.fi.value = formData.prefLabel.primary;
      // ONGELMA ON TÄSSÄ
      // console.log(window.lang)
      // if (props.lang === 'fi') {
      if (window.lang === 'fi') {
        formData.prefLabel.fi.value = formData.prefLabel.primary;
        formData.prefLabel.sv.value = formData.prefLabel.secondary;
        console.log(formData.prefLabel.primary)
        console.log(formData.prefLabel.secondary)
      // } else if (props.lang === 'sv') {
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

    // Call created hook
    getGroups();
    // getUrl(); // Tarkista

    // Return the variables and methods you want to expose to the template
    return {
      pageUrl,
      isOpened,
      showSuccessMessage,
      showFailureMessage,
      suggestionUrl,
      formData,
      conceptTypeIsSelected,
      prefLabelIsSelected,
      explanationX,
      neededForX,
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
      // v$: useVuelidate()
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
