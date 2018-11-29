let handlingRequest = false;

$(function () {
  $('#sign-up-form').validate({
    rules: {
      'confirm': {
        equalTo: '[name="password"]',
      },
    },
    highlight: function (input) {
      console.log(input);
      $(input).parents('.form-line').addClass('error');
    },
    unhighlight: function (input) {
      $(input).parents('.form-line').removeClass('error');
    },
    errorPlacement: function (error, element) {
      $(element).parents('.input-group').append(error);
      $(element).parents('.form-group').append(error);
    },
    submitHandler: function (form) {
      if (handlingRequest) {
        return false;
      }
      handlingRequest = true;

      const submitButton = document.getElementById('submit-button');
      submitButton.disabled = true;

      let requestDone = false;

      const req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.readyState === 4 && req.status === 200) {
          if (requestDone) {
            return;
          }
          requestDone = true;

          const obj = JSON.parse(req.responseText);

          if (obj.status === 0) {
            swal({
              title: 'Sucesso!',
              icon: 'success',
            }, () => window.location.replace('/'));
          } else {
            swal({
              title: 'Ocorreu um erro!',
              icon: 'error',
            }, () => window.location.reload());
          }

          submitButton.disabled = false;
          handlingRequest = false;
        }
      };

      req.open('POST', '/ajax/sign_up', true);
      req.send(new FormData(form));

      return false;
    }
  });
});
