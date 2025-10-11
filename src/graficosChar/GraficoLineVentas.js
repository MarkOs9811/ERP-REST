import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2"; // Cambia Line por Bar
import { getVentas } from "../service/ObtenerVentasDetalle";
import { Cargando } from "../components/componentesReutilizables/Cargando";
import { CalendarDays } from "lucide-react";

const GraficoBarEjemplo = () => {
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
      const fechaStr = venta.fechaVenta || venta.created_at;
      // Extrae año, mes y día del string ISO
      const [anio, mes, dia] = fechaStr.split("T")[0].split("-").map(Number);

      // Mes en JS es base 0, pero aquí el string es base 1, así que comparamos directo
      if (anio === añoActual && mes === mesActual + 1) {
        if (dia >= 1 && dia <= diasMesActual) {
          ventasPorMes.actual[dia - 1] += Number(venta.total);
        }
      } else if (anio === añoPasado && mes === mesPasado + 1) {
        if (dia >= 1 && dia <= diasMesPasado) {
          ventasPorMes.pasado[dia - 1] += Number(venta.total);
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
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Ventas Mes Pasado",
        data: ventasProcesadas.pasado,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: "Ventas Mensuales",
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <div className="mb-3 d-flex gap-2 align-middle justify-content-left">
        <span className="alert border-0 alert-danger text-danger p-2 mb-0">
          <CalendarDays size={25} className="text-auto" />
        </span>
        <h6 className="mb-1 d-flex flex-column gap-1">
          <span className="fw-bold">Ventas del mes</span>
          <p className="text-muted small mb-0">
            ventas del mes actual y del anterior
          </p>
        </h6>
      </div>
      <Bar ref={chartRef} data={datosGrafico} options={options} />
    </div>
  );
};

export default GraficoBarEjemplo;
