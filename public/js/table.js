$(document).ready(function () {
  const table = $('#example').DataTable();

  $.get('/api/client', function (data, status) {

    data.forEach(function (client) {
      table.row.add([
        `<a href="#" class="client-name" data-id="${client._id}">${client.clientName[0]}</a>`,
        client.clientId,
        client.inputData,
        client.amount,
        client.fileMetaDataId,
        client.fileName[0],
        client.source[0],
        client.provider[0],
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
        $('#modal-body')
          .html(`
              <h6>Client name: ${data.name}</h6>
              <h6>Total records: ${data.count}</h6>
              <h6>Total amount: ${data.totalAmount}</h6>
              <h6>All files: ${data.files}</h6>
              `);
        $('#exampleModal').modal('show');
      });
    });
  });
});
