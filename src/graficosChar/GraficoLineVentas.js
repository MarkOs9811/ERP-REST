import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { Cargando } from "../components/componentesReutilizables/Cargando";

const GraficoLineaEjemplo = () => {
  const chartRef = useRef(null);
  const [smooth, setSmooth] = useState(false);

  const {
    data: ventas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // Función para obtener la cantidad de días en un mes específico
  const getDiasDelMes = (año, mes) => {
    return new Date(año, mes + 1, 0).getDate();
  };

  let ventasProcesadas = null;

  if (ventas) {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();
    const mesPasado = mesActual === 0 ? 11 : mesActual - 1;
    const añoPasado = mesActual === 0 ? añoActual - 1 : añoActual;

    const diasMesActual = getDiasDelMes(añoActual, mesActual);
    const diasMesPasado = getDiasDelMes(añoPasado, mesPasado);

    const ventasPorMes = {
      actual: Array(diasMesActual).fill(0),
      pasado: Array(diasMesPasado).fill(0),
    };

    ventas.forEach((venta) => {
      const fecha = new Date(venta.fechaVenta);
      const dia = fecha.getDate() - 1;

      if (fecha.getFullYear() === añoActual && fecha.getMonth() === mesActual) {
        if (dia >= 0 && dia < diasMesActual) {
          ventasPorMes.actual[dia] += venta.total;
        }
      } else if (
        fecha.getFullYear() === añoPasado &&
        fecha.getMonth() === mesPasado
      ) {
        if (dia >= 0 && dia < diasMesPasado) {
          ventasPorMes.pasado[dia] += venta.total;
        }
      }
    });

    ventasProcesadas = ventasPorMes;
  }

  if (isLoading) return <Cargando />;
  if (isError) return <p>Error al cargar datos. Intente nuevamente.</p>;
  if (!ventasProcesadas) return <p>No hay datos disponibles.</p>;

  const maxDias = Math.max(
    ventasProcesadas.actual.length,
    ventasProcesadas.pasado.length
  );

  const datosGrafico = {
    labels: Array.from({ length: maxDias }, (_, i) => i + 1),
    datasets: [
      {
        label: "Ventas Mes Actual S/.",
        data: ventasProcesadas.actual,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "Ventas Mes Pasado",
        data: ventasProcesadas.pasado,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Ventas Mensuales",
      },
    },
    elements: {
      line: {
        tension: smooth ? 0.4 : 0,
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <h3 className="text-primary">Durante el Mes</h3>
      <Line ref={chartRef} data={datosGrafico} options={options} />
    </div>
  );
};

export default GraficoLineaEjemplo;
