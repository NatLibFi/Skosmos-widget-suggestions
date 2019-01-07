<template>
    <div class="template">
      <div class="dialog-overlay" @click="close">
      </div>
      <div class="dialog-modal">
        <div class="dialog-content">
          <div class="dialog-close" @click="close">
            <svg-icon icon-name="cross"><icon-cross /></svg-icon>
          </div>
          <slot></slot>
        </div>
      </div>
  </div>
</template>

<script>
import SvgIcon from '../icons/SvgIcon';
import IconCross from '../icons/IconCross';

export default {
  components: {
    SvgIcon,
    IconCross
  },
  methods: {
    close: function() {
      this.$emit('close');
    }
  },
  mounted: function() {
    document.addEventListener('keydown', e => {
      if (e.keyCode == 27) {
        this.close();
      }
    });
  }
};
</script>

<style scoped>
h5 {
  font-weight: 500 !important;
  font-size: 15px;
  max-width: 60%;
}
strong {
  font-weight: 600 !important;
}
a {
  color: #00748f;
  font-weight: 500 !important;
}
.dialog-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 2;
}

.dialog-modal {
  font-size: 14px;
  color: #474b4f;
  background-color: #ffffff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-height: 60px;
  max-height: calc(100% - 80px);
  width: 650px;
  overflow-y: auto;
  z-index: 3;
  padding: 0;
  border-top: 2px solid #000000;
}

.dialog-content {
  padding: 25px 30px 20px;
}

.dialog-close {
  position: absolute;
  top: 25px;
  right: 30px;
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 850px) {
  .dialog-modal {
    max-width: calc(100% - 100px);
    width: 80vw;
    min-width: 200px;
  }
  .dialog-content {
    padding: 40px 20px 25px;
  }

  .dialog-close {
    right: 20px;
  }
}
</style>
