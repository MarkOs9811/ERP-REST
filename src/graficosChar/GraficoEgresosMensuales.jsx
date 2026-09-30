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
import {
  darkenColor,
  getThemeColors,
  hexToRgb,
  toRgba,
} from "../utils/ThemeColors";
import { WalletCards } from "lucide-react";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function GraficoEgresosMensuales() {
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
        backgroundColor: toRgba(hexToRgb(colors.saffron), 0.72),
        borderColor: darkenColor(colors.saffron, 0.24),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="mb-4 d-flex gap-3 align-items-center">
        <span
          className="rounded-circle p-2 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "var(--bg-saffron-soft)",
            color: "var(--fw-saffron)",
            minWidth: "48px",
            minHeight: "48px",
          }}
        >
          <WalletCards size={24} />
        </span>
        <div className="d-flex flex-column flex-grow-1">
          <span
            className="fw-bold"
            style={{ color: "var(--text-main)", fontSize: "1.1rem" }}
          >
            Egresos Mensuales
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Cuentas por pagar acumuladas por periodo
          </span>
        </div>
      </div>

      <div style={{ width: "100%", minHeight: "290px", flexGrow: 1 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default GraficoEgresosMensuales;
