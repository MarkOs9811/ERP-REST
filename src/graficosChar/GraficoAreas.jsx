import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const COLORS = [
  "#23cc77",
  "#ee5252",
  "#5a7a98",
  "#7ab0e0",
  "#d4f4ff",
  "#1d2530",
  "#00bcd4",
];

export function GraficoAreas({ labels, data }) {
  // Estado para controlar el filtro actual
  const [areaSeleccionada, setAreaSeleccionada] = useState("Todas");

  // Filtramos la data y las etiquetas según lo seleccionado en el input
  const filteredData = useMemo(() => {
    if (areaSeleccionada === "Todas") {
      return {
        labels: labels,
        data: data,
        colors: labels.map((_, i) => COLORS[i % COLORS.length]),
      };
    }

    // Si hay un área seleccionada, buscamos su índice para extraer solo esa data
    const index = labels.indexOf(areaSeleccionada);
    return {
      labels: [labels[index]],
      data: [data[index]],
      colors: [COLORS[index % COLORS.length]], // Mantenemos el color original
    };
  }, [labels, data, areaSeleccionada]);

  const chartData = useMemo(
    () => ({
      labels: filteredData.labels,
      datasets: [
        {
          label: "Empleados",
          data: filteredData.data,
          backgroundColor: filteredData.colors,
          borderRadius: 8,
          borderWidth: 0,
          maxBarThickness: 80, // Un poco más ancha por si filtramos una sola
        },
      ],
    }),
    [filteredData],
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.raw} trabajadores`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        grace: "15%",
      },
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  const dataLabelsPlugin = useMemo(
    () => [
      {
        id: "dataLabelsPlugin",
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          const dataset = chart.data.datasets[0];
          const meta = chart.getDatasetMeta(0);

          meta.data.forEach((bar, index) => {
            const value = dataset.data[index];
            if (value > 0) {
              ctx.save();
              ctx.fillStyle = "#1d2530";
              ctx.font = "bold 14px sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "bottom";
              ctx.fillText(value, bar.x, bar.y - 6);
              ctx.restore();
            }
          });
        },
      },
    ],
    [],
  );

  const minWidthStyle =
    filteredData.labels.length > 6
      ? `${filteredData.labels.length * 80}px`
      : "100%";

  return (
    <div className="w-100 d-flex flex-column h-100">
      {/* Contenedor del InputSelect alineado a la derecha */}
      <div className="d-flex justify-content-end m-3">
        <select
          className="form-select form-select-sm shadow-none"
          style={{ width: "auto", minWidth: "150px" }}
          value={areaSeleccionada}
          onChange={(e) => setAreaSeleccionada(e.target.value)}
        >
          <option value="Todas">Todas las áreas</option>
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Contenedor del Gráfico */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "280px", // Ajusté un pelín la altura para que encaje con el select arriba
          overflowX: "auto",
          overflowY: "hidden",
        }}
        className="d-flex align-items-center justify-content-center p-4"
      >
        <div style={{ minWidth: minWidthStyle, height: "100%" }}>
          <Bar data={chartData} options={options} plugins={dataLabelsPlugin} />
        </div>
      </div>
    </div>
  );
}
