<template>
<div>
  <label :for="label.for">{{ label.text }}</label>
  <div v-if="searchResult
    && searchResult.uri.length > 0
    && checkCapitalization(searchString) === searchResult.prefLabel">
    <p>
      {{ $t('new.common.exists') }} <strong>{{ $t('new.common.voc') }}</strong>:
      <a :href="searchResult.uri">{{ searchResult.lang === 'fi' ? 'suomee' : ''}}</a>
      <!-- <a :href="searchResult.uri">{{ searchResult.prefLabel }}</a> -->
    </p>
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
    label: Object,
    vocabulary: String,
    language: String
  },
  data () {
    return {
      searchString: '',
      searchResult: null
    }
  },
  watch: {
    searchString: function() { this.searchLabel() }
  },
  methods: {
    searchLabel: debounce(function() {
      if (this.searchString.length >= 2) {
        this.handleResult(this.checkCapitalization(this.searchString));
      } else {
        this.$emit('input', this.searchString);
      }
    }, 200),
    handleResult: async function(inputValue) {
      await axios
        .get(
          // 'http://api.finto.fi/rest/v1/search', {
          'https://api.finto.fi/rest/v1/search', {
            params: {
              vocab: this.vocabulary,
              lang: this.language,
              query: inputValue
            }
          }
        )
        .then(response => (this.searchResult = response.data.results[0]))
        .catch(error => console.log(error));
      this.$emit('input', this.searchString);
      if (this.searchResult && this.searchResult.prefLabel === this.searchString) {
        this.$emit('input', '');
      }
    },
    checkCapitalization(inputValue) {
      if (inputValue && this.vocabulary === this.$t('new.common.places')) {
        return inputValue.charAt(0).toUpperCase() + inputValue.substr(1);
      }
      return inputValue;
    },
  }
};
</script>

<style scoped>
a, a:hover, a:active, a:visited {
  color: #00748f;
}

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
  top: 53.5%;
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
