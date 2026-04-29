SUGGESTION_PLUGIN.draggableDialogComponent = {
  props: {
    showFooter: Boolean,
    submitDisabled: Boolean,
    submitText: String
  },
  emits: ['close-dialog', 'submit'],
  data () {
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
      // Only register dragging done with left mouse button
      if (this.isDragging && e.buttons === 1) {
        // Differences between old and new mouse coordinates
        const diffX = e.clientX - this.mouseXPos
        const diffY = e.clientY - this.mouseYPos
        // Update element position
        this.x += diffX
        this.y += diffY
      }
      // Update mouse coordinates
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
  template: `
    <div v-drag="handleDragEvent" v-drag-stop="handleDragStopEvent">
      <div class="suggestion-dialog-overlay"></div>
      <div class="suggestion-dialog-modal"
        :style="getModalStyle()"
      >
        <div id="suggestion-dialog-top" class="row" tabindex="-1"
          @mousedown="handleDragStartEvent"
        >
          <div id="suggestion-dialog-handle" class="col ps-0">
            <i class="fa-solid fa-grip-vertical align-middle" aria-hidden="true"></i>
          </div>
          <div id="suggestion-dialog-close" class="col text-end pe-0">
            <button class="btn btn-danger"
              :aria-label="$t('common.aria.close')"
              @click="$emit('close-dialog')"
            >
              <i class="fa-solid fa-xmark align-middle" aria-hidden="true" focusable="false"></i>
            </button>
          </div>
        </div>
        <div id="suggestion-dialog-content" class="p-3">
          <slot></slot>
        </div>
        <div id="suggestion-dialog-footer" class="px-3 py-2" v-if="showFooter">
          <div class="d-flex justify-content-between align-items-center">
            <span>{{ $t('common.required') }}</span>
            <submit-button
              :text="submitText"
              @submit="$emit('submit')"
            ></submit-button>
          </div>
        </div>
      </div>
    </div>
  `
}
