let dom = document.getElementById("containergraph");
let myChart = echarts.init(dom, null, {
  renderer: "canvas",
  useDirtyRect: false,
});
let app = {};

let option;

// Definir arrays vacíos para los datos dinámicos
let date = [];
let data = [];
fetch('http://localhost:3000/facturacion/ingresos/resumen-ingresos/api/chart/')
  .then(response => response.json())
  .then(responseData => {
    const promedioSpan = document.getElementById('Promedio');
    const TotalSpan = document.getElementById('Total');
    const mayorVenta = document.getElementById('MayorVenta');
    const VentaMenor = document.getElementById('MenorVenta');

    // Extraer fechas y valores del backend
    date = responseData.map(item => item.Fecha_ingreso);
    data = responseData.map(item => item.Monto);
    
    let lista = [];
    let suma = 0;
    responseData.forEach(element => {
        lista.push(element.Monto);

    });
    for(let i = 0; i < lista.length; i++){
        let numero = lista[i];
        suma += numero;
    }
    const promedio = suma / lista.length;

    promedioSpan.innerHTML = `  ${promedio}$`;
    TotalSpan.innerHTML = ` ${suma}$`;

    const mayorSuma = lista.sort((a,b) => b - a);
    mayorVenta.innerHTML = `  ${mayorSuma[0]}$`;
    
    const SumaMenor = lista.sort((a, b) => a - b);
    VentaMenor.innerHTML = `${SumaMenor[0]}$`
    // Actualizar el gráfico con los datos obtenidos
    myChart.setOption({
      xAxis: {
        data: date // ✅ Fechas dinámicas
      },
      series: [
        {
          data: data // ✅ Valores dinámicos
        }
      ]
    });
  })
  .catch(error => console.log('Error al obtener datos:', error));

option = {
  tooltip: {
    trigger: "axis", // Muestra datos al pasar el mouse por los ejes
    formatter: function (params) {
      let tooltipData = params[0];
      return `
        Fecha: ${tooltipData.axisValue} <br/>
        Cantidad: ${tooltipData.data}$
      `;
    },
  },
  title: {
    left: "center",
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: "none",
      },
      restore: {},
      saveAsImage: {},
    },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: date, // ✅ Se actualizará dinámicamente
  },
  yAxis: {
    type: "value",
    boundaryGap: [0, "10%"], // Ajusta la escala del eje Y
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 100,
    },
    {
      start: 0,
      end: 100,
    },
  ],
  series: [
    {
      name: "Valores Reales",
      type: "line",
      symbol: "circle", // Símbolos en los puntos de datos
      symbolSize: 6, // Tamaño del símbolo
      sampling: "lttb",
      itemStyle: {
        color: "rgba(250, 70, 131, 0.8)",
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(0, 255, 255, 1)",
          },
          {
            offset: 1,
            color: "rgba(251, 20, 97, 1)",
          },
        ]),
      },
      data: data, // ✅ Se actualizará dinámicamente
    },
  ],
};

if (option && typeof option === "object") {
  myChart.setOption(option);
}

window.addEventListener("resize", myChart.resize);
