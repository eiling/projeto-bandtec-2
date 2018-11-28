const agentId = document.getElementById('agent-id-field').innerText;

let lastTimestamp = 0;

setInterval(() => {
  let req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState === 4 && req.status === 200) {
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
          } else {
            const e = document.getElementById('processor-icon');
            e.classList.remove('col-red');
            e.classList.add('col-blue');
          }
        }
        if (data.memory) {
          const a = data.memory.available;
          const t = data.memory.total;
          document.getElementById('memory-box').innerText = parseFloat(100 - (a * 100 / t)).toFixed(1) + '%';
          document.getElementById('memory-popover')
              .setAttribute('data-content', formatBytes(a) + ' (disponível) / ' + formatBytes(t) + ' (total)');

          if (alerts.memory) {
            const e = document.getElementById('memory-icon');
            e.classList.remove('col-blue');
            e.classList.add('col-red');
          } else {
            const e = document.getElementById('memory-icon');
            e.classList.remove('col-red');
            e.classList.add('col-blue');
          }
        }
        if (data.fileStores) {
          let i = 0;
          for (const partition of data.fileStores) {
            const a = partition.usableSpace;
            const t = partition.totalSpace;
            document.getElementById(`partition-${i}-box`).innerText =
                parseFloat(100 - (a * 100 / t)).toFixed(1) + '%';
            document.getElementById(`partition-${i++}-popover`)
                .setAttribute('data-content', formatBytes(a) + ' (disponível) / ' + formatBytes(t) + ' (total)');
          }

          if (alerts.disk) {
            const e = document.getElementById('disk-icon');
            e.classList.remove('col-blue');
            e.classList.add('col-red');
          } else {
            const e = document.getElementById('disk-icon');
            e.classList.remove('col-red');
            e.classList.add('col-blue');
          }
        }
      }
    }
  };

  req.open('GET', '/ajax/query_data?id=' + agentId, true);
  req.send();
}, 1000);

$(function () {
  $('[data-toggle="popover"]').popover();
});
