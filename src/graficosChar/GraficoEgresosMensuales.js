import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { GetInformesFinancieros } from "../service/serviceFinanzas/GetInformesFinancieros";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function GraficoEgresosMensuales() {
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

  // Suponiendo que tu backend retorna datosCuentasPorPagar: { labels: [...], data: [...] }
  const datosCuentasPorPagar = dataInformes.datosCuentasPorPagar || {};
  const labels = datosCuentasPorPagar.labels || [];
  const dataEgresos = datosCuentasPorPagar.data || [];

  const data = {
    labels,
    datasets: [
      {
        label: "Total Cuentas por Pagar",
        data: dataEgresos,
        backgroundColor: "rgba(243, 150, 5, 0.3)",
        borderColor: "#F39605",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default GraficoEgresosMensuales;
