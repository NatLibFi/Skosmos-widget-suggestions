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
            type="text"
        />
        <div @click="clearInput" class="clear-input">
          <svg-icon v-if="searchString.length > 0" icon-name="cross">
            <icon-cross />
          </svg-icon>
        </div>
      </div>
      <div v-if="isOpened && options.length > 0" class="drop-down-options" v-on-clickaway="closeDropDown">
        <div v-for="option in options" :key="option.id" @click="addLabelSelection(option)" class="option">
          <p>{{ option.prefLabel }}</p>
        </div>
      </div>
      <div v-if="options.length == 0 && isOpened" class="drop-down-options empty-options" v-on-clickaway="closeDropDown">
        <div class="option" style="padding-left: 16px;">
          <span>{{ noOptionsMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../icons/SvgIcon.vue';
import IconCross from '../icons/IconCross.vue';
import IconCheck from '../icons/IconCheck.vue';
import { directive as onClickaway } from 'vue3-click-away';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { ref, watch, onMounted, defineEmits} from 'vue';

export default {
  components: {
    SvgIcon,
    IconCross,
    IconCheck,
  },
  directives: {
    onClickaway: onClickaway,
  },
  props: {
    values: Array,
    vocabulary: String,
    language: String,
    label: Object,
    hasUniqueValue: Boolean,
  },
  setup(props, context) {
    const isOpened = ref(false);
    const noOptionsMessage = 'new.common.none'; // Provide the translation key
    const options = ref([]);
    const searchString = ref('');
    const selectedOptions = ref([]);

    const searchLabel = debounce(() => {
      if (searchString.value.length >= 3) {
        fetchResults(checkCapitalization(searchString.value));
      } else {
        isOpened.value = false;
        options.value = [];
      }
    }, 200);

    const fetchResults = async (inputValue) => {
      try {
        const response = await axios.get('https://api.finto.fi/rest/v1/search', {
          params: {
            vocab: props.vocabulary,
            lang: props.language,
            query: inputValue + '*',
          },
        });
        options.value = response.data.results;
        isOpened.value = true;
      } catch (error) {
        console.error(error);
      }
    };

    const checkCapitalization = (inputValue) => {
      if (inputValue && props.vocabulary === 'new.common.places') {
        return inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
      }
      return inputValue;
    };

    const addLabelSelection = (option) => {
      isOpened.value = false;
      const o = {
        value: option.prefLabel,
        uri: option.uri,
      };
      if (props.hasUniqueValue) {
        selectedOptions.value = [];
      }
      if (!selectedOptions.value.some((item) => item.value === o.value)) {
        selectedOptions.value.push(o);
      }
      searchString.value = '';
      context.emit('update:selectedOptions', selectedOptions.value);
    };

    const removeLabelSelection = (option) => {
      const index = selectedOptions.value.findIndex((item) => item.uri === option.uri);
      if (index >= 0) {
        selectedOptions.value.splice(index, 1);
      }
      context.emit('update:selectedOptions', selectedOptions.value); // Emit the event
    };

    const closeDropDown = () => {
      isOpened.value = false;
    };

    const clearInput = () => {
      searchString.value = '';
    };

    watch(searchString, searchLabel);

    onMounted(() => {
      // Initialize data or perform actions after initial render
    });

    return {
      isOpened,
      noOptionsMessage,
      options,
      searchString,
      selectedOptions,
      addLabelSelection,
      removeLabelSelection,
      closeDropDown,
      clearInput,
    };
  },
};
</script>




<!--Almost working-->
<!--<template>
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
           v-on-click-away="closeDropDown">
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
          v-on-click-away="closeDropDown">
        <div class="option" style="padding-left: 16px;">
          <span>{{ noOptionsMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../icons/SvgIcon.vue';
import IconCross from '../icons/IconCross.vue';
import IconCheck from '../icons/IconCheck.vue';
import { directive as onClickAway } from 'vue3-click-away';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

export default {
  components: {
    SvgIcon,
    IconCross,
    IconCheck
  },
  directives: {
    onClickAway: onClickAway
  },
  props: {
    values: Array,
    vocabulary: String,
    language: String,
    label: Object,
    hasUniqueValue: Boolean
  },
  setup(props) {
    const isOpened = ref(false);
    const noOptionsMessage = 'new.common.none';
    const options = ref([]);
    const searchString = ref('');
    const selectedOptions = ref([]);

    const searchLabel = debounce(function () {
      if (searchString.value.length >= 3) {
        fetchResults(checkCapitalization(searchString.value));
      } else {
        isOpened.value = false;
        options.value = [];
      }
    }, 200);

    const fetchResults = async function (inputValue) {
      try {
        const response = await axios.get('https://api.finto.fi/rest/v1/search', {
          params: {
            vocab: props.vocabulary,
            lang: props.language,
            query: inputValue + '*',
          },
        });
        options.value = response.data.results;
        isOpened.value = true;
      } catch (error) {
        console.error(error);
      }
    };

    const checkCapitalization = function (inputValue) {
      if (inputValue && props.vocabulary === 'new.common.places') {
        return inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
      }
      return inputValue;
    };

    const addLabelSelection = function (option) {
      isOpened.value = false;
      let o = {
        value: option.prefLabel,
        uri: option.uri,
      };
      if (props.hasUniqueValue) {
        selectedOptions.value = [];
      }
      if (!selectedOptions.value.some((item) => item.value === o.value)) {
        selectedOptions.value.push(o);
      }
      searchString.value = '';
      context.emit('update:selectedOptions', selectedOptions.value);
    };

    const removeLabelSelection = function (option) {
      const index = selectedOptions.value.findIndex((item) => item.uri === option.uri);
      if (index >= 0) {
        selectedOptions.value.splice(index, 1);
      }
      context.emit('update:selectedOptions', selectedOptions.value);
    };

    const closeDropDown = function () {
      isOpened.value = false;
    };

    const clearInput = function () {
      searchString.value = '';
    };

    watch(searchString, searchLabel);

    onMounted(() => {
      // Initialize data or perform actions after initial render
    });

    onBeforeUnmount(() => {
      // Clean up before component is unmounted
    });

    return {
      isOpened,
      noOptionsMessage,
      options,
      searchString,
      selectedOptions,
      addLabelSelection,
      removeLabelSelection,
      closeDropDown,
      clearInput,
    };
  },
};
</script>-->


<!--vue 2 style-->
<!--<template>
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
            type="text"
        />
        <div @click="clearInput" class="clear-input">
          <svg-icon v-if="searchString.length > 0" icon-name="cross">
            <icon-cross />
          </svg-icon>
        </div>
      </div>
      <div v-if="isOpened && options.length > 0" class="drop-down-options" v-on-click-away="closeDropDown">
        <div v-for="option in options" :key="option.id" @click="addLabelSelection(option)" class="option">
          <p>{{ option.prefLabel }}</p>
        </div>
      </div>
      <div v-if="options.length == 0 && isOpened" class="drop-down-options empty-options" v-on-click-away="closeDropDown">
        <div class="option" style="padding-left: 16px;">
          <span>{{ noOptionsMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import IconCross from '../icons/IconCross.vue';
import IconCheck from '../icons/IconCheck.vue';
import { directive as onClickAway } from 'vue3-click-away';
import axios from 'axios';
import debounce from 'lodash/debounce';

export default {
  components: {
    SvgIcon,
    IconCross,
    IconCheck,
  },
  directives: {
    onClickAway
  },
  props: {
    values: Array,
    vocabulary: String,
    language: String,
    label: Object,
    hasUniqueValue: Boolean,
  },
  setup(props, context) {
    let isOpened = ref(false);
    const noOptionsMessage = 'new.common.none'; // Provide the translation key
    let options = ref([]);
    let searchString = ref('');
    let selectedOptions = ref([]);

    const searchLabel = debounce(() => {
      if (searchString.value.length >= 3) {
        fetchResults(checkCapitalization(searchString.value));
      } else {
        isOpened.value = false;
        options.value = [];
      }
    }, 200);

    const fetchResults = async (inputValue) => {
      try {
        const response = await axios.get('https://api.finto.fi/rest/v1/search', {
          params: {
            vocab: props.vocabulary,
            lang: props.language,
            query: inputValue + '*',
          },
        });
        options.value = response.data.results;
        isOpened.value = true;
      } catch (error) {
        console.error(error);
      }
    };

    const checkCapitalization = (inputValue) => {
      if (inputValue && props.vocabulary === 'new.common.places') {
        return inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
      }
      return inputValue;
    };
    // ORIG
    // const addLabelSelection = (option) => {
    //   isOpened.value = false;
    //   const o = {
    //     value: option.prefLabel,
    //     uri: option.uri,
    //   };
    //   if (props.hasUniqueValue) {
    //     selectedOptions.value = [];
    //   }
    //   if (!selectedOptions.value.some((item) => item.value === o.value)) {
    //     selectedOptions.value.push(o);
    //   }
    //   searchString.value = '';
    //   context.emit('update:selectedOptions', selectedOptions.value);
    // };

    const addLabelSelection = (option) => {
      isOpened = false;
      let o = {
        value: option.prefLabel,
        uri: option.uri,
      };
/*      console.log("typeof selectedOptions")
      console.log(typeof selectedOptions)
      console.log(o.value)  // Change this line*/
      // console.log("selectedOptions")
      // console.log(selectedOptions)
      // selectedOptions = [];
/*      console.log("props.hasUniqueValue")
      console.log(props.hasUniqueValue)*/
      // console.log(selectedOptions)
/*      if (!selectedOptions) {
        selectedOptions = []
      } else {}*/



      // orig
/*      if (!props.hasUniqueValue) {
        selectedOptions = [];
      }*/

/*      for (const oKey in selectedOptions) {
        console.log("for (const oKey in selectedOptions) {")
        console.log("oKey")
        console.log(oKey)
      }*/
      console.log(selectedOptions)
      if (typeof selectedOptions === "object") {
        selectedOptions = []
        selectedOptions.push(o);
      } else {
        selectedOptions.push(o);
      }
      console.log("selectedOptions")
      console.log(selectedOptions)
      searchString = '';
      context.emit('inputsac', selectedOptions);
    };


/*
    const addLabelSelection = (option) => {
      isOpened.value = false;
      const o = {
        value: option.prefLabel,
        uri: option.uri,
      };
      if (props.hasUniqueValue) {
        selectedOptions = [];
      }
      if (!selectedOptions.some((item) => item.value === o.value)) {
/!*        console.log("typeof selectedOptions")
        console.log(typeof selectedOptions)
        console.log(item.value)
        console.log(o.value)*!/
        selectedOptions.push(o);
      }
      searchString.value = '';
      context.emit('update:selectedOptions', selectedOptions);
    };*/





    const removeLabelSelection = (option) => {
      const index = selectedOptions.value.findIndex((item) => item.uri === option.uri);
      if (index >= 0) {
        selectedOptions.value.splice(index, 1);
      }
      context.emit('update:selectedOptions', selectedOptions.value);

/*      console.log("In the SearchAutoComplete")
      console.log("typeof(options)")
      console.log(typeof(options))
      console.log("typeof(selectedOptions)")
      console.log(typeof(selectedOptions))*/


    };

    const closeDropDown = () => {
      isOpened.value = false;
    };

    const clearInput = () => {
      searchString.value = '';
    };

    watch(searchString, searchLabel);

    onMounted(() => {
      // Initialize data or perform actions after initial render
    });

    return {
      isOpened,
      noOptionsMessage,
      options,
      searchString,
      selectedOptions,
      addLabelSelection,
      removeLabelSelection,
      closeDropDown,
      clearInput,
    };
  },
};
</script>-->

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





