const ajaxInterval = 1000, dataLength = 60;

function getRawData(data) {
  const a = [], l = data.length, k = dataLength - l;
  for (let i = 0; i < l; i++) {
    a.push([k + i, data[i]])
  }
  return a;
}

const agentId = document.getElementById('agent-id-field').innerText;

let requestDone = false;
let lastTimestamp = 0;

setInterval(() => {
  let req = new XMLHttpRequest();
  requestDone = false;
  req.onreadystatechange = () => {
    if (req.readyState === 4 && req.status === 200) {
      if (requestDone) {
        return;
      }
      requestDone = true;

      const obj = JSON.parse(req.responseText);

      if (obj.status === 0) {
        if (obj.content.data.timestamp === lastTimestamp) {
          return;
        }
        lastTimestamp = obj.content.data.timestamp;

        const data = obj.content.data;
        const alerts = obj.content.alerts;

        if (data.processor) {
          document.getElementById('processor-box').innerText =
            parseFloat(data.processor.systemCpuLoad * 100).toFixed(1) + '%';

          if (alerts.cpu) {
            const e = document.getElementById('processor-icon');
            e.classList.remove('col-blue');
            e.classList.add('col-red');

            processorPlot.getOptions().series.color = 'rgb(244,67,54)';
          } else {
            const e = document.getElementById('processor-icon');
            e.classList.remove('col-red');
            e.classList.add('col-blue');

            processorPlot.getOptions().series.color = 'rgb(33,150,243)';
          }

          processorData.push(data.processor.systemCpuLoad * 100);
          if (processorData.length > dataLength) {
            processorData.shift();
          }

          processorPlot.setData([getRawData(processorData)]);
          processorPlot.draw();
        }
        if (data.memory) {
          const a = data.memory.available;
          const t = data.memory.total;
          const p = 100 - (a * 100 / t);
          document.getElementById('memory-box').innerText = parseFloat(p).toFixed(1) + '%';
          document.getElementById('memory-popover')
            .setAttribute('data-content', formatBytes(a) + ' (disponível) / ' + formatBytes(t) + ' (total)');

          if (alerts.memory) {
            const e = document.getElementById('memory-icon');
            e.classList.remove('col-blue');
            e.classList.add('col-red');

            memoryPlot.getOptions().series.color = 'rgb(244,67,54)';
          } else {
            const e = document.getElementById('memory-icon');
            e.classList.remove('col-red');
            e.classList.add('col-blue');

            memoryPlot.getOptions().series.color = 'rgb(33,150,243)';
          }

          memoryData.push(p);
          if (memoryData.length > dataLength) {
            memoryData.shift();
          }

          memoryPlot.setData([getRawData(memoryData)]);
          memoryPlot.draw();
        }
        if (data.fileStores) {
          let i = 0;
          for (const partition of data.fileStores) {
            const a = partition.usableSpace;
            const t = partition.totalSpace;
            const p = 100 - (a * 100 / t);
            document.getElementById(`partition-${i}-box`).innerText =
              parseFloat(p).toFixed(1) + '%';
            document.getElementById(`partition-${i}-popover`)
              .setAttribute('data-content', formatBytes(a) + ' (disponível) / ' + formatBytes(t) + ' (total)');

            partitionData[i].push(p);
            if (partitionData[i].length > dataLength) {
              partitionData[i].shift();
            }

            partitionPlot[i].setData([getRawData(partitionData[i])]);
            partitionPlot[i].draw();

            i++;
          }

          if (alerts.disk) {
            const e = document.getElementById('disk-icon');
            e.classList.remove('col-blue');
            e.classList.add('col-red');

            partitionPlot[0].getOptions().series.color = 'rgb(244,67,54)';
          } else {
            const e = document.getElementById('disk-icon');
            e.classList.remove('col-red');
            e.classList.add('col-blue');

            partitionPlot[0].getOptions().series.color = 'rgb(33,150,243)';
          }
        }
      }
    }
  };

  req.open('GET', '/ajax/query_data?id=' + agentId, true);
  req.send();
}, ajaxInterval);

const alertRefresh = document.getElementById('alert-refresh');
const alertTable = document.getElementById('alert-table');
const alertTableBody = document.getElementById('alert-table-body');
const noAlerts = document.getElementById('no-alerts');

let handlingRefreshRequest = false;

const getAlerts = () => {
  if (handlingRefreshRequest) {
    return;
  }
  handlingRefreshRequest = true;

  let refreshRequestDone = false;

  const req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState === 4 && req.status === 200) {
      if (refreshRequestDone) {
        return;
      }
      refreshRequestDone = true;

      const obj = JSON.parse(req.responseText);

      if (obj.status === 0) {
        const alerts = obj.content.alerts;

        if (alerts.length > 0) {
          alertTableBody.innerHTML = '';

          for (const e of alerts) {
            const tr = document.createElement('tr');
            const resource = document.createElement('td');
            const threshold = document.createElement('td');
            const period = document.createElement('td');

            if (e.resource === 'CPU') {
              resource.innerText = 'CPU';
            } else if (e.resource === 'MEMORY') {
              resource.innerText = 'Memória';
            } else if (e.resource === 'DISK') {
              resource.innerText = 'Disco';
            } else {
              resource.innerText = 'ERRO'
            }

            if (e.threshold.type === 0) {
              threshold.innerText = formatBytes(e.threshold.value);
            } else {
              threshold.innerText = `${e.threshold.value}%`
            }

            period.innerText =
              `${new Date(e.begin).toLocaleString('pt-BR')} à ${new Date(e.end).toLocaleString('pt-BR')}`;

            tr.appendChild(resource);
            tr.appendChild(threshold);
            tr.appendChild(period);

            alertTableBody.appendChild(tr);
          }

          alertTable.hidden = false;
          noAlerts.hidden = true;
        } else {
          alertTable.hidden = true;
          noAlerts.hidden = false;
        }

      } else {
        alert('Erro ao atualizar tabela de alertas');
      }

      handlingRefreshRequest = false;
    }
  };

  req.open('GET', '/ajax/query_alerts?id=' + agentId, true);
  req.send();
};

alertRefresh.onclick = getAlerts;

getAlerts();

$(function () {
  $('[data-toggle="popover"]').popover();
});