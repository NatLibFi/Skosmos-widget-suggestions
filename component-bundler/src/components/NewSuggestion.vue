<template>
<div class="suggestion-container">
  <!-- Keep this as an option -->
  <!-- <button onclick="navigator.clipboard.writeText(window.location.href)">Kopioi leikepöydälle</button> -->
  <div class="suggestion-header">
    <h4>{{ $t('new.header') }}</h4>
    <p>{{ $t('new.p1') }}</p>
    <p>{{ $t('new.p2') }}</p>
    <div id="testing">
      <button v-on:click="messenger()">Klikkaa mua!</button>
    </div>
    <div v-for="config in configDataList.yso">{{config}}</div>
    <span>{{vocabId}}</span>
  </div>
  <div class="suggestion-form">
    <div class="form-inputs">
      <basic-drop-down v-if="configDataList[vocabId].type.show"
        :value="d.conceptType.value"
        :options="d.conceptType.options"
        @changeVocabulary="$emit('update:vocabulary', $event)"
        @select="$emit('update:conceptType', $event)"
        :label="{text: setFieldLabelsByMandatoryStatus('conceptType'), for: $t('new.conceptType.for')}" />
        <!-- :label="{text: $t('new.conceptType.label'), for: $t('new.conceptType.for')}" />  alkuperäinen -->
      <!-- <p v-if="v.$dirty && !v.conceptType.value.required" class="error">{{ $t('new.conceptType.error') }}</p> PALAUTA--> 
    </div>

    <div >
      <search-input v-if="$i18n.locale === 'fi' && configDataList[vocabId].primaryLang.show" 
        :value="d.prefLabel.primary"
        :conceptType="d.conceptType.value"
        :vocabulary="d.vocabulary"
        :language="'fi'"
        @input="$emit('update:primaryPrefLabel', $event)"
        :label="{text: setFieldLabelsByMandatoryStatus('prefLabel'), for: $t('new.prefLabel.fi.for')}" />
          <!-- :label="{text: $t('new.prefLabel.fi.label'), for: $t('new.prefLabel.fi.for')}" /> alkuperäinen-->
      <!-- <p v-if="v.$dirty && !v.prefLabel.primary.required" class="error">{{ $t('new.prefLabel.error') }}</p> PALAUTA -->

      <search-input v-if="$i18n.locale === 'fi' && configDataList[vocabId].secondaryLang.show"
        :value="d.prefLabel.secondary"
        :conceptType="d.conceptType.value"
        :vocabulary="d.vocabulary"
        :language="'sv'"
        @input="$emit('update:secondaryPrefLabel', $event)"
        :label="{text: $t('new.prefLabel.sv.label'), for: $t('new.prefLabel.sv.for')}" />
    </div>

    <div >
      <search-input v-if="$i18n.locale === 'sv' && configDataList[vocabId].primaryLang.show"
        :value="d.prefLabel.primary"
        :vocabulary="d.vocabulary"
        :conceptType="d.conceptType.value"
        :language="'sv'"
        @input="$emit('update:primaryPrefLabel', $event)"
        :label="{text: $t('new.prefLabel.sv.label'), for: $t('new.prefLabel.sv.for')}" />
      <!-- <p v-if="v.$dirty && !v.prefLabel.primary.required" class="error">{{ $t('new.prefLabel.error') }}</p> PALAUTA -->

      <search-input v-if="$i18n.locale === 'sv' && configDataList[vocabId].secondaryLang.show"
        :value="d.prefLabel.secondary"
        :vocabulary="d.vocabulary"
        :conceptType="d.conceptType.value"
        :language="'fi'"
        @input="$emit('update:secondaryPrefLabel', $event)"
        :label="{text: $t('new.prefLabel.fi.label'), for: $t('new.prefLabel.fi.for')}" />
    </div>

    <basic-input v-if="configDataList[vocabId].optionalLanguage.show"
      :value="d.prefLabel.en"
      @input="$emit('update:enPrefLabel', $event)"
      :label="{text: $t('new.prefLabel.en.label'), for: $t('new.prefLabel.en.for')}"
      :isTextArea="false" />

    <the-multiple-basic-input v-if="configDataList[vocabId].altLabels.show"
      :values="d.altLabels"
      @input="$emit('update:altLabels', $event)"
      :label="{text: $t('new.altLabels.label'), for: $t('new.altLabels.for')}" />

    <search-auto-complete v-if="configDataList[vocabId].broaders.show"
      :values="d.broaderLabels"
      :vocabulary="d.vocabulary"
      :language="$i18n.locale"
      @input="$emit('update:broaderLabels', $event)"
      :label="{text: $t('new.broaderLabels.label'), for: $t('new.broaderLabels.for')}"
      :hasUniqueValue="false" />

    <search-auto-complete v-if="configDataList[vocabId].narrowers.show"
      :values="d.narrowerLabels"
      :vocabulary="d.vocabulary"
      :language="$i18n.locale"
      @input="$emit('update:narrowerLabels', $event)"
      :label="{text: $t('new.narrowerLabels.label'), for: $t('new.narrowerLabels.for')}"
      :hasUniqueValue="false" />

    <search-auto-complete v-if="configDataList[vocabId].related.show"
      :values="d.relatedLabels"
      :vocabulary="d.vocabulary"
      :language="$i18n.locale"
      @input="$emit('update:relatedLabels', $event)"
      :label="{text: $t('new.relatedLabels.label'), for: this.$t('new.relatedLabels.for')}"
      :hasUniqueValue="false" />

    <select-with-chips 
      v-if="d.vocabulary !== $t('new.common.places') && configDataList[vocabId].thematicGroups.show"
      :value="$t('new.groups.placeholder')"
      :options="d.groups.allGroups"
      @select="$emit('update:groups', $event)"
      :label="{text: $t('new.groups.label'), for: this.$t('new.groups.for')}" />

    <!-- <ul id="temp-list">
      <li v-for="item in d.groups.allGroups" :key="item.prefLabel">
        {{ item.prefLabel }}
      </li>
    </ul> -->

    <the-exact-matches-input v-if="configDataList[vocabId].exactMatches.show"
      :values="d.exactMatches"
      @input="$emit('update:exactMatches', $event)"
      :label="{text: $t('new.exactMatches.label'), for: this.$t('new.exactMatches.for')}"
      />

    <basic-input v-if="configDataList[vocabId].scopeNote.show"
      :value="d.scopeNote"
      @input="$emit('update:scopeNote', $event)"
      :label="{text: $t('new.scopeNote.label'), for: $t('new.scopeNote.for')}"
      :isTextArea="true" />

    <basic-input v-if="configDataList[vocabId].explanation.show"
      :value="d.explanation"
      @input="$emit('update:explanation', $event)"
      :label="{text: $t('new.explanation.label'), for: $t('new.explanation.label')}"
      :isTextArea="true" />
    <!-- <p v-if="v.$dirty && !v.explanation.required" class="error">{{ $t('new.explanation.error') }}</p> PALAUTA -->

<!-- isTextArea set true on 2022-02-01     -->
    <basic-input v-if="configDataList[vocabId].neededFor.show"
      :value="d.neededFor"
      @input="$emit('update:neededFor', $event)"
      :label="{text: $t('new.neededFor.label'), for: $t('new.neededFor.for')}"
      :isTextArea="true" />
    <!-- <p v-if="v.$dirty && !v.neededFor.required" class="error">{{ $t('new.neededFor.error') }}</p> PALAUTA -->

    <basic-input v-if="configDataList[vocabId].fromOrg.show"
      :value="d.fromOrg"
      @input="$emit('update:fromOrg', $event)"
      :label="{text: $t('new.fromOrg.label'), for: $t('new.fromOrg.for')}"
      :isTextArea="false" />
    <!-- </div> -->

    <div class="form-submit">
      <a @click="submitForm()">
        {{ $t('new.submit') }}
      </a>
    </div>
  </div>
</div>
</template>

<script>
import BasicDropDown from './form/BasicDropDown';
import SearchInput from './form/SearchInput';
import SearchAutoComplete from './form/SearchAutoComplete';
import BasicInput from './form/BasicInput';
import TheMultipleBasicInput from './form/TheMultipleBasicInput';
import SelectWithChips from './form/SelectWithChips';
import TheExactMatchesInput from './form/TheExactMatchesInput';
import { vocabularyOptionsConfig } from '../../../options.js';
import translations from '../i18n/i18n';

export default {
  components: {
    BasicDropDown,
    SearchInput,
    SearchAutoComplete,
    BasicInput,
    TheMultipleBasicInput,
    SelectWithChips,
    TheExactMatchesInput
  },
  props: {
    // Form Data:
    d: Object,
    // Form Validations:
    // v: Object // PALAUTA
  },
  methods: {
    checkTheLength () {
      this.d.prefLabel.primary < 3 ? this.testErrorMessage = "Must be at least two characters .." : this.testErrorMessage = '';
    },
    submitForm () {
      this.$emit('submitForm');
    },
    messenger () {
      console.log(this.msg);
      Object.keys(this.configDataList.yso).forEach(key => {
        console.log(this.configDataList.yso[key]);
      });
      Object.keys(this.configDataList.juho).forEach(key => {
        console.log(this.configDataList.juho[key]);
      });
      Object.keys(this.configDataList.slm).forEach(key => {
        console.log(this.configDataList.slm[key]);
      });
      Object.keys(this.configDataList.liiko).forEach(key => {
        console.log(this.configDataList.liiko[key]);
      });
      console.log("CheckTermsAlsoInTheIncludedYSO");
      console.log(this.configDataList.yso.CheckTermsAlsoInTheIncludedYSO);
    },
    getConfigDatalist: () => { return this.configDataList},
    setFieldLabelsByMandatoryStatus(propertyTag) {
      let translatedText = '';
      this.propertyTagger = propertyTag;
      const mandatoryCase = '';
      const nonMandatoryCase = ';'
      if (propertyTag === 'prefLabel') {
        this.mandatoryCase = this.preFormattedTranslations[content_lang].new[propertyTag][content_lang].label + "*";
        this.nonMandatoryCase = this.preFormattedTranslations[content_lang].new[propertyTag][content_lang].label ;
      } else {
        this.mandatoryCase = this.preFormattedTranslations[content_lang].new[propertyTag].label + "*";
        this.nonMandatoryCase = this.preFormattedTranslations[content_lang].new[propertyTag].label ;
      }
      const vocabularyConfig = this.configDataList[this.vocabId.toString()];
      vocabularyConfig.primaryLang.mandatory ? translatedText = this.mandatoryCase : translatedText = this.nonMandatoryCase;
      return translatedText;
    }
  },
  data: () => {
    return {
      testErrorMessage: 'Johan se nyt virheen tekikin ..',
      msg: "Pidetään tämäkin reitti avoimena",
      configDataList: vocabularyOptionsConfig,
      vocabId: window.vocab,
      preFormattedTranslations: translations,
      translatedText: '',
      propertyTagger: ''
    }
  }
}
</script>

<style scoped>
.suggestion-header {
  padding-bottom: 8px;
  border-bottom: 1px solid #eeeeee;
}

.suggestion-form {
  margin-top: 20px;
}

.form-submit {
  text-align: right;
  padding: 20px 0;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

.form-submit a {
  padding: 10px 15px;
  color: #ffffff;
  background-color: #3a4553;
  cursor: pointer;
  cursor: hand;
  transition: background-color 0.1s;
}

.form-submit a:hover {
  background-color: #4d5764;
}
</style>
