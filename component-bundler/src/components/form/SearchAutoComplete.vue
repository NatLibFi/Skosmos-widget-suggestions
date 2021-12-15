<template>
<div>
  <label :for="label.for">{{ label.text }}</label>
  <div v-if="selectedOptions && selectedOptions.length > 0" class="chip-list">
    <div v-for="option in selectedOptions" @click="removeLabelSelection(option)" :key="option.id" class="chip">
      <span>{{ option.value }}</span>
      <svg-icon icon-name="cross"><icon-cross /></svg-icon>
    </div>
  </div>
  <div class="input-container">
    <div class="auto-complete">
      <input
        v-model.trim="searchString"
        class="auto-complete-input"
        type="text" />
      <div @click="searchString = ''" class="clear-input">
        <svg-icon
          v-if="searchString.length > 0"
          icon-name="cross">
          <icon-cross />
        </svg-icon>
      </div>
    </div>
    <div v-if="isOpened && options.length > 0"
      class="drop-down-options"
      v-on-clickaway="closeDropDown">
      <div v-for="option in options"
        :key="option.id"
        @click="addLabelSelection(option)"
        class="option">
        <p>{{ option.prefLabel }}</p>
      </div>
    </div>
    <div
      v-if="options.length == 0 && isOpened"
      class="drop-down-options empty-options"
      v-on-clickaway="closeDropDown">
      <div class="option" style="padding-left: 16px;">
        <span>{{ noOptionsMessage }}</span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SvgIcon from '../icons/SvgIcon';
import IconCross from '../icons/IconCross';
import IconCheck from '../icons/IconCheck';
import { directive as onClickaway } from 'vue-clickaway';
import axios from 'axios';
import debounce from 'lodash/debounce';

export default {
  components: {
    SvgIcon,
    IconCross,
    IconCheck
  },
  directives: {
    onClickaway: onClickaway
  },
  props: {
    values: Array,
    vocabulary: String,
    language: String,
    label: Object,
    hasUniqueValue: Boolean
  },
  data () {
    return {
      isOpened: false,
      noOptionsMessage: this.$t('new.common.none'),
      options: [],
      searchString: '',
      selectedOptions: []
    }
  },
  watch: {
    searchString: function() { this.searchLabel() }
  },
  methods: {
    searchLabel: debounce(function() {
      if (this.searchString.length >= 3) {
        this.fetchResults(this.checkCapitalization(this.searchString));
      } else {
        this.isOpened = false;
        this.options = [];
      }
    }, 200),
    fetchResults: async function(inputValue) {
      await axios
        .get(
          // 'http://api.finto.fi/rest/v1/search', {
          'https://api.finto.fi/rest/v1/search', {
            params: {
              vocab: this.vocabulary,
              lang: this.language,
              // lang: 'sv', // Original was lang: 'fi'
              query: inputValue + '*'
            }
          }
        )
        .then(response => (this.options = response.data.results))
        .catch(error => console.log(error));
        this.isOpened = true;
    },
    checkCapitalization(inputValue) {
      if (inputValue && this.vocabulary === this.$t('new.common.places')) {
        return inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
      }
      return inputValue;
    },
    addLabelSelection(option) {
      this.isOpened = false;
      let o = {
        value: option.prefLabel,
        uri: option.uri
      }
      if (this.hasUniqueValue) {
        this.selectedOptions = [];
      }
      if (!this.selectedOptions.some(item => item.value === o.value)) {
        this.selectedOptions.push(o);
      }
      this.searchString = '';
      this.$emit('input', this.selectedOptions);
    },
    removeLabelSelection(option) {
      let index = this.selectedOptions.findIndex(
        item => item.uri === option.uri
      );
      if (index >= 0) {
        this.selectedOptions.splice(index, 1);
      }
      this.$emit('input', this.selectedOptions);
    },
    closeDropDown() {
      this.isOpened = false;
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  font-weight: 500;
  font-size: 13px;
  color: #111111;
  margin-bottom: 8px;
}

.input-container {
  width: 100%;
  margin-bottom: 16px;
  position: relative;
}

.chip-list {
  margin: 16px 0 8px;
  font-size: 12px;
  font-weight: 500;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

.chip-list .chip {
  display: inline-block;
  background-color: #06a798;
  color: #ffffff;
  margin: 0 8px 8px 0;
  padding: 10px 32px 7px 12px;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  cursor: hand;
}

.chip-list .chip svg {
  height: 16px;
  z-index: 4;
  position: absolute;
  top: 50%;
  right: 8px;
  transform: perspective(1px) translateY(-50%);
}

.auto-complete {
  position: relative;
  display: block;
  width: 100%;
  height: 40px;
  color: #00748f;
  background-color: #eBf6f4;
  border-radius: 1px;
  font-size: 14px;
}

.auto-complete-input {
  position: absolute;
  top: 55%;
  transform: perspective(1px) translateY(-50%);
  height: 100%;
  width: 100%;
  padding-left: 10px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 400;
  background-color: #eBf6f4;
  color: #00748f;
  border: none;
  outline: none;
  z-index: 1;
}

.auto-complete svg {
  position: absolute;
  top: 52%;
  right: 10px;
  transform: perspective(1px) translateY(-50%);
  height: 18px;
  vertical-align: middle;
  margin: 0 0 -4px 6px;
}

.drop-down-options {
  position: absolute;
  top: 42px;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: scroll;
  z-index: 2;
  background-color: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 2px;
  -webkit-box-shadow: 6px 8px 17px -6px rgba(200, 200, 200, 0.35);
  -moz-box-shadow: 6px 8px 17px -6px rgba(200, 200, 200, 0.35);
  box-shadow: 6px 8px 17px -6px rgba(200, 200, 200, 0.35);
}

.option {
  padding: 10px 12px 6px;
  border-bottom: 1px solid #f5f5f5;
  color: #555555;
  vertical-align: middle;
}

.option:hover {
  background-color: #f3fbfa;
  color: #111111;
  cursor: pointer;
  cursor: hand;
}

.option p {
  display: inline-block;
  margin: 0;
  font-size: 13px;
  font-weight: 400;
}

.selected {
  font-weight: 500;
}

.empty-options {
  min-width: 250px;
}

@media (max-width: 700px) {
  .input-container, .drop-down-options {
    width: 100%;
  }

  .option {
    padding: 12px 6px 11px;
  }
}
</style>
