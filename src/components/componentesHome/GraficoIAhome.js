import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GetVentasIA } from "../../service/serviceIA/GetVentasIA";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { ChartNoAxesCombined } from "lucide-react";

// Registrar los componentes de Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
);

export function GraficoIAhome() {
  const {
    data: ventas = [],
    isLoading: isLoadingVentas,
    isError: isErrorVentas,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: ventasIAResponse = [],
    isLoading: isLoadingVentasIA,
    isError: isErrorVentasIA,
  } = useQuery({
    queryKey: ["ventasIA"],
    queryFn: GetVentasIA,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Extraemos la propiedad 'data' que envía Laravel
  const ventasIA =
    ventasIAResponse?.data ||
    (Array.isArray(ventasIAResponse) ? ventasIAResponse : []);

  // Generar etiquetas (últimos 7 días + próximos 7)
  const hoy = new Date();
  const labels = [];
  for (let i = -7; i <= 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    labels.push(fecha.toISOString().split("T")[0]);
  }

  const fechaHoyStr = hoy.toISOString().split("T")[0];

  // Procesar Ventas Reales
  const ventasPorFecha = ventas.reduce((acc, venta) => {
    const fecha = new Date(venta.fechaVenta).toISOString().split("T")[0];
    acc[fecha] = (acc[fecha] || 0) + Number(venta.total || 0);
    return acc;
  }, {});

  // 👉 CORRECCIÓN: Si es una fecha futura, devolvemos null para que se corte la línea
  const dataVentas = labels.map((fecha) => {
    if (fecha > fechaHoyStr) return null;
    return ventasPorFecha[fecha] || 0;
  });

  // Procesar Predicciones IA
  const prediccionesPorFecha = ventasIA.reduce((acc, prediccion) => {
    const fecha = new Date(prediccion.fecha).toISOString().split("T")[0];
    acc[fecha] = Number(prediccion.total) || 0;
    return acc;
  }, {});

  // Hacemos que la línea roja empiece en el punto de hoy para que conecte con la línea naranja
  if (ventasPorFecha[fechaHoyStr] !== undefined) {
    prediccionesPorFecha[fechaHoyStr] = ventasPorFecha[fechaHoyStr];
  }

  const dataPredicciones = labels.map(
    (fecha) => prediccionesPorFecha[fecha] || null,
  );

  // 👉 LA MAGIA DE LOS DEGRADADOS DINÁMICOS
  const chartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: "Ventas Reales",
          data: dataVentas,
          borderColor: "rgb(24, 172, 73)",
          // Creamos el degradado directamente en el background con una función
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return "rgba(22, 249, 79, 0.2)"; // Color sólido antes del render final
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(0, "rgba(22, 249, 71, 0.5)");
            gradient.addColorStop(1, "rgba(249, 115, 22, 0)");
            return gradient;
          },
          tension: 0.4, // Esto garantiza que SIEMPRE tenga curvas
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: "rgb(34, 190, 81)",
          pointBorderColor: "#fff",
        },
        {
          label: "Predicción de Ventas (IA)",
          data: dataPredicciones,
          borderColor: "rgba(255, 64, 64, 1)",
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return "rgba(255, 64, 64, 0.2)";
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(0, "rgba(255, 64, 64, 0.5)");
            gradient.addColorStop(1, "rgba(255, 159, 64, 0)");
            return gradient;
          },
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: "rgba(255, 64, 64, 1)",
          pointBorderColor: "#fff",
        },
      ],
    };
  }, [dataVentas, dataPredicciones, labels]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#444",
          font: { size: 14, weight: "bold" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        cornerRadius: 5,
        displayColors: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Fecha",
          color: "#666",
          font: { size: 14, weight: "bold" },
        },
        ticks: { color: "#666", font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: "Total Ventas (S/)",
          color: "#666",
          font: { size: 14, weight: "bold" },
        },
        ticks: { color: "#666", font: { size: 12 } },
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.1)" },
      },
    },
  };

  const dataReady =
    !isLoadingVentas &&
    !isLoadingVentasIA &&
    !isErrorVentas &&
    !isErrorVentasIA;
  const hasError = isErrorVentas || isErrorVentasIA;

  return (
    <div className="card w-100 p-0 overflow-auto">
      <CondicionCarga isLoading={isLoadingVentasIA} isError={isErrorVentasIA}>
        <div className="card-header d-flex  m-0 align-middle justify-content-left border-bottom ">
          <span
            className="p-2 mb-0 rounded-circle text-white"
            style={{ background: "var(--fw-strawberry)" }}
          >
            <ChartNoAxesCombined size={25} />
          </span>
          <h6 className="mb-1 d-flex flex-column gap-1 ms-2">
            <span className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>
              Ventas Históricas y Predicciones
            </span>
            <span className="text-muted small mb-0">
              Últimos 7 días y pronóstico
            </span>
          </h6>
        </div>

        <div className="card-body ">
          <div className="" style={{ height: "400px" }}>
            {hasError ? (
              <p className="text-danger text-center">
                Error al cargar los datos del gráfico.
              </p>
            ) : !dataReady ? (
              <p className="text-muted text-center">
                Cargando datos del gráfico...
              </p>
            ) : (
              // Eliminamos el ref que ya no es necesario
              <Line data={chartData} options={options} />
            )}
          </div>
        </div>
      </CondicionCarga>
    </div>
  );
}
