import { Bar } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
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

export function GraficoEstadoAsistencia({ asistenciaHoy }) {
  const canvasRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  const asistenciaLabels = ["A Tiempo", "Tardanza"];
  const asistenciaDataMap = {
    "a tiempo": 0,
    tardanza: 0,
  };
  console.log(asistenciaHoy);
  asistenciaHoy.forEach((item) => {
    asistenciaDataMap[item.estadoAsistencia] = item.count;
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    // Crear gradientes suaves
    const greenGradient = ctx.createLinearGradient(0, 0, 0, 300);
    greenGradient.addColorStop(0, "#0BE663");
    greenGradient.addColorStop(1, "#069150");

    const redGradient = ctx.createLinearGradient(0, 0, 0, 300);
    redGradient.addColorStop(0, "#ED3232");
    redGradient.addColorStop(1, "#FA6E73");

    const data = {
      labels: asistenciaLabels,
      datasets: [
        {
          label: "Cantidad de empleados",
          data: [asistenciaDataMap["a tiempo"], asistenciaDataMap["tardanza"]],
          backgroundColor: [greenGradient, redGradient],
          borderRadius: 10,
        },
      ],
    };

    setChartData(data);
  }, [asistenciaHoy]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Asistencias de Hoy",
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
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
}
