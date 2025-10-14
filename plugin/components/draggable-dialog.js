SUGGESTION_PLUGIN.draggableDialogComponent = {
  data() {
    return {
      isDragging: false,
      mouseXPos: 0,
      mouseYPos: 0,
      x: 0,
      y: 0
    }
  },
  methods: {
    handleDragStartEvent (e) {
      e.preventDefault()
      this.isDragging = true
    },
    handleDragEvent (e) {
      e.preventDefault()
      if (this.isDragging && e.buttons === 1) {
        const diffX = e.clientX - this.mouseXPos
        const diffY = e.clientY - this.mouseYPos
        this.x += diffX
        this.y += diffY
      }
      this.mouseXPos = e.clientX
      this.mouseYPos = e.clientY
    },
    handleDragStopEvent (e) {
      e.preventDefault()
      this.isDragging = false
    },
    getModalStyle () {
      return {
        left: 'calc(50% + ' + this.x + 'px)',
        top: 'calc(50% + ' + this.y + 'px)'
      }
    }
  },
  emits: ['close-dialog'],
  template: `
    <div v-drag="handleDragEvent" v-drag-stop="handleDragStopEvent">
      <div class="suggestion-dialog-overlay"></div>
      <div class="suggestion-dialog-modal"
        :style="getModalStyle()"
      >
        <div id="suggestion-dialog-top" class="row"
          @mousedown="handleDragStartEvent"
        >
          <div id="suggestion-dialog-handle" class="col ps-0">
            <i class="fa-solid fa-grip-vertical align-middle" aria-hidden="true"></i>
          </div>
          <div id="suggestion-dialog-close" class="col text-end pe-0">
            <i class="fa-solid fa-xmark align-middle" role="button"
              :aria-label="$t('common.aria.close')"
              @click="this.$emit('close-dialog')"
            ></i>
          </div>
        </div>
        <div id="suggestion-dialog-content" class="p-3">
          <slot name="content"></slot>
        </div>
        <div id="suggestion-dialog-footer" class="px-3 py-2">
          <div class="d-flex justify-content-between align-items-center">
            <span>{{ $t('common.required') }}</span>
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  `
}
