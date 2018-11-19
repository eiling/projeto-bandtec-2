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
      const req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.readyState === 4 && req.status === 200) {
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
        }
      };

      req.open('POST', '/ajax/sign_in', true);
      req.send(new FormData(form));
    }
  })
  ;
});
