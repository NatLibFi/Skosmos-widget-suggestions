<template>

<div class="suggestion-container">
  <!-- <button onclick="navigator.clipboard.writeText(window.location.href)">Kopioi leikepöydälle</button> -->
  <div class="suggestion-header">
    <h4 v-if="vocab === 'yso'">{{ $t('new.header') }}</h4>
    <h4 v-else-if="vocab === 'yso-paikat'">{{ $t('new.header-geo') }}</h4>
    <p>{{ $t('new.p1') }}</p>
    <p>{{ $t('new.p2') }}</p>
  </div>
  <div class="suggestion-form">
    <div class="form-inputs">
      <basic-drop-down
        :value="d.conceptType.value"
        :options="d.conceptType.options"
        @changeVocabulary="$emit('update:vocabulary', $event)"
      @select="handleSelect($event)"
        :label="{text: $t('new.conceptType.label'), for: $t('new.conceptType.for')}"
      />
      <p v-if="!conceptTypeIsSelected && sending" class="error">{{ $t('new.conceptType.error') }}</p>
      <div v-if="$i18n.locale === 'fi'">
        <search-input
          :value="d.prefLabel.primary"
          :conceptType="d.conceptType.value"
          :vocabulary="d.vocabulary"
          :language="'fi'"
          @input="handlePrefLabel($event)"
          :label="{text: $t('new.prefLabel.fi.label'), for: $t('new.prefLabel.fi.for')}" />
        <p v-if="!prefLabelOkay && sending" class="error">{{ $t('new.prefLabel.error') }}</p>

        <search-input
          :value="d.prefLabel.secondary"
          :conceptType="d.conceptType.value"
          :vocabulary="d.vocabulary"
          :language="'sv'"
          @input="emitEvent('update:secondaryPrefLabel', $event)"
          :label="{text: $t('new.prefLabel.sv.label'), for: $t('new.prefLabel.sv.for')}" />

        <!--lisätty 2023-09-18-->
        <basic-input
            :value="d.prefLabel.en"
            @input:basic="emitEvent('update:enPrefLabel', $event)"
            :label="{text: $t('new.prefLabel.en.label'), for: $t('new.prefLabel.en.for')}"
            :isTextArea="false" />

      </div>

      <div v-if="$i18n.locale === 'sv'">
        <search-input
          :value="d.prefLabel.primary"
          :vocabulary="d.vocabulary"
          :conceptType="d.conceptType.value"
          :language="'sv'"
          @input="handlePrefLabel($event)"
          :label="{text: $t('new.prefLabel.sv.label'), for: $t('new.prefLabel.sv.for')}" />
        <p v-if="!prefLabelOkay && sending" class="error">{{ $t('new.prefLabel.error') }}</p>

        <search-input
          :value="d.prefLabel.secondary"
          :vocabulary="d.vocabulary"
          :conceptType="d.conceptType.value"
          :language="'fi'"
          @input="emitEvent('update:secondaryPrefLabel', $event)"
          :label="{text: $t('new.prefLabel.fi.label'), for: $t('new.prefLabel.fi.for')}" />

<!--lisätty 2023-09-18-->
        <basic-input
            :value="d.prefLabel.en"
            @input:basic="emitEvent('update:enPrefLabel', $event)"
            :label="{text: $t('new.prefLabel.en.label'), for: $t('new.prefLabel.en.for')}"
            :isTextArea="false" />

      </div>

      <div v-if="$i18n.locale === 'en'">

        <basic-input
            :value="d.prefLabel.en"
            @input:basic="emitEvent('update:enPrefLabel', $event)"
            :label="{text: $t('new.prefLabel.en.label'), for: $t('new.prefLabel.en.for')}"
            :isTextArea="false" />

        <search-input
            :value="d.prefLabel.primary"
            :conceptType="d.conceptType.value"
            :vocabulary="d.vocabulary"
            :language="'fi'"
            @input="handlePrefLabel($event)"
            :label="{text: $t('new.prefLabel.fi.label'), for: $t('new.prefLabel.fi.for')}" />
        <p v-if="!prefLabelOkay && sending" class="error">{{ $t('new.prefLabel.error') }}</p>

        <search-input
            :value="d.prefLabel.secondary"
            :conceptType="d.conceptType.value"
            :vocabulary="d.vocabulary"
            :language="'sv'"
            @input="emitEvent('update:secondaryPrefLabel', $event)"
            :label="{text: $t('new.prefLabel.sv.label'), for: $t('new.prefLabel.sv.for')}" />

      </div>

      <the-multiple-basic-input
        :values="d.altLabels"
        @input-multi="emitEvent('update:altLabels', $event)"
        :label="{text: $t('new.altLabels.label'), for: $t('new.altLabels.for')}" />

      <search-auto-complete
        :values="d.broaderLabels"
        :vocabulary="d.vocabulary"
        :language="$i18n.locale"
        @update:selectedOptions="emitEvent('update:broaderLabels', $event)"
        :label="{text: $t('new.broaderLabels.label'), for: $t('new.broaderLabels.for')}"
        :hasUniqueValue="false" />

      <search-auto-complete
        :values="d.narrowerLabels"
        :vocabulary="d.vocabulary"
        :language="$i18n.locale"
        @update:selectedOptions="emitEvent('update:narrowerLabels', $event)"
        :label="{text: $t('new.narrowerLabels.label'), for: $t('new.narrowerLabels.for')}"
        :hasUniqueValue="false" />

      <search-auto-complete
        :values="d.relatedLabels"
        :vocabulary="d.vocabulary"
        :language="$i18n.locale"
        @update:selectedOptions="emitEvent('update:relatedLabels', $event)"
        :label="{text: $t('new.relatedLabels.label'), for: $t('new.relatedLabels.for')}"
        :hasUniqueValue="false" />

        <!-- :class="{'hidden': d.vocabulary === $t('new.common.places')}" -->
      <select-with-chips
        :class="{'hidden': d.vocabulary === 'yso-paikat'}"
        :value="$t('new.groups.placeholder')"
        :options="d.groups.allGroups"
        @select="emitEvent('update:groups', $event)"
        :label="{text: $t('new.groups.label'), for: $t('new.groups.for')}" />

      <the-exact-matches-input
        :values="d.exactMatches"
        @inputexm="emitEvent('update:exactMatches', $event)"
        :label="{text: $t('new.exactMatches.label'), for: $t('new.exactMatches.for')}"
        />

      <basic-input
        :value="d.scopeNote"
        @input:basic="emitEvent('update:scopeNote', $event)"
        :label="{text: $t('new.scopeNote.label'), for: $t('new.scopeNote.for')}"
        :isTextArea="true" />

      <basic-input
        :value="d.explanation"
        @input:basic="handleExplanation($event)"
        :label="{text: $t('new.explanation.label'), for: $t('new.explanation.label')}"
      :isTextArea="true" />
      <p v-if="!explanationOkay && sending" class="error">{{ $t('new.explanation.error') }}</p>

      <basic-input
        :value="d.neededFor"
        @input:basic="handleNeededFor($event)"
        :label="{text: $t('new.neededFor.label'), for: $t('new.neededFor.for')}"
        :isTextArea="true" />
            <p v-if="!neededForOkay && sending" class="error">{{ $t('new.neededFor.error') }}</p>

      <basic-input
        :value="d.fromOrg"
        @input:basic="emitEvent('update:fromOrg', $event)"
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

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import BasicDropDown from './form/BasicDropDown.vue';
import SearchInput from './form/SearchInput.vue';
import SearchAutoComplete from './form/SearchAutoComplete.vue';
import BasicInput from './form/BasicInput.vue';
import TheMultipleBasicInput from './form/TheMultipleBasicInput.vue';
import SelectWithChips from './form/SelectWithChips.vue';
import TheExactMatchesInput from './form/TheExactMatchesInput.vue';

const vocab = window.vocab

const testLang = ref(window.lang);

const props = defineProps({
  d: Object,
  v: Object,
  conceptTypeIsSelected: Boolean,
  prefLabelOkay: Boolean,
  explanationOkay: Boolean,
  neededForOkay: Boolean,
  sending: Boolean
});

const emit = defineEmits();

const emitEvent = (eventName, payload) => {
  emit(eventName, payload);
};

const handleSelect = (value) => {
  emitEvent('update:conceptType', value)
  emitEvent('update:conceptTypeIsSelected', value)

}
const handlePrefLabel = (value) => {
  emitEvent('update:primaryPrefLabel', value)
  emitEvent('update:prefLabelOkay', value)
}

const handleExplanation = (value) => {
  emitEvent('update:explanation', value)
  emitEvent('update:explanationOkay', value)
}

const handleNeededFor = (value) => {
  emitEvent('update:neededFor', value)
  emitEvent('update:neededForOkay', value)
}


const submitForm = () => {
  emit('submitForm');
};

defineExpose({
  emitEvent,
  submitForm,
});
</script>



<style scoped>
.hidden {
  display: none;
}
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
