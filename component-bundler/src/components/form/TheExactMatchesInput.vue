<template>
  <div class="inputs-container">
    <label :for="label.for">{{ label.text }}</label>
    <div v-if="values && values.length > 0">
      <div v-for="(item, i) in values" :key="item.id" class="input-pair">
        <input
          :values="values[i].vocab"
          @input="handleVocabInput($event.target.value, i)"
          :placeholder="$t('new.exactMatches.vocab')"
          type="text" />
        <input
          :values="values[i].value"
          @input="handleValueInput($event.target.value, i)"
          :placeholder="$t('new.exactMatches.uri')"
          type="text" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    values: Array,
    label: {
      text: String,
      for: String
    }
  },
  methods: {
    handleVocabInput: function(inputVocab, index) {
      let updatedValues = this.values;
      if (!this.values[index].isTouched) {
        this.values.push({vocab: '', value: '', isTouched: false});
      }
      updatedValues[index].vocab = inputVocab;
      updatedValues[index].isTouched = true;
      this.$emit('input', updatedValues);
    },
    handleValueInput: function(inputValue, index) {
      let updatedValues = this.values;
      if (!this.values[index].isTouched) {
        this.values.push({vocab: '', value: '', isTouched: false});
      }
      updatedValues[index].value = inputValue;
      updatedValues[index].isTouched = true;
      this.$emit('input', updatedValues);
    }
  }
}
</script>

<style scoped>
  .inputs-container {
    margin-bottom: 16px;
  }

  .inputs-container label {
    display: block;
    font-weight: 500;
    font-size: 13px;
    color: #111111;
    margin-bottom: 8px;
  }

  .input-pair {
    margin-bottom: 8px;
    margin-top: 8px;
  }

  .input-pair:first-of-type {
    margin-top: 0;
  }

  .input-pair input {
    display: inline-block;
    height: 40px;
    width: 48%;
    border: none;
    border-radius: 1px;
    background-color: #eBf6f4;
    color: #00748f;
    font-size: 14px;
    padding-left: 10px;
    outline: none;
    -webkit-appearance: none;
  }

  .input-pair input:last-of-type {
    margin-left: 3%;
  }

  @media (max-width: 700px) {
    .input-pair {
      margin-top: 16px;
    }

    .input-pair input,
    .input-pair input:last-of-type {
      display: block;
      margin: 8px 0 0;
      width: 100%;
    }
  }
</style>
