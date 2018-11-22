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
        window.location.reload();
      } else {
        alert('error in update_user');
      }

      updateUserButton.disabled = false;
      handlingUpdateUserRequest = false;
    }
  };

  req.open('POST', '/ajax/update_user', true);
  req.send(new FormData(updateUserForm));
};

const removeDiscordForm = document.getElementById('remove-discord-form');
const removeDiscordButton = document.getElementById('remove-discord-button');
let handlingRemoveDiscordRequest = false;

removeDiscordForm.onsubmit = () => {
  event.preventDefault();

  if (handlingRemoveDiscordRequest) {
    return;
  }
  handlingRemoveDiscordRequest = true;

  removeDiscordButton.disabled = true;

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
        alert('error in remove discord');
      }

      removeDiscordButton.disabled = false;
      handlingRemoveDiscordRequest = false;
    }
  };

  req.open('POST', '/ajax/remove_discord', true);
  req.send(new FormData(removeDiscordForm));
};

const updateDiscordForm = document.getElementById('update-discord-form');
const updateDiscordButton = document.getElementById('update-discord-button');
let handlingUpdateDiscordRequest = false;

updateDiscordForm.onsubmit = () => {
  event.preventDefault();

  if (handlingUpdateDiscordRequest) {
    return;
  }
  handlingUpdateDiscordRequest = true;

  updateDiscordButton.disabled = true;

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
        alert('error in setup_dm');
      }

      updateDiscordButton.disabled = false;
      handlingUpdateDiscordRequest = false;
    }
  };

  req.open('POST', '/ajax/setup_dm', true);
  req.send(new FormData(updateDiscordForm));
};

const pingButton = document.getElementById('ping-button');
let handlingPingRequest = false;

pingButton.onclick = () => {
  if (handlingPingRequest) {
    return;
  }
  handlingPingRequest = true;

  pingButton.disabled = true;

  let requestDone = false;
  const req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState === 4 && req.status === 200) {
      if (requestDone) {
        return;
      }
      requestDone = true;

      const obj = JSON.parse(req.responseText);

      if (obj.status !== 0) {
        alert('error in ping');
      }

      pingButton.disabled = false;
      handlingPingRequest = false;
    }
  };

  req.open('GET', '/ajax/ping', true);
  req.send();
};