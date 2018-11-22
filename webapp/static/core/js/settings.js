const updateUserForm = document.getElementById('update-user-form');
const updateUserButton = document.getElementById('update-user-button');
let handlingUpdateUserRequest = false;

updateUserForm.onsubmit = () => {
  event.preventDefault();

  if (handlingUpdateUserRequest) {
    return;
  }
  handlingUpdateUserRequest = true;

  updateUserButton.disabled = true;

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
        alert('Done!');
      } else {
        alert('error in setup_dm');
      }

      updateUserButton.disabled = false;
      handlingUpdateUserRequest = false;
    }
  };

  req.open('POST', '/ajax/update_user', true);
  req.send(new FormData(updateUserForm));
};
