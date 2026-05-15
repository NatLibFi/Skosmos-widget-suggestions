SUGGESTION_PLUGIN.draggableDialogComponent = {
  props: {
    showFooter: Boolean,
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
    },
    handleTabDownEvent(e) {
      if (e.shiftKey) {
        e.preventDefault()
        if (document.getElementById('suggestion-form-submit')) {
          // If shift+tab is pressed when form is open, move focus to submit button
          document.querySelector('#suggestion-form-submit button').focus({ preventScroll: true })
        } else if (document.getElementById('suggestion-success-link')) {
          // If shift+tab is pressed when success message is open, move focus to github link
          document.getElementById('suggestion-success-link').focus({ preventScroll: true })
        }
      } else if (!document.getElementById('suggestion-form-submit') && !document.getElementById('suggestion-success-link')) {
        // If tab is pressed when failure message is open, do not move focus
        e.preventDefault()
      }
    }
  },
  template: `
    <div v-drag="handleDragEvent" v-drag-stop="handleDragStopEvent">
      <div class="suggestion-dialog-overlay"></div>
      <div class="suggestion-dialog-modal" role="dialog" aria-labelledby="suggestion-title"
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
              @keydown.tab="handleTabDownEvent($event)"
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
