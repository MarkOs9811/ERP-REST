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

const GraficoLineaDayVentas = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [smooth, setSmooth] = useState(false);

  useEffect(() => {
    const fetchAndProcessVentas = async () => {
      const result = await getVentas();
      if (result.success) {
        const ventas = result.data;
        const ventasHoy = procesarVentasHoy(ventas);
        const data = generarDatosGrafico(ventasHoy);
        setChartData(data);
      } else {
        console.error("Error:", result.message);
      }
    };

    fetchAndProcessVentas();
  }, []);

  // Función para analizar la fecha de venta y obtener la hora y minutos
  const parseLocalDate = (fechaVenta) => {
    if (!fechaVenta) {
      console.error("Fecha de venta no válida:", fechaVenta);
      return new Date(); // Retorna la fecha actual si no es válida
    }

    // Reemplazar espacio por "T" para que el formato sea ISO y válido
    const fechaIso = fechaVenta.replace(" ", "T");
    const fecha = new Date(fechaIso);
    return fecha;
  };

  const procesarVentasHoy = (ventas) => {
    const ventasPorHora = Array(24).fill(0); // Array de 24 horas (0-23)

    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split("T")[0]; // Formato YYYY-MM-DD

    ventas.forEach((venta) => {
      // Obtener la fecha de la venta a partir del campo fechaVenta
      const fechaVenta = venta.fechaVenta.split(" ")[0]; // Extraemos la fecha (YYYY-MM-DD)

      // Solo procesamos las ventas que corresponden a hoy
      if (fechaVenta === fechaHoy) {
        const fecha = parseLocalDate(venta.create_at); // Usamos create_at para la hora
        const hora = fecha.getHours(); // Obtener la hora de la venta (0-23)

        // Asegurarse de que el total de la venta sea un número válido
        const totalVenta = parseFloat(venta.total) || 0;

        // Acumular el total de ventas por hora y aplicar el redondeo a 2 decimales
        ventasPorHora[hora] += totalVenta;
      }
    });

    // Aplicar toFixed(2) a cada valor de ventasPorHora
    const ventasPorHoraConDosDecimales = ventasPorHora.map((venta) =>
      parseFloat(venta.toFixed(2))
    );

    console.log("Ventas por hora (solo hoy):", ventasPorHoraConDosDecimales); // Verificar cómo se distribuyen las ventas por hora
    return ventasPorHoraConDosDecimales;
  };

  const generarDatosGrafico = (ventasPorHora) => {
    const horas = Array.from({ length: 24 }, (_, i) => `${i}:00`); // Eje X: Horas (0-23)

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
  };

  const options = {
    responsive: true,
    plugins: {
      filler: {
        propagate: false,
      },
      title: {
        display: true,
        text: "Ventas por Hora (Hoy)",
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
    scales: {
      y: {
        grid: {
          drawOnChartArea: true, // Dibujar las líneas horizontales
          drawTicks: false, // No dibujar las marcas de los ticks
          borderColor: "rgba(0, 0, 0, 0)", // Sin borde para el eje Y
          color: "rgba(0, 0, 0, 0.1)", // Color de las líneas horizontales
        },
      },
      x: {
        grid: {
          display: false, // Desactivar las rejillas para el eje X
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      {chartData ? (
        <Line ref={chartRef} data={chartData} options={options} />
      ) : (
        <Cargando />
      )}
      <div className="mt-3"></div>
    </div>
  );
};

export default GraficoLineaDayVentas;
