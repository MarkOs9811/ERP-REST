import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { GetInformesFinancieros } from "../service/serviceFinanzas/GetInformesFinancieros";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

export function GraficoPagoEmpleados() {
  const {
    data: dataInformes = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["finanzas"],
    queryFn: GetInformesFinancieros,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError) return <div>Error al cargar datos: {error.message}</div>;

  // Suponiendo que tu backend retorna algo como:
  // dataInformes.datosPagosEmpleados = { labels: [...], montos: [...] }
  const datosPagos = dataInformes.datosPagosEmpleados || {};
  const labels = datosPagos.labels || [];
  const montos = datosPagos.montos || [];

  const data = {
    labels,
    datasets: [
      {
        label: "Monto Pagado",
        data: montos,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "#0971AC",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Meses",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 30,
        },
      },
      y: {
        title: {
          display: true,
          text: "Monto Total",
        },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            return "Mes: " + tooltipItems[0].label;
          },
          label: function (tooltipItem) {
            return "Monto: " + tooltipItem.raw;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
