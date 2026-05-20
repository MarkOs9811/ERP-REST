import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { GetInformesFinancieros } from "../service/serviceFinanzas/GetInformesFinancieros";
import { getThemeColors, toRgba } from "../utils/ThemeColors";

// Registrar componentes de Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export function GraficoIngresosEgresos() {
  const colors = getThemeColors();
  const {
    data: dataFinanzas = {},
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

  // Asegúrate de que existan los datos
  const datos = dataFinanzas.datosIngresosEgresos || {};
  const labels = datos.labels || [];
  const ingresos = datos.ingresos || [];
  const egresos = datos.egresos || [];

  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: ingresos,
        backgroundColor: toRgba(colors.emerald, 0.3),
        borderColor: colors.emerald,
        borderWidth: 1,
      },
      {
        label: "Egresos",
        data: egresos,
        backgroundColor: toRgba(colors.strawberry, 0.3),
        borderColor: colors.strawberry,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
}
