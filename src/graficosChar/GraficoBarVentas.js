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
import { getVentas } from "../service/ObtenerVentasDetalle"; // Asegúrate que la ruta sea correcta
import { Store } from "lucide-react";

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
  // React Query para obtener todas las ventas
  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // --- NUEVA LÓGICA DE FILTRADO ---

  // 1. Obtener el año actual del sistema
  const currentYear = new Date().getFullYear();

  // 2. Crear una lista que SOLO tenga ventas de este año
  const ventasEsteAnio = useMemo(() => {
    if (!listVentas.length) return [];

    return listVentas.filter((venta) => {
      const fecha = new Date(venta.created_at);
      return fecha.getFullYear() === currentYear; // Condición mágica
    });
  }, [listVentas, currentYear]);

  // 3. Calcular el total (Usamos 'ventasEsteAnio' para que coincida con el gráfico)
  const totalVentas = useMemo(() => {
    return Number(
      ventasEsteAnio.reduce(
        (acc, venta) => acc + Number(venta.totalVenta || venta.total || 0),
        0
      )
    );
  }, [ventasEsteAnio]);

  // 4. Procesar datos para gráfico de barras (Usando 'ventasEsteAnio')
  const chartData = useMemo(() => {
    // Inicializamos array de 12 posiciones en 0
    const monthlyTotals = new Array(12).fill(0);

    ventasEsteAnio.forEach((venta) => {
      const fecha = new Date(venta.created_at);
      const mes = fecha.getMonth(); // 0 = Enero, 11 = Diciembre
      const total = parseFloat(venta.total || venta.totalVenta) || 0;

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
          label: `Ventas ${currentYear} (S/.)`, // Agregué el año al label para claridad
          data: roundedTotals,
          backgroundColor: "rgba(75, 126, 192, 0.6)",
          borderColor: "rgba(75, 112, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [ventasEsteAnio, currentYear]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
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
          <span className="fw-bold">Ventas por mes ({currentYear})</span>
          <p className="text-muted small mb-0">
            Ventas totales agrupadas por mes del año actual.
          </p>
        </h6>
        <div className="ms-auto d-flex justify-content-center align-items-center border rounded">
          <div className="d-flex flex-column text-center badge bg-light p-3 align-items-center justify-content-center ">
            <small className="text-dark">Total ventas {currentYear}</small>
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
