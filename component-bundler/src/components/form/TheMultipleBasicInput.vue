<template>
  <div class="input-container">
    <label :for="label.for">{{ label.text }}</label>
    <div v-for="(item, i) in values" :key="item.id" class="inputs">
      <input
          v-model="item.value"
          @input="handleInput($event.target.value, i)"
          type="text" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    values: Array,
    label: {
      text: String,
      for: String
    }
  },
  setup(props, { emit }) {
    const handleInput = (inputValue, index) => {
      if (index === props.values.length - 1 && inputValue !== '') {
        props.values.push({ value: '', isTouched: false });
      }
      emit('update:values', [...props.values]);
    };

    return { handleInput };
  }
}
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
