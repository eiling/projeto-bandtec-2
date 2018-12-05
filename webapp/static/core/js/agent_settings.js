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

const form = document.getElementById('update-agent-form');

form.onreset = () => {
  event.preventDefault();
  window.location.reload();
};