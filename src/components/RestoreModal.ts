class RestoreModal {
  public template() {
    return `
            <div class="modal" tabindex="-1" role="dialog" style="display: block">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Continue exercise</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <p>You have an unfinished session. Do you wish to continue this one?</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-restore="modal">Sure! Let's continue</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
        `;
  }
}

export default RestoreModal;
