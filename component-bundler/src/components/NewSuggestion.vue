<template>
<div class="suggestion-container">
  <!-- Keep this as an option -->
  <!-- <button onclick="navigator.clipboard.writeText(window.location.href)">Kopioi leikepöydälle</button> -->
  <div class="suggestion-header">
    <h4>{{ $t('new.header') }}</h4>
    <p>{{ $t('new.p1') }}</p>
    <p>{{ $t('new.p2') }}</p>
  </div>
  <div class="suggestion-form">
    <div class="form-inputs">
      <!-- The addAsteriskIfNeeded function passes arguments as a reference to the translation and a property in the options.js file -->
      <basic-drop-down v-if="configDataList[vocabId].type.show" id="typeField"
        :value="d.conceptType.value"
        :options="d.conceptType.options"
        @changeVocabulary="$emit('update:vocabulary', $event)"
        @select="$emit('update:conceptType', $event)"
        :label="{text: addAsteriskIfNeeded('new.conceptType.label', 'type'), for: $t('new.conceptType.for')}" />
        <p v-if="typeError" class="error">{{ typeError }}</p>
    </div>

    <div >
      <search-input v-if="$i18n.locale === 'fi' && configDataList[vocabId].primaryLang.show" 
        :value="d.prefLabel.primary"
        :conceptType="d.conceptType.value"
        :vocabulary="d.vocabulary"
        :language="'fi'"
        @input="$emit('update:primaryPrefLabel', $event)"
        :label="{text: addAsteriskIfNeeded('new.prefLabel.fi.label', 'primaryLang'), for: $t('new.prefLabel.fi.for')}" />
        <p v-if="primaryLangError" class="error">{{ primaryLangError }}</p>

      <search-input v-if="$i18n.locale === 'fi' && configDataList[vocabId].secondaryLang.show"
        :value="d.prefLabel.secondary"
        :conceptType="d.conceptType.value"
        :vocabulary="d.vocabulary"
        :language="'sv'"
        @input="$emit('update:secondaryPrefLabel', $event)"
        :label="{text: addAsteriskIfNeeded('new.prefLabel.sv.label', 'secondaryLang'), for: $t('new.prefLabel.sv.for')}" />
        <p v-if="secondaryLangError" class="error">{{ secondaryLangError }}</p>
    </div>

    <div >
      <search-input v-if="$i18n.locale === 'sv' && configDataList[vocabId].primaryLang.show"
        :value="d.prefLabel.primary"
        :vocabulary="d.vocabulary"
        :conceptType="d.conceptType.value"
        :language="'sv'"
        @input="$emit('update:primaryPrefLabel', $event)"
        :label="{text: addAsteriskIfNeeded('new.prefLabel.sv.label', 'primaryLang'), for: $t('new.prefLabel.sv.for')}" />
        <p v-if="primaryLangError" class="error">{{ primaryLangError }}</p>

      <search-input v-if="$i18n.locale === 'sv' && configDataList[vocabId].secondaryLang.show"
        :value="d.prefLabel.secondary"
        :vocabulary="d.vocabulary"
        :conceptType="d.conceptType.value"
        :language="'fi'"
        @input="$emit('update:secondaryPrefLabel', $event)"
        :label="{text: addAsteriskIfNeeded('new.prefLabel.fi.label', 'secondaryLang'), for: $t('new.prefLabel.fi.for')}" />
        <p v-if="secondaryLangError" class="error">{{ secondaryLangError }}</p>
    </div>

    <basic-input v-if="configDataList[vocabId].optionalLanguage.show"
      :value="d.prefLabel.en"
      @input="$emit('update:enPrefLabel', $event)"
      :label="{text: addAsteriskIfNeeded('new.prefLabel.en.label', 'optionalLanguage'), for: $t('new.prefLabel.en.for')}"
      :isTextArea="false" />
      <p v-if="optionalLanguageError" class="error">{{ optionalLanguageError }}</p>

    <the-multiple-basic-input v-if="configDataList[vocabId].altLabels.show"
      :values="d.altLabels"
      @input="$emit('update:altLabels', $event)"
      :label="{text: addAsteriskIfNeeded('new.altLabels.label', 'altLabels'), for: $t('new.altLabels.for')}" />
      <p v-if="altLabelsError" class="error">{{ altLabelsError }}</p>

    <search-auto-complete v-if="configDataList[vocabId].broaders.show"
      :values="d.broaderLabels"
      :vocabulary="d.vocabulary"
      :language="$i18n.locale"
      @input="$emit('update:broaderLabels', $event)"
      :label="{text: addAsteriskIfNeeded('new.broaderLabels.label', 'broaders'), for: $t('new.broaderLabels.for')}"
      :hasUniqueValue="false" />
      <p v-if="broadersError" class="error">{{ broadersError }}</p>

    <search-auto-complete v-if="configDataList[vocabId].narrowers.show"
      :values="d.narrowerLabels"
      :vocabulary="d.vocabulary"
      :language="$i18n.locale"
      @input="$emit('update:narrowerLabels', $event)"
      :label="{text: addAsteriskIfNeeded('new.narrowerLabels.label', 'narrowers'), for: $t('new.narrowerLabels.for')}"
      :hasUniqueValue="false" />
      <p v-if="narrowersError" class="error">{{ narrowersError }}</p>

    <search-auto-complete v-if="configDataList[vocabId].related.show"
      :values="d.relatedLabels"
      :vocabulary="d.vocabulary"
      :language="$i18n.locale"
      @input="$emit('update:relatedLabels', $event)"
      :label="{text: addAsteriskIfNeeded('new.relatedLabels.label', 'related'), for: this.$t('new.relatedLabels.for')}"
      :hasUniqueValue="false" />
      <p v-if="relatedError" class="error">{{ relatedError }}</p>

    <select-with-chips 
      v-if="d.vocabulary !== $t('new.common.places') && configDataList[vocabId].thematicGroups.show"
      :value="$t('new.groups.placeholder')"
      :options="d.groups.allGroups"
      @select="$emit('update:groups', $event)"
      :label="{text: addAsteriskIfNeeded('new.groups.label', 'thematicGroups'), for: this.$t('new.groups.for')}" />
      <p v-if="thematicGroupsError" class="error">{{ thematicGroupsError }}</p>

    <the-exact-matches-input v-if="configDataList[vocabId].exactMatches.show"
      :values="d.exactMatches"
      @input="$emit('update:exactMatches', $event)"
      :label="{text: addAsteriskIfNeeded('new.exactMatches.label', 'exactMatches'), for: this.$t('new.exactMatches.for')}"
      />
      <p v-if="exactMatchesError" class="error">{{ exactMatchesError }}</p>

    <basic-input v-if="configDataList[vocabId].scopeNote.show"
      :value="d.scopeNote"
      @input="$emit('update:scopeNote', $event)"
      :label="{text: addAsteriskIfNeeded('new.scopeNote.label', 'scopeNote'), for: $t('new.scopeNote.for')}"
      :isTextArea="true" />
      <p v-if="scopeNoteError" class="error">{{ scopeNoteError }}</p>

    <basic-input v-if="configDataList[vocabId].explanation.show"
      :value="d.explanation"
      @input="$emit('update:explanation', $event)"
      :label="{text: addAsteriskIfNeeded('new.explanation.label', 'explanation'), for: $t('new.explanation.label')}"
      :isTextArea="true" />
      <p v-if="explanationError" class="error">{{ explanationError }}</p>

    <basic-input v-if="configDataList[vocabId].neededFor.show"
      :value="d.neededFor"
      @input="$emit('update:neededFor', $event)"
      :label="{text: addAsteriskIfNeeded('new.neededFor.label', 'neededFor'), for: $t('new.neededFor.for')}"
      :isTextArea="true" />
      <p v-if="neededForError" class="error">{{ neededForError }}</p>

    <basic-input v-if="configDataList[vocabId].fromOrg.show"
      :value="d.fromOrg"
      @input="$emit('update:fromOrg', $event)"
      :label="{text: addAsteriskIfNeeded('new.fromOrg.label', 'fromOrg'), for: $t('new.fromOrg.for')}"
      :isTextArea="false" />
      <p v-if="fromOrgError" class="error">{{ fromOrgError }}</p>

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
    typeError: {
     type: String,
     default () {
       return ''
      }
    },
    primaryLangError: {
      type: String,
      default () {
      return ''
    }
  },
    secondaryLangError: {
      type: String,
      default () {
      return ''
    }
  },
    optionalLanguageError: {
      type: String,
      default () {
      return ''
    }
  },
    altLabelsError: {
      type: String,
      default () {
      return ''
    }
  },
    broadersError: {
      type: String,
      default () {
      return ''
    }
  },
    narrowersError: {
      type: String,
      default () {
      return ''
    }
  },
    relatedError: {
      type: String,
      default () {
      return ''
    }
  },
    thematicGroupsError: {
      type: String,
      default () {
      return ''
    }
  },
    exactMatchesError: {
      type: String,
      default () {
      return ''
    },
  },
    scopeNoteError: {
      type: String,
      default () {
      return ''
    }
  },
    explanationError: {
      type: String,
      default () {
      return ''
    }
  },
    neededForError: {
      type: String,
      default () {
      return ''
    }
  },
    fromOrgError: {
      type: String,
      default () {
      return ''
    }
  }
},
  methods: {
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
    addAsteriskIfNeeded(translation, configKey) {
      // The function checks if the field to be shown is set as mandatory and if it is, the asterisk must be added to the end of the field label. 
      // So far English is not a language item in the tranlslations list and therefore it needs a special treatment
      var langProperty = content_lang;
      lang === 'en' ? langProperty = 'fi' : langProperty;
      const parts = translation.split('.');
      if (parts.length === 3) {
        // e.g. new.conceptType.label in the translations // 3 parts
        return (vocabularyOptionsConfig[vocab][configKey].mandatory ? translations[langProperty][parts[0]][parts[1]][parts[2]] + "*" : translations[langProperty][parts[0]][parts[1]][parts[2]]);
      } else {
        // e.g new.prefLabel.fi.label in the translations // 4 parts
        return (vocabularyOptionsConfig[vocab][configKey].mandatory ? translations[langProperty][parts[0]][parts[1]][parts[2]][parts[3]] + "*" : translations[langProperty][parts[0]][parts[1]][parts[2]][parts[3]]);
      }
    },
  },
  data: () => {
    return {
      testErrorMessage: 'Johan se nyt virheen tekikin ..',
      msg: "Pidetään tämäkin reitti avoimena",
      configDataList: vocabularyOptionsConfig,
      vocabId: window.vocab,
      preFormattedTranslations: translations,
      translatedText: '',
      propertyTagger: '',
      cLang: lang
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
