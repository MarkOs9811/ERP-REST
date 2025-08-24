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
  const [smooth, setSmooth] = useState(true); // Cambia a true para curvas suaves

  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // Procesar ventas del día actual por hora
  function procesarVentasHoy(ventas) {
    const ventasPorHora = Array(24).fill(0);
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split("T")[0];

    ventas.forEach((venta) => {
      if (!venta.created_at) return;

      const fecha = new Date(venta.created_at.replace(" ", "T"));
      const fechaVenta = fecha.toISOString().split("T")[0];

      if (fechaVenta === fechaHoy) {
        const hora = fecha.getHours();
        ventasPorHora[hora] += parseFloat(venta.total) || 0;
      }
    });

    return ventasPorHora.map((v) => parseFloat(v.toFixed(2)));
  }

  const chartData = useMemo(() => {
    const ventasHoy = procesarVentasHoy(listVentas);
    return generarDatosGrafico(ventasHoy);
  }, [listVentas]);

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
          tension: 0.4, // Valor alto para curvas más suaves
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Ventas por Hora (Hoy)",
      },
      legend: {
        position: "top",
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.1)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  if (isLoading) return <Cargando />;
  if (isError) return <p>Error al cargar datos</p>;

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default GraficoLineaDayVentas;
