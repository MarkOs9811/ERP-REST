import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { GetInformesFinancieros } from "../service/serviceFinanzas/GetInformesFinancieros";
import { CreditCard } from "lucide-react";

Chart.register(ArcElement, Tooltip, Legend);

export function GraficoCuentasPorCobrar() {
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
        backgroundColor: ["rgb(54, 162, 235)", "rgba(0, 0, 0, 0.1)"],
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
    <div className="w-100 h-100 ms-auto m-auto d-flex flex-column">
      <div className="mb-3 d-flex gap-2 align-middle justify-content-left p-3">
        <span className="alert border-0 alert-primary text-primary p-2 mb-0">
          <CreditCard size={25} />
        </span>
        <h6 className="mb-1 d-flex flex-column gap-1">
          <span className="fw-bold">Ventas al credito</span>
          <p className="text-muted small mb-0">Cuentas por cobrar</p>
        </h6>
      </div>
      <div className="m-auto center">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
