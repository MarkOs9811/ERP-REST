import React, { useRef, useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { Cargando } from "../components/componentesReutilizables/Cargando";
import { CalendarDays } from "lucide-react";

// Registrar módulos necesarios para ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const GraficoBarEjemplo = () => {
  const chartRef = useRef(null);

  // 1. Detección de Modo Oscuro para adaptar el gráfico
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    data: ventas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // --- LÓGICA DE PROCESAMIENTO (Optimizada con useMemo) ---
  const ventasProcesadas = useMemo(() => {
    if (!ventas || !Array.isArray(ventas)) return null;

    const getDiasDelMes = (año, mes) => new Date(año, mes + 1, 0).getDate();

    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();
    const mesPasado = mesActual === 0 ? 11 : mesActual - 1;
    const añoPasado = mesActual === 0 ? añoActual - 1 : añoActual;

    const diasMesActual = getDiasDelMes(añoActual, mesActual);
    const diasMesPasado = getDiasDelMes(añoPasado, mesPasado);

    const ventasPorMes = {
      actual: Array(diasMesActual).fill(0),
      pasado: Array(diasMesPasado).fill(0),
      maxDias: Math.max(diasMesActual, diasMesPasado),
    };

    ventas.forEach((venta) => {
      if (!venta.fechaVenta && !venta.created_at) return;

      const fechaStr = venta.fechaVenta || venta.created_at;
      const [anio, mes, dia] = fechaStr.split("T")[0].split("-").map(Number);

      // Mes Actual
      if (anio === añoActual && mes === mesActual + 1) {
        if (dia >= 1 && dia <= diasMesActual) {
          ventasPorMes.actual[dia - 1] += Number(venta.total || 0);
        }
      }
      // Mes Pasado
      else if (anio === añoPasado && mes === mesPasado + 1) {
        if (dia >= 1 && dia <= diasMesPasado) {
          ventasPorMes.pasado[dia - 1] += Number(venta.total || 0);
        }
      }
    });

    // Redondear a 2 decimales para evitar números largos en el tooltip
    ventasPorMes.actual = ventasPorMes.actual.map((v) =>
      parseFloat(v.toFixed(2)),
    );
    ventasPorMes.pasado = ventasPorMes.pasado.map((v) =>
      parseFloat(v.toFixed(2)),
    );

    return ventasPorMes;
  }, [ventas]);

  if (isLoading) return <Cargando />;
  if (isError) return <p className="text-danger p-3">Error al cargar datos.</p>;
  if (!ventasProcesadas)
    return <p className="text-muted p-3">No hay datos disponibles.</p>;

  // --- CONFIGURACIÓN DEL GRÁFICO (Fire Wok Palette) ---
  const datosGrafico = {
    labels: Array.from({ length: ventasProcesadas.maxDias }, (_, i) => i + 1),
    datasets: [
      {
        label: "Mes Actual (S/)",
        data: ventasProcesadas.actual,
        // Emerald
        backgroundColor: isDarkMode
          ? "rgba(23, 198, 104, 0.7)"
          : "rgba(23, 198, 104, 0.5)",
        borderColor: "#17C668",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "#17C668",
      },
      {
        label: "Mes Pasado (S/)",
        data: ventasProcesadas.pasado,
        // Deep Saffron (con un poco más de transparencia para que sea secundario)
        backgroundColor: isDarkMode
          ? "rgba(255, 153, 44, 0.4)"
          : "rgba(255, 153, 44, 0.3)",
        borderColor: "#FF992C",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "#FF992C",
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
          font: { family: "'Inter', sans-serif" },
          callback: function (value) {
            return `S/ ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Cabecera Limpia (Estilo Fire Wok) */}
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
            Tendencia Mensual
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Comparativa diaria: Mes actual vs. Mes anterior
          </span>
        </div>
      </div>

      {/* Contenedor del Gráfico */}
      <div
        style={{
          position: "relative",
          minHeight: "300px",
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Bar ref={chartRef} data={datosGrafico} options={options} />
      </div>
    </div>
  );
};

export default GraficoBarEjemplo;
