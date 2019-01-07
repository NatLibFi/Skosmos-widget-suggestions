<template>
  <div class="input-container">
    <label :for="label.for">{{ label.text }}</label>
    <input
      v-if="!isTextArea"
      :value="value"
      @input="$emit('input', $event.target.value)"
      type="text" />
    <textarea
      v-if="isTextArea"
      :value="value"
      @input="$emit('input', $event.target.value)"
      rows="3">
    </textarea>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    label: {
      text: String,
      for: String
    },
    isTextArea: Boolean
  },
  data () {
    return {
    }
  },
  methods: {

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

.input-container input,
.input-container textarea {
  height: 40px;
  width: 100%;
  background-color: #eBf6f4;
  border: none;
  color: #00748f;
  padding-left: 10px;
  font-size: 14px;
  border-radius: 1px;
  outline: none;
  -webkit-appearance: none;
}

.input-container textarea {
  height: 70px;
  min-height: 70px;
  padding-top: 8px;
  padding-bottom: 8px;
  resize: vertical;
}
</style>
