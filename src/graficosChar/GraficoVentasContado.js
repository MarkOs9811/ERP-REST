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
import { getThemeColors, hexToRgb, toRgba } from "../utils/ThemeColors";
import { useRef } from "react";

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
    gradient.addColorStop(0, toRgba(colors.emerald, 0.25));
    gradient.addColorStop(0.3, toRgba(colors.emerald, 0.01));
    return gradient;
  };

  // Configuración de datos y degradado
  const data = {
    labels,
    datasets: [
      {
        label: "Ventas por Mes",
        data: dataVentas,
        borderColor: colors.emerald,
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
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}

export default GraficoVentasContado;
