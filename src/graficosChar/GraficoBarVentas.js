import React, { useState, useEffect } from "react";
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

// Registrar los módulos necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficoBarVentas = () => {
  const [listVentas, setListVentas] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const fetchVentas = async () => {
    const result = await getVentas();
    if (result.success) {
      setListVentas(result.data);
    } else {
      console.error("Error:", result.message);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  useEffect(() => {
    if (listVentas.length > 0) {
      // Inicializar un array para los totales mensuales
      const monthlyTotals = new Array(12).fill(0);

      // Sumar las ventas por mes
      listVentas.forEach((venta) => {
        const month = new Date(venta.fechaVenta).getMonth();
        monthlyTotals[month] += venta.total;
      });

      // Actualizar los datos del gráfico
      setChartData({
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
      });
    }
  }, [listVentas]);

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

  return <Bar data={chartData} options={options} />;
};

export default GraficoBarVentas;
