let handlingRequest = false;

$(function () {
  $('#sign-in-form').validate({
    highlight: function (input) {
      console.log(input);
      $(input).parents('.form-line').addClass('error');
    },
    unhighlight: function (input) {
      $(input).parents('.form-line').removeClass('error');
    },
    errorPlacement: function (error, element) {
      $(element).parents('.input-group').append(error);
    },
    submitHandler: function (form) {
      if (handlingRequest) {
        return;
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
            window.location.reload();
          } else {
            const alert = document.getElementById('alert-div');
            alert.innerText = 'Erro ao autenticar. Verifique seus dados e tente novamente.';
            alert.hidden = false;
            form.reset();
            document.getElementById('username-field').focus();
          }

          submitButton.disabled = false;
          handlingRequest = false;
          requestDone = false;
        }
      };

      req.open('POST', '/ajax/sign_in', true);
      req.send(new FormData(form));
    }
  });
});
