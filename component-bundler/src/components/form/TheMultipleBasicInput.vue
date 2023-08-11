<template>
  <div class="input-container">
    <label :for="label.for">{{ label.text }}</label>
    <div v-if="values && values.length > 0">
      <div v-for="(item, i) in values" :key="item.id" class="inputs">
        <input
            :value="values[i].value"
            @input="handleInput($event.target.value, i)"
            type="text" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  values: Array,
  label: {
    text: String,
    for: String
  }
});

const emit = defineEmits();

const handleInput = (inputValue, index) => {
  const updatedValues = [...props.values];
  if (!props.values[index].isTouched) {
    updatedValues.push({ value: '', isTouched: false });
  }
  updatedValues[index] = {
    value: inputValue,
    isTouched: true
  };
  emit('input-multi', updatedValues);
};
</script>

<style scoped>
  .input-container {
    margin-bottom: 16px;
  }

  .input-container label {
    display: block;
    font-weight: 500;
    font-size: 13px;
    color: #111111;
    margin-bottom: 8px;
  }

  .inputs {
    margin-top: 8px;
  }

  .inputs:first-of-type {
    margin-top: 0;
  }

  .inputs input {
    height: 40px;
    width: 100%;
    border: none;
    border-radius: 1px;
    background-color: #eBf6f4;
    color: #00748f;
    font-size: 14px;
    padding-left: 10px;
    outline: none;
    -webkit-appearance: none;
  }
</style>
