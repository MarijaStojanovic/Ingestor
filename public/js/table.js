$(document).ready(function () {
  const table = $('#example').DataTable();

  $.get('/api/client', function (data, status) {

    data.forEach(function (client) {
      table.row.add([
        `<a href="#" class="client-name" data-id="${client._id}">${client.clientName}</a>`,
        client.clientId,
        client.inputData,
        client.amount,
        client.fileMetaDataId,
        client.fileName,
        client.source,
        client.provider,
      ]).draw(false);
    })
  });


  $(function () {
    // Init modal
    $('#exampleModal').modal({
      keyboard: false,
      show: false,
    })


    $(document).on('click', '.client-name', function (e) {
      e.preventDefault();
      const clientId = $(e.target).data('id');

      $.get(`/api/client/${clientId}`, function (data, status) {
        $('#exampleModal')
          .html(`<div class="modal-dialog" role="document" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-content" class="modal-body">
              <h6>Client name: ${data.name}</h6>
              <h6>Total records: ${data.count}</h6>
              <h6>Total amount: ${data.totalAmount}</h6>
              <h6>All files: ${data.files}</h6>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>`);
        $('#exampleModal').modal('show');
      });
    });
  });
});
