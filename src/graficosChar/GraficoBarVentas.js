import React, { useMemo, useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle"; // Asegúrate que la ruta sea correcta
import { Store } from "lucide-react";

// Registrar módulos necesarios para ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const GraficoBarVentas = () => {
  // 1. Detección de Modo Oscuro (Para adaptar los textos y líneas del gráfico)
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Revisa si el body tiene la clase dark-theme al cargar y si cambia
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-theme"));
    };
    checkDarkMode();

    // Opcional: Si tienes un botón que cambia el tema sin recargar, esto lo escucha.
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // 2. Fetch de Datos
  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // --- LÓGICA DE FILTRADO ---
  const currentYear = new Date().getFullYear();

  const ventasEsteAnio = useMemo(() => {
    if (!listVentas.length) return [];
    return listVentas.filter((venta) => {
      const fecha = new Date(venta.created_at);
      return fecha.getFullYear() === currentYear;
    });
  }, [listVentas, currentYear]);

  const totalVentas = useMemo(() => {
    return Number(
      ventasEsteAnio.reduce(
        (acc, venta) => acc + Number(venta.totalVenta || venta.total || 0),
        0,
      ),
    );
  }, [ventasEsteAnio]);

  // --- PROCESAMIENTO DEL GRÁFICO (Fire Wok Palette) ---
  const chartData = useMemo(() => {
    const monthlyTotals = new Array(12).fill(0);

    ventasEsteAnio.forEach((venta) => {
      const fecha = new Date(venta.created_at);
      const mes = fecha.getMonth();
      const total = parseFloat(venta.total || venta.totalVenta) || 0;
      monthlyTotals[mes] += total;
    });

    const roundedTotals = monthlyTotals.map((total) =>
      parseFloat(total.toFixed(2)),
    );

    return {
      labels: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ], // Abreviados para que no se aplasten en pantallas chicas
      datasets: [
        {
          label: `Ventas ${currentYear} (S/)`,
          data: roundedTotals,
          // Color Emerald de Fire Wok (con opacidad y borde)
          backgroundColor: isDarkMode
            ? "rgba(23, 198, 104, 0.7)"
            : "rgba(23, 198, 104, 0.5)",
          borderColor: "#17C668",
          borderWidth: 2,
          borderRadius: 4, // Bordes redondeados en las barras (diseño moderno)
          hoverBackgroundColor: "#17C668", // Color sólido al hacer hover
        },
      ],
    };
  }, [ventasEsteAnio, currentYear, isDarkMode]);

  // --- OPCIONES DEL GRÁFICO (Adaptativas) ---
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el gráfico ocupe el alto del contenedor
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkMode ? "#9CA3AF" : "#6B7280", // Gris adaptativo
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
        displayColors: false, // Oculta el cuadrito de color en el tooltip
        callbacks: {
          label: function (context) {
            return `Ingresos: S/ ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Ocultar líneas verticales (más limpio)
        },
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
          drawBorder: false, // Quitar la línea gruesa del eje Y
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

  if (isLoading)
    return <p className="text-muted p-3">Cargando gráfico de ventas...</p>;
  if (isError) return <p className="text-danger p-3">Error al cargar datos.</p>;

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
          <Store size={24} />
        </span>

        {/* Títulos */}
        <div className="d-flex flex-column flex-grow-1">
          <span
            className="fw-bold"
            style={{ color: "var(--text-main)", fontSize: "1.1rem" }}
          >
            Ventas por mes ({currentYear})
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Ventas totales agrupadas por mes del año actual.
          </span>
        </div>

        {/* Resumen Total (Caja neutra) */}
        <div
          className="ms-auto d-flex flex-column text-center px-4 py-2 rounded"
          style={{
            backgroundColor: "var(--bg-main)",
            border: "1px solid var(--bg-main)",
          }}
        >
          <small
            style={{
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            TOTAL {currentYear}
          </small>
          <span
            className="fw-bold"
            style={{ color: "var(--fw-emerald)", fontSize: "1.2rem" }}
          >
            S/ {totalVentas.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Contenedor del Gráfico (Altura forzada para que respire) */}
      <div
        style={{
          position: "relative",
          minHeight: "300px",
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GraficoBarVentas;
