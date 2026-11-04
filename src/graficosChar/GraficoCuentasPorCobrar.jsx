import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { GetInformesFinancieros } from "../service/serviceFinanzas/GetInformesFinancieros";
import { CreditCard } from "lucide-react";
import { getThemeColors, hexToRgb, toRgba } from "../utils/ThemeColors";

Chart.register(ArcElement, Tooltip, Legend);

export function GraficoCuentasPorCobrar() {
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

  // Asegúrate de que los datos existen y son números
  const totalCuentasPorCobrar = parseFloat(dataInformes.totalPrestamos || 0);
  const montoPagado = parseFloat(dataInformes.montoPagado || 0);
  const montoRestante = Math.max(totalCuentasPorCobrar - montoPagado, 0);

  const data = {
    labels: ["Monto Pagado", "Monto Restante"],
    datasets: [
      {
        data: [montoPagado, montoRestante],
        backgroundColor: [
          colors.bgEmeraldSoft || colors.emerald,
          toRgba(hexToRgb(colors.saffron), 0.25),
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return (
              context.label +
              ": " +
              context.raw.toLocaleString("es-PE", {
                style: "currency",
                currency: "PEN",
              })
            );
          },
        },
      },
      legend: {
        display: true,
      },
    },
    cutout: "80%",
    rotation: -90,
    circumference: 180,
  };

  return (
    <div className="w-full h-full m-auto flex flex-col">
      <div className="mb-4 flex gap-3 items-center">
        <span
          className="rounded-full p-2 flex justify-center items-center"
          style={{
            backgroundColor: "var(--bg-emerald-soft)",
            color: "var(--fw-emerald)",
            minWidth: "48px",
            minHeight: "48px",
          }}
        >
          <CreditCard size={25} />
        </span>
        <div className="flex flex-col grow">
          <span
            className="font-bold"
            style={{ color: "var(--text-main)", fontSize: "1.1rem" }}
          >
            Ventas al crédito
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Avance de cobranza y saldo pendiente
          </span>
        </div>
      </div>
      <div
        className="m-auto center"
        style={{ width: "100%", minHeight: "190px" }}
      >
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
