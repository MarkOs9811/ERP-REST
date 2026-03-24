import React, { useMemo, useRef } from "react";
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
import { PlatoMasVendido } from "./PlatosMasVendidos";
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
  CategoryScale
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

  const ventasIA = Array.isArray(ventasIAResponse) ? ventasIAResponse : [];

  // Generar etiquetas (últimos 7 días + próximos 7)
  const hoy = new Date();
  const labels = [];
  for (let i = -7; i <= 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    labels.push(fecha.toISOString().split("T")[0]);
  }

  // Procesar Ventas Reales
  const ventasPorFecha = ventas.reduce((acc, venta) => {
    const fecha = new Date(venta.fechaVenta).toISOString().split("T")[0];
    acc[fecha] = (acc[fecha] || 0) + Number(venta.total || 0);
    return acc;
  }, {});
  const dataVentas = labels.map((fecha) => ventasPorFecha[fecha] || 0);

  // Procesar Predicciones IA
  const prediccionesPorFecha = ventasIA.reduce((acc, prediccion) => {
    const fecha = new Date(prediccion.fecha).toISOString().split("T")[0];
    acc[fecha] = Number(prediccion.total) || 0;
    return acc;
  }, {});
  const dataPredicciones = labels.map(
    (fecha) => prediccionesPorFecha[fecha] || 0
  );

  const chartRef = useRef(null);

  // Crear data con degradado dinámico
  const chartData = useMemo(() => {
    const chart = chartRef.current;
    const ctx = chart?.ctx;
    const chartArea = chart?.chartArea;
    if (!ctx || !chartArea) {
      return {
        labels,
        datasets: [
          {
            label: "Ventas Reales",
            data: dataVentas,
            borderColor: "rgba(249, 115, 22, 1)",
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            fill: true,
          },
          {
            label: "Predicción de Ventas (IA)",
            data: dataPredicciones,
            borderColor: "rgba(255, 64, 64, 1)",
            backgroundColor: "rgba(255, 64, 64, 0.2)",
            fill: true,
          },
        ],
      };
    }

    // Crear degradados
    const gradientReales = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );
    gradientReales.addColorStop(0, "rgba(249, 115, 22, 0.5)");
    gradientReales.addColorStop(1, "rgba(249, 115, 22, 0)");

    const gradientIA = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );
    gradientIA.addColorStop(0, "rgba(255, 64, 64, 0.5)");
    gradientIA.addColorStop(1, "rgba(255, 159, 64, 0)");

    return {
      labels,
      datasets: [
        {
          label: "Ventas Reales",
          data: dataVentas,
          borderColor: "rgba(249, 115, 22, 1)",
          backgroundColor: gradientReales,
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: "rgba(249, 115, 22, 1)",
          pointBorderColor: "#fff",
        },
        {
          label: "Predicción de Ventas (IA)",
          data: dataPredicciones,
          borderColor: "rgba(255, 64, 64, 1)",
          backgroundColor: gradientIA,
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
        ticks: {
          color: "#666",
          font: { size: 12 },
        },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: "Total Ventas (S/)",
          color: "#666",
          font: { size: 14, weight: "bold" },
        },
        ticks: {
          color: "#666",
          font: { size: 12 },
        },
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
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
    <div className="w-100">
      <CondicionCarga isLoading={isLoadingVentasIA} isError={isErrorVentasIA}>
        <div className="h-100">
          <div className="d-flex gap-2 align-middle justify-content-left p-3 border-bottom card-header bg-light">
            <span
              className="p-2 mb-0 rounded-circle"
              style={{ backgroundColor: "#e2e8f0", color: "#475569" }}
            >
              <ChartNoAxesCombined size={25} />
            </span>
            <h6 className="mb-1 d-flex flex-column gap-1">
              <span className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>
                Ventas Históricas y Predicciones
              </span>
              <p className="text-muted small mb-0">
                Últimos 7 días y pronóstico
              </p>
            </h6>
          </div>

          <div className="p-3">
              <div className="" style={{ height: "300px" }}>
                {hasError ? (
                  <p className="text-danger text-center">
                    Error al cargar los datos del gráfico.
                  </p>
                ) : !dataReady ? (
                  <p className="text-muted text-center">
                    Cargando datos del gráfico...
                  </p>
                ) : (
                  <Line ref={chartRef} data={chartData} options={options} />
                )}
              </div>
            </div>
        </div>
      </CondicionCarga>
    </div>
  );
}
