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
import { CalendarDays, Store } from "lucide-react";

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
  const totalVentas = Number(
    listVentas.reduce(
      (acc, venta) => acc + Number(venta.totalVenta || venta.total || 0),
      0
    )
  );

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
          backgroundColor: "rgba(75, 126, 192, 0.6)",
          borderColor: "rgba(75, 112, 192, 1)",
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
        display: false,
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

  return (
    <div>
      <div className="mb-3 d-flex gap-2 align-middle justify-content-left">
        <span className="alert border-0 alert-primary text-primary p-2 mb-0">
          <Store size={25} className="text-auto" />
        </span>
        <h6 className="mb-1 d-flex flex-column gap-1">
          <span className="fw-bold">Ventas por mes</span>
          <p className="text-muted small mb-0">
            Ventas totales agrupadas por mes en el año actual.
          </p>
        </h6>
        <div className="ms-auto d-flex justify-content-center align-items-center border rounded">
          <div className="d-flex flex-column text-center badge bg-light p-3 align-items-center justify-content-center ">
            <small className="text-dark">Total ventas</small>
            <p className="mb-0 fw-bold text-dark">
              S/. {totalVentas.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default GraficoBarVentas;
