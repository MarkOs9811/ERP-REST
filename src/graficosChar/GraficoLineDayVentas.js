import React, { useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { Cargando } from "../components/componentesReutilizables/Cargando";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GraficoLineaDayVentas = () => {
  const chartRef = useRef(null);
  const [smooth, setSmooth] = useState(false);

  // Obtener datos con React Query
  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // Función para obtener la fecha de la venta correctamente
  function parseLocalDate(fechaVenta) {
    if (!fechaVenta) return new Date();
    return new Date(fechaVenta.replace(" ", "T"));
  }

  // Procesar ventas del día
  function procesarVentasHoy(ventas) {
    const ventasPorHora = Array(24).fill(0);
    const fechaHoy = new Date().toISOString().split("T")[0];

    ventas.forEach((venta) => {
      const fechaVenta = venta.fechaVenta.split(" ")[0];
      if (fechaVenta === fechaHoy) {
        const fecha = parseLocalDate(venta.create_at);
        const hora = fecha.getHours();
        ventasPorHora[hora] += parseFloat(venta.total) || 0;
      }
    });

    return ventasPorHora.map((venta) => parseFloat(venta.toFixed(2)));
  }

  // Procesar datos para el gráfico
  const chartData = useMemo(() => {
    const ventasHoy = listVentas.length
      ? procesarVentasHoy(listVentas)
      : Array(24).fill(0);
    return generarDatosGrafico(ventasHoy);
  }, [listVentas]);

  // Generar datos para el gráfico
  function generarDatosGrafico(ventasPorHora) {
    const horas = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    return {
      labels: horas,
      datasets: [
        {
          label: "Ventas de Hoy S/.",
          data: ventasPorHora,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
      ],
    };
  }

  // Configuración del gráfico
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Ventas por Hora (Hoy)",
      },
    },
    interaction: { intersect: false },
    elements: {
      line: { tension: smooth ? 0 : 0.4 },
    },
    scales: {
      y: { grid: { color: "rgba(0, 0, 0, 0.1)" } },
      x: { grid: { display: false } },
    },
  };

  if (isLoading) return <Cargando />;
  if (isError) return <p>Error al cargar datos</p>;

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      {chartData ? (
        <Line ref={chartRef} data={chartData} options={options} />
      ) : (
        <Cargando />
      )}
    </div>
  );
};

export default GraficoLineaDayVentas;
