import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export function GraficoAsistenciasMensual({ datosPorMes }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Procesar los datos para el gráfico
    const meses = Object.keys(datosPorMes); // Obtener los nombres de los meses
    const dataAtrasos = meses.map((mes) => datosPorMes[mes]["Tardanza"] || 0); // Datos de tardanza
    const dataATiempo = meses.map((mes) => datosPorMes[mes]["A tiempo"] || 0); // Datos de a tiempo

    const data = {
      labels: meses, // Etiquetas de los meses
      datasets: [
        {
          label: "A tiempo",
          data: dataATiempo,
          backgroundColor: "#0BE663",
          borderRadius: 10,
        },
        {
          label: "Tardanza",
          data: dataAtrasos,
          backgroundColor: "#ED3232",
          borderRadius: 10,
        },
      ],
    };

    setChartData(data);
  }, [datosPorMes]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Asistencias Mensuales",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
}
