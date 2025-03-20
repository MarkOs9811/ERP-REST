import React, { useMemo, useEffect } from "react";
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

// Registrar los módulos necesarios para ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficoBarVentas = () => {
  // React Query para obtener las ventas
  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // Procesar datos para el gráfico
  const chartData = useMemo(() => {
    if (!listVentas.length) return { labels: [], datasets: [] };

    const monthlyTotals = new Array(12).fill(0);

    listVentas.forEach((venta) => {
      const month = new Date(venta.fechaVenta).getMonth();
      monthlyTotals[month] += venta.total;
    });

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
          label: "Ventas",
          data: monthlyTotals,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [listVentas]);

  // Configuración de opciones del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ventas mensuales",
      },
    },
  };

  // Mostrar mensaje mientras se obtienen los datos
  if (isLoading) return <p>Cargando gráfico...</p>;

  return <Bar data={chartData} options={options} />;
};

export default GraficoBarVentas;
