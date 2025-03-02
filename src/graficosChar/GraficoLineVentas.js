import React, { useEffect, useState, useRef } from "react";
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

const GraficoLineaEjemplo = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [smooth, setSmooth] = useState(false);

  useEffect(() => {
    const fetchAndProcessVentas = async () => {
      const result = await getVentas();
      if (result.success) {
        const ventas = result.data;
        const ventasPorMes = procesarVentas(ventas);
        const data = generarDatosGrafico(ventasPorMes);
        setChartData(data);
      } else {
        console.error("Error:", result.message);
      }
    };

    fetchAndProcessVentas();
  }, []);

  // Función para analizar la fecha de venta
  const parseLocalDate = (fechaVenta) => {
    // Crear un objeto Date a partir de la cadena de fecha
    const fecha = new Date(fechaVenta);
    // Ajustar la fecha si es necesario para evitar desfases
    // Por ejemplo, si las fechas están en UTC y deseas que se interpreten en la zona horaria local
    // puedes ajustar la fecha aquí según tus necesidades
    return fecha;
  };

  const procesarVentas = (ventas) => {
    const ventasPorMes = {
      actual: Array(31).fill(0),
      pasado: Array(31).fill(0),
    };

    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const mesPasado = mesActual === 0 ? 11 : mesActual - 1;
    const añoActual = hoy.getFullYear();
    const añoPasado = mesActual === 0 ? añoActual - 1 : añoActual;

    ventas.forEach((venta) => {
      const fecha = parseLocalDate(venta.fechaVenta);
      const dia = fecha.getDate(); // Restamos 1 para usar como índice (0-30)
      if (fecha.getFullYear() === añoActual && fecha.getMonth() === mesActual) {
        ventasPorMes.actual[dia] += venta.total;
      } else if (
        fecha.getFullYear() === añoPasado &&
        fecha.getMonth() === mesPasado
      ) {
        ventasPorMes.pasado[dia] += venta.total;
      }
    });

    return ventasPorMes;
  };

  const generarDatosGrafico = (ventasPorMes) => {
    const dias = Array.from({ length: 31 }, (_, i) => i + 1);

    return {
      labels: dias,
      datasets: [
        {
          label: "Ventas Mes Actual S/.",
          data: ventasPorMes.actual,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
        {
          label: "Ventas Mes Pasado",
          data: ventasPorMes.pasado,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      filler: {
        propagate: false,
      },
      title: {
        display: true,
        text: "Ventas Mensuales",
      },
    },
    pointBackgroundColor: "#fff",
    radius: 5,
    interaction: {
      intersect: false,
    },
    elements: {
      line: {
        tension: !smooth ? 0.4 : 0,
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <h3 className="text-primary">Durante el Mes</h3>
      {chartData ? (
        <Line ref={chartRef} data={chartData} options={options} />
      ) : (
        <Cargando />
      )}
      <div className="mt-3"></div>
    </div>
  );
};

export default GraficoLineaEjemplo;
