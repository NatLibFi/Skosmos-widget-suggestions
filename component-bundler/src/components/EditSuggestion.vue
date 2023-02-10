<template>
<div>
  <div class="suggestion-header">
    <h4>{{ $t('edit.header') }} <a :href="uri">{{ label }}</a></h4>
    <p>{{ $t('edit.paragraph') }}</p>
  </div>
  <div class="suggestion-form">
    <div>
      <basic-input
        :value="d.description"
        @input="$emit('update:description', $event)"
        :label="{text: $t('edit.description.label'), for: $t('edit.description.label')}"
        :isTextArea="true" />
      <!-- <p v-if="v.$dirty && !v.description.required" class="error">{{ $t('edit.description.error') }}</p> PALAUTA -->

      <basic-input
        :value="d.reason"
        @input="$emit('update:reason', $event)"
        :label="{text: $t('edit.reason.label'), for: $t('edit.reason.for')}"
        :isTextArea="true" />
      <!-- <p v-if="v.$dirty && !v.reason.required" class="error">{{ $t('edit.reason.error') }}</p> PALAUTA -->

      <basic-input
        :value="d.fromOrg"
        @input="$emit('update:fromOrg', $event)"
        :label="{text: $t('edit.fromOrg.label'), for: $t('edit.fromOrg.for')}"
        :isTextArea="false" />
    </div>

    <div class="form-submit">
      <a @click="submitForm()">
        {{ $t('edit.submit') }}
      </a>
    </div>
  </div>
</div>
</template>

<script>
import BasicInput from './form/BasicInput';

export default {
  components: {
    BasicInput
  },
  props: {
    // Form Data:
    d: Object,
    // Form Validations:
    // v: Object, // PALAUTA
    label: String,
    uri: String
  },
  methods: {
    submitForm () {
      this.$emit('submitForm');
    }
  }
}
</script>

<style scoped>
a {
  color: #00748f;
  font-weight: 500 !important;
}

.error {
  color: #e83a30;
  text-indent: 2px;
  font-size: 13px;
  margin-top: -10px;
  margin-bottom: 16px;
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
