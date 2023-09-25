<template>
  <div>
    <div class="suggestion-header">
      <h4>{{ $t('edit.header') }} <a :href="uri">{{ label }}</a></h4>
      <p>{{ $t('edit.paragraph') }}</p>
    </div>
    <div class="suggestion-form">
      <div>
        <basic-input
            :value="formData.description"
            @input:basic="updateDescription"
            :label="{ text: $t('edit.description.label'), for: $t('edit.description.label') }"
            :isTextArea="true"
        />
         <p v-if="!descriptionCanBeSent && submitted" class="error">{{ $t('edit.description.error') }}</p>

        <basic-input
            :value="formData.reason"
            @input:basic="updateReason"
            :label="{ text: $t('edit.reason.label'), for: $t('edit.reason.for') }"
            :isTextArea="true"
        />
         <p v-if="!reasonCanBeSent && submitted" class="error">{{ $t('edit.reason.error') }}</p>

        <basic-input
            :value="formData.fromOrg"
            @input:basic="updateFromOrg"
            :label="{ text: $t('edit.fromOrg.label'), for: $t('edit.fromOrg.for') }"
            :isTextArea="false"
        />
      </div>

      <div class="form-submit">
        <a @click="submitForm">{{ $t('edit.submit') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import BasicInput from './form/BasicInput.vue';
import { defineComponent, ref, reactive, watchEffect, inject, watch } from 'vue';

export default {
  components: {
    BasicInput,
  },
  props: {
    d: Object,
    label: String,
    uri: String,
  },
  setup(props, { emit }) {
    const formData = ref(props.d);
    const descriptionCanBeSent = ref(false)
    const reasonCanBeSent = ref(false)
    const submitted = ref(false)

    const updateDescription = (value) => {
      formData.value.description = value;
    };

    const updateReason = (value) => {
      formData.value.reason = value;
    };

    const updateFromOrg = (value) => {
      formData.value.fromOrg = value;
    };

    watch(
        () => [formData.value.description, formData.value.description.length],
        (newValues, oldValues) => {
          const descriptionLength = newValues[1];

          if (descriptionLength > 2) {
            descriptionCanBeSent.value = true
          } else {
            descriptionCanBeSent.value = false
          }
        },
        { deep: true }
    )

    watch(
        () => [formData.value.reason, formData.value.reason.length],
        (newValues, oldValues) => {
          const reasonLength = newValues[1];

          if (reasonLength > 2) {
            reasonCanBeSent.value = true
          } else {
            reasonCanBeSent.value = false
          }
        },
        { deep: true }
    )


    const submitForm = () => {
    submitted.value = true
      if (descriptionCanBeSent.value == true && reasonCanBeSent.value == true) {
        emit('submitForm')
      }
    };

    return {
      formData,
      updateDescription,
      updateReason,
      updateFromOrg,
      submitForm,
      descriptionCanBeSent,
      reasonCanBeSent,
      submitted
    };
  },
};
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
