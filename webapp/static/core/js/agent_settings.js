const processorSwitch = document.getElementById('processor-switch');
const processorAlertDiv = document.getElementById('processor-alert-div');
const processorAlert = document.getElementById('processor-alert');
const processorSelectDiv = document.getElementById('processor-select-div');
const processorFieldDiv = document.getElementById('processor-field-div');
const processorField = document.getElementById('processor-field');
const processorPercentage = document.getElementById('processor-percentage');

processorSwitch.onchange = () => {
  if (processorSwitch.checked) {
    processorAlertDiv.hidden = false;
  } else {
    processorAlertDiv.hidden = true;
    processorAlert.checked = false;
    processorSelectDiv.hidden = true;
    processorFieldDiv.hidden = true;
    processorField.value = '';
    processorField.parentElement.classList.remove('focused');
    processorPercentage.hidden = true;
  }
};

processorAlert.onchange = () => {
  if (processorAlert.checked) {
    processorSelectDiv.hidden = false;
    processorFieldDiv.hidden = false;
    processorPercentage.hidden = false;
  } else {
    processorSelectDiv.hidden = true;
    processorFieldDiv.hidden = true;
    processorField.value = '';
    processorField.parentElement.classList.remove('focused');
    processorPercentage.hidden = true;
  }
};

const memorySwitch = document.getElementById('memory-switch');
const memoryAlertDiv = document.getElementById('memory-alert-div');
const memoryAlert = document.getElementById('memory-alert');
const memorySelectDiv = document.getElementById('memory-select-div');
const memorySelect = document.getElementById('memory-select');
const memoryFieldDiv = document.getElementById('memory-field-div');
const memoryField = document.getElementById('memory-field');
const memoryPercentage = document.getElementById('memory-percentage');
const memoryUnitDiv = document.getElementById('memory-unit-div');

memorySwitch.onchange = () => {
  if (memorySwitch.checked) {
    memoryAlertDiv.hidden = false;
  } else {
    memoryAlertDiv.hidden = true;
    memoryAlert.checked = false;
    memorySelectDiv.hidden = true;
    $('#memory-select').selectpicker('val', '1');
    memoryFieldDiv.hidden = true;
    memoryField.value = '';
    memoryField.parentElement.classList.remove('focused');
    memoryPercentage.hidden = true;
    memoryUnitDiv.hidden = true;
    $('#memory-unit-select').selectpicker('val', '1');
  }
};

memoryAlert.onchange = () => {
  if (memoryAlert.checked) {
    memorySelectDiv.hidden = false;
    memoryFieldDiv.hidden = false;
    if (memorySelect.value === '1') {
      memoryPercentage.hidden = false;
    } else {
      memoryUnitDiv.hidden = false;
    }
  } else {
    memorySelectDiv.hidden = true;
    $('#memory-select').selectpicker('val', '1');
    memoryFieldDiv.hidden = true;
    memoryField.value = '';
    memoryField.parentElement.classList.remove('focused');
    memoryPercentage.hidden = true;
    memoryUnitDiv.hidden = true;
    $('#memory-unit-select').selectpicker('val', '1');
  }
};

$('#memory-select').on('change', () => {
  if (memorySelect.value === '1') {
    memoryPercentage.hidden = false;
    memoryUnitDiv.hidden = true;
    $('#memory-unit-select').selectpicker('val', '1');
  } else {
    memoryPercentage.hidden = true;
    memoryUnitDiv.hidden = false;
  }
});

const diskSwitch = document.getElementById('disk-switch');
const diskAlertDiv = document.getElementById('disk-alert-div');
const diskAlert = document.getElementById('disk-alert');
const diskSelectDiv = document.getElementById('disk-select-div');
const diskSelect = document.getElementById('disk-select');
const diskFieldDiv = document.getElementById('disk-field-div');
const diskField = document.getElementById('disk-field');
const diskPercentage = document.getElementById('disk-percentage');
const diskUnitDiv = document.getElementById('disk-unit-div');

diskSwitch.onchange = () => {
  if (diskSwitch.checked) {
    diskAlertDiv.hidden = false;
  } else {
    diskAlertDiv.hidden = true;
    diskAlert.checked = false;
    diskSelectDiv.hidden = true;
    $('#disk-select').selectpicker('val', '1');
    diskFieldDiv.hidden = true;
    diskField.value = '';
    diskField.parentElement.classList.remove('focused');
    diskPercentage.hidden = true;
    diskUnitDiv.hidden = true;
    $('#disk-unit-select').selectpicker('val', '1');
  }
};

diskAlert.onchange = () => {
  if (diskAlert.checked) {
    diskSelectDiv.hidden = false;
    diskFieldDiv.hidden = false;
    if (diskSelect.value === '1') {
      diskPercentage.hidden = false;
    } else {
      diskUnitDiv.hidden = false;
    }
  } else {
    diskSelectDiv.hidden = true;
    $('#disk-select').selectpicker('val', '1');
    diskFieldDiv.hidden = true;
    diskField.value = '';
    diskField.parentElement.classList.remove('focused');
    diskPercentage.hidden = true;
    diskUnitDiv.hidden = true;
    $('#disk-unit-select').selectpicker('val', '1');
  }
};

$('#disk-select').on('change', () => {
  if (diskSelect.value === '1') {
    diskPercentage.hidden = false;
    diskUnitDiv.hidden = true;
    $('#disk-unit-select').selectpicker('val', '1');
  } else {
    diskPercentage.hidden = true;
    diskUnitDiv.hidden = false;
  }
});

$(() => {
  function handleInterval(t) {
    if (t % 3600000 === 0) {
      return {interval: t / 3600000, value: '3',};
    } else if (t % 60000 === 0) {
      return {interval: t / 60000, value: '2',};
    } else {
      return {interval: t / 1000, value: '1'};
    }
  }

  function handleBytes(a) {
    let c = 1024, d = 2, f = Math.floor(Math.log(a) / Math.log(c));
    return {bytes: parseFloat((a / Math.pow(c, f)).toFixed(d)), value: `${f}`,};
  }

  const i = handleInterval(parseInt(document.getElementById('old-interval').innerText));
  document.getElementById('interval-field').setAttribute('placeholder', i.interval);
  $('#interval-select').selectpicker('val', i.value);

  const cpu = parseInt(document.getElementById('old-cpu').innerText);
  if (cpu === -102) {
    processorSwitch.checked = false;
    processorAlertDiv.hidden = true;

  } else if (cpu <= 0 && cpu >= -100) {
    processorAlert.checked = true;
    processorSelectDiv.hidden = false;
    processorFieldDiv.hidden = false;
    processorField.setAttribute('placeholder', `${-cpu}`);
    processorPercentage.hidden = false;
  }

  const memory = parseInt(document.getElementById('old-memory').innerText);
  if (memory === -102) {
    memorySwitch.checked = false;
    memoryAlertDiv.hidden = true;
  } else if (memory > 0) {
    const m = handleBytes(memory);
    memoryAlert.checked = true;
    memorySelectDiv.hidden = false;
    $('#memory-select').selectpicker('val', '2');
    memoryFieldDiv.hidden = false;
    memoryField.setAttribute('placeholder', `${m.bytes}`);
    memoryUnitDiv.hidden = false;
    $('#memory-unit-select').selectpicker('val', m.value);
  } else if (memory >= -100) {
    memoryAlert.checked = true;
    memorySelectDiv.hidden = false;
    $('#memory-select').selectpicker('val', '1');
    memoryFieldDiv.hidden = false;
    memoryField.setAttribute('placeholder', `${-memory}`);
    memoryPercentage.hidden = false;
  }

  const disk = parseInt(document.getElementById('old-disk').innerText);
  if (disk === -102) {
    diskSwitch.checked = false;
    diskAlertDiv.hidden = true;
  } else if (disk > 0) {
    const m = handleBytes(disk);
    diskAlert.checked = true;
    diskSelectDiv.hidden = false;
    $('#disk-select').selectpicker('val', '2');
    diskFieldDiv.hidden = false;
    diskField.setAttribute('placeholder', `${m.bytes}`);
    diskUnitDiv.hidden = false;
    $('#disk-unit-select').selectpicker('val', m.value);
  } else if (disk >= -100) {
    diskAlert.checked = true;
    diskSelectDiv.hidden = false;
    $('#disk-select').selectpicker('val', '1');
    diskFieldDiv.hidden = false;
    diskField.setAttribute('placeholder', `${-disk}`);
    diskPercentage.hidden = false;
  }
});

const form = document.getElementById('update-agent-form');
const updateAgentButton = document.getElementById('update-agent-button');
let handlingUpdateAgentRequest = false;

form.onreset = () => {
  event.preventDefault();
  window.location.reload();
};

form.onsubmit = () => {
  event.preventDefault();

  if (handlingUpdateAgentRequest) {
    return;
  }
  handlingUpdateAgentRequest = true;

  updateAgentButton.disabled = true;

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
        alert('error in update_agent');
      }

      updateAgentButton.disabled = false;
      handlingUpdateAgentRequest = false;
    }
  };

  req.open('POST', '/ajax/change_agent', true);
  req.send(new FormData(form));
};

const removeAgentButton = document.getElementById('remove-agent-button');
let handlingRemoveAgentRequest = false;

removeAgentButton.onclick = () => {
  if (handlingRemoveAgentRequest) {
    return;
  }
  handlingRemoveAgentRequest = true;

  removeAgentButton.disabled = true;

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
        window.location.replace('/settings');
      } else {
        alert('error in remove_agent');
      }

      removeAgentButton.disabled = false;
      handlingRemoveAgentRequest = false;
    }
  };

  req.open('POST', '/ajax/remove_agent', true);
  req.send(new FormData(document.getElementById('remove-agent-form')));
};