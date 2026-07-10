import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { GetInformesFinancieros } from "../service/serviceFinanzas/GetInformesFinancieros";
import { getThemeColors, toRgba } from "../utils/ThemeColors";
import { useRef } from "react";
import { ChartLine } from "lucide-react";

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

export function GraficoVentasContado() {
  const chartRef = useRef(null);
  const colors = getThemeColors();
  const colorVentas = colors.bgEmeraldSoft || colors.emerald;

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

  const ventasPorMesData = dataInformes.ventasPorMesData || {};
  const labels = ventasPorMesData.labels || [];
  const dataVentas = ventasPorMesData.data || [];

  // Función para crear el degradado dinámicamente con colores del tema
  const getGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom,
    );
    gradient.addColorStop(0, toRgba(colorVentas, 0.24));
    gradient.addColorStop(0.35, toRgba(colorVentas, 0.02));
    return gradient;
  };

  // Configuración de datos y degradado
  const data = {
    labels,
    datasets: [
      {
        label: "Ventas por Mes",
        data: dataVentas,
        borderColor: colorVentas,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            // Este return es necesario para el primer render
            return null;
          }
          return getGradient(ctx, chartArea);
        },
        fill: true,
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: colors.white,
        pointBorderColor: colorVentas,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "var(--text-muted)",
          font: { family: "'Inter', sans-serif", weight: "500" },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `S/ ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="mb-4 d-flex gap-3 align-items-center">
        <span
          className="rounded-circle p-2 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "var(--bg-emerald-soft)",
            color: "var(--fw-emerald)",
            minWidth: "48px",
            minHeight: "48px",
          }}
        >
          <ChartLine size={24} />
        </span>
        <div className="d-flex flex-column flex-grow-1">
          <span
            className="fw-bold"
            style={{ color: "var(--text-main)", fontSize: "1.1rem" }}
          >
            Ventas al Contado
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Evolución mensual de ventas directas
          </span>
        </div>
      </div>

      <div style={{ width: "100%", minHeight: "290px", flexGrow: 1 }}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}

export default GraficoVentasContado;
