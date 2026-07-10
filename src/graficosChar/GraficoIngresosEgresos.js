import React, { useEffect, useState } from "react";
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
import {
  darkenColor,
  getThemeColors,
  hexToRgb,
  toRgba,
} from "../utils/ThemeColors";
import { CalendarDays } from "lucide-react";

// Registrar componentes de Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export function GraficoIngresosEgresos() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colors = getThemeColors();
  const colorIngresos = colors.bgEmeraldSoft || colors.emerald;
  const colorEgresos = colors.strawberry;

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-theme"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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
        backgroundColor: toRgba(hexToRgb(colorIngresos), 0.85),
        borderColor: darkenColor(colorIngresos, 0.36),
        borderWidth: 2,
      },
      {
        label: "Egresos",
        data: egresos,
        backgroundColor: toRgba(hexToRgb(colorEgresos), 0.7),
        borderColor: darkenColor(colorEgresos, 0.24),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkMode ? "#9CA3AF" : "#6B7280",
          font: { family: "'Inter', sans-serif", weight: "500" },
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#111213" : "#FFFFFF",
        titleColor: isDarkMode ? "#FFFFFF" : "#111213",
        bodyColor: isDarkMode ? "#E5E7EB" : "#4B5563",
        borderColor: isDarkMode ? "#313A46" : "#E5E7EB",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDarkMode ? "#9CA3AF" : "#6B7280",
          font: { family: "'Inter', sans-serif" },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? "#9CA3AF" : "#6B7280",
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
          <CalendarDays size={24} />
        </span>

        <div className="d-flex flex-column flex-grow-1">
          <span
            className="fw-bold"
            style={{ color: "var(--text-main)", fontSize: "1.1rem" }}
          >
            Tendencia Financiera
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Comparativa mensual: Ingresos vs. Egresos
          </span>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          minHeight: "300px",
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
