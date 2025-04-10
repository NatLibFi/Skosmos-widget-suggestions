<template>
<div>
  <label :for="label.for">{{ label.text }}</label>
  <div v-if="searchResult
    && searchResult.uri.length > 0
    && searchString.toLowerCase() === searchResult.prefLabel.toLowerCase()">
      <div v-if="searchResult.vocab === 'yse'">
        <p>
          {{ $t('new.common.ifyse1') }}
          <strong><a target="_blank" :href="searchResult.uri">{{ searchResult.lang === language ? searchResult.prefLabel : ''}}</a></strong>
          {{ $t('new.common.ifyse2') }}
        </p>
      </div>
    <div v-if="searchResult.vocab === 'yso'">
      <p>
        {{ $t('new.common.ifyso') }}
        <strong><a target="_blank" :href="searchResult.uri">{{ searchResult.lang === language ? searchResult.prefLabel : ''}}</a></strong>
      </p>
    </div>
    <div v-if="searchResult.vocab === 'yso-paikat'">
      <p>
        {{ $t('new.common.ifysopaikat') }}
        <strong><a target="_blank" :href="searchResult.uri">{{ searchResult.lang === language ? searchResult.prefLabel : ''}}</a></strong>
      </p>
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
  </div>
</div>
</template>

<script>
import { defineComponent, ref, reactive, watchEffect, inject, watch } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import IconCross from '../icons/IconCross.vue';
import IconCheck from '../icons/IconCheck.vue';
// import { directive as onClickaway } from 'vue-clickaway';
// import { onClickaway } from "vue3-click-away";
import axios from 'axios';
import debounce from 'lodash/debounce';

export default {
  components: {
    SvgIcon,
    IconCross,
    IconCheck
  },
  props: {
    values: Array,
    vocabulary: String,
    label: Object,
    // vocabulary: String,
    language: String,
    conceptType: String
  },

  setup (props, context) {

    const $t = inject('$t');

    let searchString = ref('')
    let searchResult = ref(null)

    watch(searchString, () => {
      searchLabel();
    });

    const searchLabel = debounce(function() {
      if (searchString.value.length >= 2) {
        handleResult(checkCapitalization(searchString.value));
      } else {
        context.emit('input', searchString.value);
      }
    }, 1500)
    const handleResult = async (inputValue) => {
      const vocs = ["yso-paikat", "yso", "yse"];
      for (var i = 0; i < vocs.length; i++) {
        const response = await axios({
          method: 'get',
          url: 'https://api.finto.fi/rest/v1/search',
          params: {
            vocab: vocs[i],
            lang: props.language,
            query: inputValue
          }
        }).catch(error => console.log(error));
        // For the future: this is assigned only if the term is found and is null otherwise
        searchResult.value = response.data.results[0]
        context.emit('input', searchString.value);
        if (searchResult.value) {
          context.emit('input', '');
          break;
        }
      }
    }

    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const checkCapitalization = (inputValue) => {
      if (inputValue && props.vocabulary === $t('new.common.places')) {
        return inputValue.charAt(0).toUpperCase() + inputValue.substr(1);
      }
      return inputValue;
    }

    return {
      searchLabel,
      searchString ,
      searchResult,
      capitalizeFirstLetter,
      checkCapitalization,
      handleResult
    }
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
