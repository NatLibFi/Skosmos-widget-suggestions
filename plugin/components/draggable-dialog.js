SUGGESTION_PLUGIN.draggableDialogComponent = {
  emits: ['close-dialog'],
  template: `
    <div>
      <div class="suggestion-dialog-overlay"></div>
      <div class="suggestion-dialog-modal">
        <div id="suggestion-dialog-top" class="row">
          <div id="suggestion-dialog-handle" class="col">
            <i class="fa-solid fa-grip-vertical align-middle" aria-hidden="true"></i>
          </div>
          <div id="suggestion-dialog-close" class="col text-end">
            <i class="fa-solid fa-xmark align-middle" aria-label="Close" role="button"
              @click="this.$emit('close-dialog')"
            ></i>
          </div>
        </div>
        <div id="suggestion-dialog-content" class="p-3">
          <slot></slot>
        </div>
      </div>
    </div>
  `
}
