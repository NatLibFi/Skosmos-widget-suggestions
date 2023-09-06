<template>
  <div>
    <label :for="label.for">{{ label.text }}</label>
    <div v-if="selectedOptions && selectedOptions.length > 0" class="chip-list">
      <div v-for="option in selectedOptions" @click="removeOption(option)" :key="option.id" class="chip">
        <span>{{ option.prefLabel }}</span>
        <svg-icon icon-name="cross"><icon-cross /></svg-icon>
      </div>
    </div>
    <div class="input-container">
      <div
          @click="isOpened = !isOpened"
          :class="[isOpened ? 'opened' : '', 'select-button']">
        <div class="select-content">
          <span v-if="value && value.length > 0" class="selected">{{ value }}</span>
        </div>
        <svg-icon icon-name="triangle"><icon-triangle /></svg-icon>
      </div>
      <div
          v-if="isOpened && selectableOptions.length === 0" class="drop-down-options empty-options" v-on-clickaway="closeDropDown">
        <div class="option" style="padding-left: 16px;">
          <span>{{ noOptionsMessage }}</span>
        </div>
      </div>
      <div v-if="isOpened && selectableOptions.length > 0" class="drop-down-options" v-on-clickaway="closeDropDown">
        <div v-for="option in selectableOptions"
             :key="option.id"
             @click="selectOption(option)"
             class="option">
          <p>{{ option.prefLabel }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../icons/SvgIcon.vue';
import IconTriangle from '../icons/IconTriangle.vue';
import IconCross from '../icons/IconCross.vue';
import IconCheck from '../icons/IconCheck.vue';
import { directive as onClickaway } from 'vue3-click-away'; // almost working
import { ref, onMounted, inject } from 'vue';

export default {
  components: {
    SvgIcon,
    IconTriangle,
    IconCross,
    IconCheck
  },
  directives: {
    onClickaway: onClickaway,
  },
  props: {
    value: String,
    options: Array,
    label: Object
  },

  setup (props, context) {
    const $t = inject('$t')
    const isOpened = ref(false);
    const noOptionsMessage = ref($t('new.groups.none'))
    let selectableOptions = ref([])
    let selectedOptions = ref([])

    onMounted(() => { selectableOptions.value = props.options })

    // Periaatteessa toimiva, palauta jos kokeilu hajoaa
    // const selectOption = (option) => {
    //   const index = selectableOptions.value.findIndex((item) => item.id === option.id);
    //   if (index !== -1) {
    //     selectedOptions.value.push(selectableOptions.value[index]);
    //     selectableOptions.value.splice(index, 1);
    //     console.log("selectedOptions.value")
    //     console.log(selectedOptions.value)
    //   }
    //   isOpened.value = false;
    //   context.emit('select', selectedOptions);
    // };

    // Väliaikainen kokeilu
    const selectOption = option => {
      selectedOptions.value.push(option);
      // if (selectableOptions && selectableOptions.length > 0) {
      if (selectableOptions) {
        selectableOptions.value.splice(findOptionIndex(option, selectableOptions.value), 1);
      }
      isOpened.value = false;
      context.emit('select', selectedOptions);
    }


    const removeOption = (option) => {
      const index = selectedOptions.value.findIndex((item) => item.id === option.id);
      if (index !== -1) {
        selectableOptions.value.push(selectedOptions.value[index]);
        selectedOptions.value.splice(index, 1);
      }
      context.emit('select', selectedOptions);
    };


    const findOptionIndex = (option, optionList) => {
      return optionList.indexOf(option);
    }

    const closeDropDown = () => {
      isOpened.value = false;
    }

    return {
      isOpened,
      noOptionsMessage,
      selectableOptions,
      selectedOptions,
      // onClickAwayDirective,
      selectOption,
      removeOption,
      closeDropDown
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

.select-button {
  position: relative;
  display: block;
  height: 40px;
  color: #00748f;
  background-color: #eBf6f4;
  border: none;
  border-radius: 1px;
  font-size: 14px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
  cursor: hand;
}

.select-button .select-content {
  position: absolute;
  top: 55%;
  left: 14px;
  transform: perspective(1px) translateY(-50%);
  overflow: hidden;
  font-size: 13px;
  font-weight: 400;
  color: #00748f;
}

.select-button svg {
  position: absolute;
  top: 60%;
  right: 10px;
  transform: perspective(1px) translateY(-50%);
  height: 16px;
  vertical-align: middle;
  margin: 0 0 -4px 6px;
}

.opened svg {
  top: 25%;
  transform: scaleY(-1);
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
  font-size: 13px;
  font-weight: 500;
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

.hidden-checkmark {
  opacity: 0;
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

