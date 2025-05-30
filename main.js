function actualizarGrafico(temp, pres, comp) {
  const hora = new Date().toLocaleTimeString();

  // Codificamos composición como número
  const valorComposicion = comp.includes("Etanol") ? 1 : 0;

  datosChart.labels.push(hora);
  datosChart.datasets[0].data.push(parseFloat(temp));
  datosChart.datasets[1].data.push(parseInt(pres));
  datosChart.datasets[2].data.push(valorComposicion);

  if (datosChart.labels.length > tiempoMaxPuntos) {
    datosChart.labels.shift();
    datosChart.datasets.forEach(ds => ds.data.shift());
  }

  grafico.update();
}

function leerSensor() {
  const temperatura = (Math.random() * 15).toFixed(2);
  const presion = Math.floor(95000 + Math.random() * 15000);
  const composiciones = [
    "Agua, Malta, Lúpulo, Etanol",
    "Agua, Malta, Lúpulo",
    "Agua, Malta, Etanol",
    "Agua, Malta, Levadura, Etanol"
  ];
  const composicion = composiciones[Math.floor(Math.random() * composiciones.length)];

  mostrarDatos(temperatura, presion, composicion);
  verificarRangos(temperatura, presion, composicion);
  agregarHistorial(temperatura, presion, composicion);

  actualizarGrafico(temperatura, presion, composicion);
}

function mostrarDatos(temp, pres, comp) {
  document.getElementById("temp").textContent = temp;
  document.getElementById("presion").textContent = pres;
  document.getElementById("comp").textContent = comp;
}

const ctx = document.getElementById('graficoTiempoReal').getContext('2d');
const tiempoMaxPuntos = 15;

const datosChart = {
  labels: [],
  datasets: [
    {
      label: "Temperatura (°C)",
      borderColor: "orange",
      backgroundColor: "rgba(255,165,0,0.2)",
      data: [],
      tension: 0.3,
    },
    {
      label: "Presión (Pa)",
      borderColor: "blue",
      backgroundColor: "rgba(0,0,255,0.1)",
      data: [],
      tension: 0.3,
    },
    {
      label: "Composición (int)",
      borderColor: "green",
      backgroundColor: "rgba(0,128,0,0.1)",
      data: [],
      tension: 0.3,
    }
  ]
};

const grafico = new Chart(ctx, {
  type: 'line',
  data: datosChart,
  options: {
    responsive: true,
    animation: false,
    scales: {
      y: {
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

function verificarRangos(temp, pres, comp) {
  let alertas = [];
  const tempMin = parseFloat(document.getElementById("tempMin").value);
  const tempMax = parseFloat(document.getElementById("tempMax").value);
  const presMin = parseInt(document.getElementById("presMin").value);
  const presMax = parseInt(document.getElementById("presMax").value);

  if (temp < tempMin || temp > tempMax) {
    alertas.push(`⚠️ Temperatura fuera de rango: ${temp} °C`);
  }

  if (pres < presMin || pres > presMax) {
    alertas.push(`⚠️ Presión anormal: ${pres} Pa`);
  }

  if (!comp.includes("Etanol")) {
    alertas.push(`⚠️ Composición sin etanol detectada: ${comp}`);
  }

  mostrarAlertas(alertas);
}

function mostrarAlertas(lista) {
  const contenedor = document.getElementById("alertas");
  const estado = document.getElementById("estadoGeneral");
  contenedor.innerHTML = "";

  if (lista.length > 0) {
    estado.style.background = "red";
    lista.forEach(msg => {
      const div = document.createElement("div");
      div.className = "alerta";
      div.textContent = msg;
      contenedor.appendChild(div);
    });
  } else {
    estado.style.background = "green";
  }
}

function agregarHistorial(temp, pres, comp) {
  const tabla = document.querySelector("#historial tbody");
  const fila = document.createElement("tr");
  const hora = new Date().toLocaleTimeString();

  fila.innerHTML = `<td>${hora}</td><td>${temp}</td><td>${pres}</td><td>${comp}</td>`;
  tabla.appendChild(fila);

  if (tabla.rows.length > 20) tabla.deleteRow(0);
}

function exportarExcel() {
  const tabla = document.getElementById("historial");
  const wb = XLSX.utils.table_to_book(tabla, { sheet: "Historial" });
  XLSX.writeFile(wb, "historial_sensor.xlsx");
}

setInterval(leerSensor, 3000);
leerSensor();
