<template>
<div class="suggestion-container">
  <div class="suggestion-header">
    <h4>{{ $t('new.header') }}</h4>
    <p>{{ $t('new.p1') }}</p>
    <p>{{ $t('new.p2') }}</p>
  </div>
  <div class="suggestion-form">
    <div class="form-inputs">
      <basic-drop-down
        :value="d.conceptType.value"
        :options="d.conceptType.options"
        @changeVocabulary="$emit('update:vocabulary', $event)"
        @select="$emit('update:conceptType', $event)"
        :label="{text: $t('new.conceptType.label'), for: $t('new.conceptType.for')}" />
      <p v-if="v.$dirty && !v.conceptType.value.required" class="error">{{ $t('new.conceptType.error') }}</p>

      <div v-if="$i18n.locale === 'fi'">
        <search-input
          :value="d.prefLabel.primary"
          :vocabulary="d.vocabulary"
          :language="'fi'"
          @input="$emit('update:primaryPrefLabel', $event)"
          :label="{text: $t('new.prefLabel.fi.label'), for: $t('new.prefLabel.fi.for')}" />
        <p v-if="v.$dirty && !v.prefLabel.primary.required" class="error">{{ $t('new.prefLabel.error') }}</p>

        <search-input
          :value="d.prefLabel.secondary"
          :vocabulary="d.vocabulary"
          :language="'sv'"
          @input="$emit('update:secondaryPrefLabel', $event)"
          :label="{text: $t('new.prefLabel.sv.label'), for: $t('new.prefLabel.sv.for')}" />
      </div>

      <div v-if="$i18n.locale === 'sv'">
        <search-input
          :value="d.prefLabel.primary"
          :vocabulary="d.vocabulary"
          :language="'sv'"
          @input="$emit('update:primaryPrefLabel', $event)"
          :label="{text: $t('new.prefLabel.sv.label'), for: $t('new.prefLabel.sv.for')}" />
        <p v-if="v.$dirty && !v.prefLabel.primary.required" class="error">{{ $t('new.prefLabel.error') }}</p>

        <search-input
          :value="d.prefLabel.secondary"
          :vocabulary="d.vocabulary"
          :language="'fi'"
          @input="$emit('update:secondaryPrefLabel', $event)"
          :label="{text: $t('new.prefLabel.fi.label'), for: $t('new.prefLabel.fi.for')}" />
      </div>

      <basic-input
        :value="d.prefLabel.en"
        @input="$emit('update:enPrefLabel', $event)"
        :label="{text: $t('new.prefLabel.en.label'), for: $t('new.prefLabel.en.for')}"
        :isTextArea="false" />

      <the-multiple-basic-input
        :values="d.altLabels"
        @input="$emit('update:altLabels', $event)"
        :label="{text: $t('new.altLabels.label'), for: $t('new.altLabels.for')}" />

      <search-auto-complete
        :values="d.broaderLabels"
        :vocabulary="d.vocabulary"
        @input="$emit('update:broaderLabels', $event)"
        :label="{text: $t('new.broaderLabels.label'), for: $t('new.broaderLabels.for')}"
        :hasUniqueValue="false" />

      <search-auto-complete
        :values="d.narrowerLabels"
        :vocabulary="d.vocabulary"
        @input="$emit('update:narrowerLabels', $event)"
        :label="{text: $t('new.narrowerLabels.label'), for: $t('new.narrowerLabels.for')}"
        :hasUniqueValue="false" />

      <search-auto-complete
        :values="d.relatedLabels"
        :vocabulary="d.vocabulary"
        @input="$emit('update:relatedLabels', $event)"
        :label="{text: $t('new.relatedLabels.label'), for: this.$t('new.relatedLabels.for')}"
        :hasUniqueValue="false" />

      <select-with-chips
        v-if="d.vocabulary !== $t('new.common.places')"
        :value="$t('new.groups.placeholder')"
        :options="d.groups.allGroups"
        @select="$emit('update:groups', $event)"
        :label="{text: $t('new.groups.label'), for: this.$t('new.groups.for')}" />

      <the-exact-matches-input
        :values="d.exactMatches"
        @input="$emit('update:exactMatches', $event)"
        :label="{text: $t('new.exactMatches.label'), for: this.$t('new.exactMatches.for')}"
        />

      <basic-input
        :value="d.scopeNote"
        @input="$emit('update:scopeNote', $event)"
        :label="{text: $t('new.scopeNote.label'), for: $t('new.scopeNote.for')}"
        :isTextArea="true" />

      <basic-input
        :value="d.explanation"
        @input="$emit('update:explanation', $event)"
        :label="{text: $t('new.explanation.label'), for: $t('new.explanation.label')}"
        :isTextArea="true" />
      <p v-if="v.$dirty && !v.explanation.required" class="error">{{ $t('new.explanation.error') }}</p>

      <basic-input
        :value="d.neededFor"
        @input="$emit('update:neededFor', $event)"
        :label="{text: $t('new.neededFor.label'), for: $t('new.neededFor.for')}"
        :isTextArea="false" />
      <p v-if="v.$dirty && !v.neededFor.required" class="error">{{ $t('new.neededFor.error') }}</p>

      <basic-input
        :value="d.fromOrg"
        @input="$emit('update:fromOrg', $event)"
        :label="{text: $t('new.fromOrg.label'), for: $t('new.fromOrg.for')}"
        :isTextArea="false" />
    </div>

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
    v: Object
  },
  methods: {
    submitForm () {
      this.$emit('submitForm');
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
