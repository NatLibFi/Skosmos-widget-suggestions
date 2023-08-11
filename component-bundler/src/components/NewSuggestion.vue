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
      <basic-drop-down
        :value="d.conceptType.value"
        :options="d.conceptType.options"
        @changeVocabulary="$emit('update:vocabulary', $event)"
        @select="emitEvent('update:conceptType', $event)"
        :label="{text: $t('new.conceptType.label'), for: $t('new.conceptType.for')}" />
<!--      <p v-if="v.$dirty && !v.conceptType.value.required" class="error">{{ $t('new.conceptType.error') }}</p>-->

      <div v-if="$i18n.locale === 'fi'">
        <search-input
          :value="d.prefLabel.primary"
          :conceptType="d.conceptType.value"
          :vocabulary="d.vocabulary"
          :language="'fi'"
          @input="emitEvent('update:primaryPrefLabel', $event)"
          :label="{text: $t('new.prefLabel.fi.label'), for: $t('new.prefLabel.fi.for')}" />
<!--        <p v-if="v.$dirty && !v.prefLabel.primary.required" class="error">{{ $t('new.prefLabel.error') }}</p>-->

        <search-input
          :value="d.prefLabel.secondary"
          :conceptType="d.conceptType.value"
          :vocabulary="d.vocabulary"
          :language="'sv'"
          @input="emitEvent('update:secondaryPrefLabel', $event)"
          :label="{text: $t('new.prefLabel.sv.label'), for: $t('new.prefLabel.sv.for')}" />
      </div>

      <div v-if="$i18n.locale === 'sv'">
        <search-input
          :value="d.prefLabel.primary"
          :vocabulary="d.vocabulary"
          :conceptType="d.conceptType.value"
          :language="'sv'"
          @input="emitEvent('update:primaryPrefLabel', $event)"
          :label="{text: $t('new.prefLabel.sv.label'), for: $t('new.prefLabel.sv.for')}" />
<!--        <p v-if="v.$dirty && !v.prefLabel.primary.required" class="error">{{ $t('new.prefLabel.error') }}</p>-->

        <search-input
          :value="d.prefLabel.secondary"
          :vocabulary="d.vocabulary"
          :conceptType="d.conceptType.value"
          :language="'fi'"
          @input="emitEvent('update:secondaryPrefLabel', $event)"
          :label="{text: $t('new.prefLabel.fi.label'), for: $t('new.prefLabel.fi.for')}" />
      </div>

      <basic-input
        :value="d.prefLabel.en"
        @input:basic="emitEvent('update:enPrefLabel', $event)"
        :label="{text: $t('new.prefLabel.en.label'), for: $t('new.prefLabel.en.for')}"
        :isTextArea="false" />

      <the-multiple-basic-input
        :values="d.altLabels"
        @input-multi="emitEvent('update:altLabels', $event)"
        :label="{text: $t('new.altLabels.label'), for: $t('new.altLabels.for')}" />

      <search-auto-complete
        :values="d.broaderLabels"
        :vocabulary="d.vocabulary"
        :language="$i18n.locale"
        @input="emitEvent('update:broaderLabels', $event)"
        :label="{text: $t('new.broaderLabels.label'), for: $t('new.broaderLabels.for')}"
        :hasUniqueValue="false" />

      <search-auto-complete
        :values="d.narrowerLabels"
        :vocabulary="d.vocabulary"
        :language="$i18n.locale"
        @input="emitEvent('update:narrowerLabels', $event)"
        :label="{text: $t('new.narrowerLabels.label'), for: $t('new.narrowerLabels.for')}"
        :hasUniqueValue="false" />

      <search-auto-complete
        :values="d.relatedLabels"
        :vocabulary="d.vocabulary"
        :language="$i18n.locale"
        @input="emitEvent('update:relatedLabels', $event)"
        :label="{text: $t('new.relatedLabels.label'), for: $t('new.relatedLabels.for')}"
        :hasUniqueValue="false" />

      <select-with-chips
        v-if="d.vocabulary !== $t('new.common.places')"
        :value="$t('new.groups.placeholder')"
        :options="d.groups.allGroups"
        @select="emitEvent('update:groups', $event)"
        :label="{text: $t('new.groups.label'), for: $t('new.groups.for')}" />

      <!-- <ul id="temp-list">
        <li v-for="item in d.groups.allGroups" :key="item.prefLabel">
          {{ item.prefLabel }}
        </li>
      </ul> -->

      <the-exact-matches-input
        :values="d.exactMatches"
        @input="emitEvent('update:exactMatches', $event)"
        :label="{text: $t('new.exactMatches.label'), for: $t('new.exactMatches.for')}"
        />

      <basic-input
        :value="d.scopeNote"
        @input:basic="emitEvent('update:scopeNote', $event)"
        :label="{text: $t('new.scopeNote.label'), for: $t('new.scopeNote.for')}"
        :isTextArea="true" />

      <basic-input
        :value="d.explanation"
        @input:basic="emitEvent('update:explanation', $event)"
        :label="{text: $t('new.explanation.label'), for: $t('new.explanation.label')}"
        :isTextArea="true" />
<!--      <p v-if="v.$dirty && !v.explanation.required" class="error">{{ $t('new.explanation.error') }}</p>-->

<!-- isTextArea set true on 2022-02-01     -->
      <basic-input
        :value="d.neededFor"
        @input:basic="emitEvent('update:neededFor', $event)"
        :label="{text: $t('new.neededFor.label'), for: $t('new.neededFor.for')}"
        :isTextArea="true" />
<!--      <p v-if="v.$dirty && !v.neededFor.required" class="error">{{ $t('new.neededFor.error') }}</p>-->

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
import { defineProps, defineEmits } from 'vue';
import BasicDropDown from './form/BasicDropDown.vue';
import SearchInput from './form/SearchInput.vue';
import SearchAutoComplete from './form/SearchAutoComplete.vue';
import BasicInput from './form/BasicInput.vue';
import TheMultipleBasicInput from './form/TheMultipleBasicInput.vue';
import SelectWithChips from './form/SelectWithChips.vue';
import TheExactMatchesInput from './form/TheExactMatchesInput.vue';

const props = defineProps({
  d: Object,
  v: Object,
});

const emit = defineEmits();

console.log("NewSuggestion.vue: d.prefLabel.en");
console.log(props.d.prefLabel.en);

const emitEvent = (eventName, payload) => {
  console.log("NewSuggestion");
  console.log('Emitting event:', eventName, 'with payload:', payload);
  emit(eventName, payload);
};

const submitForm = () => {
  emit('submitForm');
};

defineExpose({
  emitEvent,
  submitForm,
});
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
