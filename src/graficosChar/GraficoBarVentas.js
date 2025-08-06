import React, { useMemo } from "react";
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
import { getVentas } from "../service/ObtenerVentasDetalle";

// Registrar módulos necesarios para ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficoBarVentas = () => {
  // React Query para obtener ventas
  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // Procesar datos para gráfico de barras
  const chartData = useMemo(() => {
    if (!listVentas.length) return { labels: [], datasets: [] };

    const monthlyTotals = new Array(12).fill(0);

    listVentas.forEach((venta) => {
      const fecha = new Date(venta.created_at);
      const mes = fecha.getMonth(); // 0 = Enero
      const total = parseFloat(venta.total) || 0;
      monthlyTotals[mes] += total;
    });

    // Redondear a 2 decimales
    const roundedTotals = monthlyTotals.map((total) =>
      parseFloat(total.toFixed(2))
    );

    return {
      labels: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      datasets: [
        {
          label: "Ventas por Mes (S/.)",
          data: roundedTotals,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [listVentas]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ventas Mensuales",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `S/. ${value}`;
          },
        },
      },
    },
  };

  if (isLoading) return <p>Cargando gráfico...</p>;
  if (isError) return <p>Error al cargar datos.</p>;

  return <Bar data={chartData} options={options} />;
};

export default GraficoBarVentas;
