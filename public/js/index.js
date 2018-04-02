$('#progress-bar').hide();

$('#upload-file').on('submit', function (e) {
  e.preventDefault();
  const fileName = $('#file').val();

  // Show loader
  $('#progress-bar').show();

  $.ajax({
    url: '/api/upload',
    type: 'POST',

    // Form data
    data: new FormData($('form')[0]),

    cache: false,
    contentType: false,
    processData: false,

    // Custom XMLHttpRequest
    xhr: function () {
      var myXhr = $.ajaxSettings.xhr();
      if (myXhr.upload) {
        // For handling the progress of the upload
        myXhr.upload.addEventListener('progress', function (e) {
          if (e.lengthComputable) {
            $('progress').attr({
              value: e.loaded,
              max: e.total,
            });
          }
        }, false);
      }
      return myXhr;
    }
  })
    .done(function (data) {
      // hide loader
      $('#progress-bar').hide();
      window.location = '/table.html';
    })
    .fail(function () {
      $('#progress-bar').hide();
      alert("error");
    });
});