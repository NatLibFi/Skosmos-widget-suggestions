<template>
  <div class="input-container">
    <label :for="label.for">{{ label.text }}</label>
    <div
        @click="isOpened = !isOpened"
        :class="[isOpened ? 'opened' : '', 'select-button']">
      <div class="select-content">
        <span v-if="!value">{{ $t('new.conceptType.placeholder') }}</span>
        <span v-if="value && value.length > 0" class="selected">{{ value }}</span>
      </div>
      <svg-icon icon-name="triangle"><icon-triangle /></svg-icon>
    </div>
    <div
        v-if="isOpened && options.length === 0"
        class="drop-down-options empty-options"
        v-on-click-away="closeDropDown">
      <div class="option" style="padding-left: 16px;">
        <span>{{ noOptionsMessage }}</span>
      </div>
    </div>
    <div v-if="isOpened && options.length > 0"
         class="drop-down-options"
         v-on-click-away="closeDropDown">
      <div v-for="(option, i) in options"
           :key="option.id"
           @click="selectOption(i)"
           :class="[isSelected(i) ? 'selected' : '', 'option']">
        <svg-icon
            :class="[isSelected(i) ? '' : 'hidden-checkmark']"
            icon-name="check"><icon-check />
        </svg-icon>
        <p>{{ $t(option.value) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, onBeforeUnmount, inject} from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import IconTriangle from '../icons/IconTriangle.vue';
import IconCheck from '../icons/IconCheck.vue';
import { directive as onClickAway } from 'vue3-click-away';

export default {
  components: {
    SvgIcon,
    IconTriangle,
    IconCheck
  },
  directives: {
    onClickAway
  },
  props: {
    value: String,
    options: Array,
    label: Object
  },
  setup(props, context) {
    const $t = inject('$t');
    const selectedIndex = ref(-1);
    const isOpened = ref(false);
    const count = ref(0)
    const noOptionsMessage = context.attrs['onUpdate:noOptionsMessage'] || 'No options available';
    const selectOption = (index) => {
      selectedIndex.value = index;
      isOpened.value = false;
      context.emit('changeVocabulary', props.options[index].vocab);
      context.emit('select', $t(props.options[index].value)); // path
    };

    const handleClick = () => {
      console.log('BEFORE: Clicked! isOpened:', isOpened.value);
      isOpened.value = !isOpened.value;
      console.log('AFTER: Clicked! isOpened:', isOpened.value);
    };

    // const isSelected = (index) => selectedIndex.value === index;
    const isSelected = (index) => {
      return selectedIndex.value === index;
    };

    const closeDropDown = () => {
      isOpened.value = false;
    };

    return {
      isOpened,
      noOptionsMessage,
      count,
      selectOption,
      isSelected,
      closeDropDown,
      handleClick
    };
  }
};
</script>



<style scoped>
.input-container {
  margin-bottom: 16px;
  width: 50%;
  position: relative;
}

.input-container label {
  display: block;
  font-weight: 500;
  font-size: 13px;
  color: #111111;
  margin-bottom: 8px;
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
  top: 68px;
  left: 0;
  width: calc(100% - 2px);
  z-index: 4;
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

.option svg {
  height: 10px;
  margin-right: 5px;
  vertical-align: middle;
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
  .input-container {
    width: 100%;
  }

  .option {
    padding: 12px 6px 11px;
  }
}
</style>
