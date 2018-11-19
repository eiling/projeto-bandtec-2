const form = document.getElementById('login-form');
const usernameField = document.getElementById('username-field');
const passwordField = document.getElementById('password-field');

form.onsubmit = () => {
  event.preventDefault();

  if (usernameField.value === '' || passwordField.value === '') {
    swal("Erro!", "Preencha todos os campos!", "error");
    return;
  }

  let req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState === 4 && req.status === 200) {
      const obj = JSON.parse(req.responseText);

      if (obj.status === 0) {
        window.location.reload();
      } else {
        form.reset();

        const e = new Event('reset');
        usernameField.dispatchEvent(e);
        passwordField.dispatchEvent(e);

        swal("Erro!", "Usuário ou senha incorretos", "error");
      }
    }
  };

  req.open('POST', '/ajax/login', true);
  req.send(new FormData(form));
};