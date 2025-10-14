import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { Cargando } from "../components/componentesReutilizables/Cargando";
import { Clock, ClockArrowUp, Crown } from "lucide-react";

// Función para calcular el color según el porcentaje
function getBarColor(percent) {
  if (percent >= 90) return "#d32f2f"; // rojo fuerte
  if (percent >= 70) return "#e57373"; // rojo medio
  if (percent >= 20) return "#ffb3b3"; // rojo claro
  return "#ffe5e5"; // muy claro
}

const GraficoLineaDayVentas = () => {
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

  if (isLoading) return <Cargando />;
  if (isError) return <p>Error al cargar datos</p>;

  const ventasPorHora = procesarVentasHoy(listVentas);

  // Calcular el máximo para el porcentaje
  const maxVentas = Math.max(...ventasPorHora, 1);

  // Solo mostrar de 12:00 a 21:00 como en la imagen
  const horasMostrar = Array.from({ length: 10 }, (_, i) => i + 12);

  // Calcular la hora punta (mayor venta)
  const horaPuntaIndex = ventasPorHora.indexOf(maxVentas);
  const horaPunta = horaPuntaIndex >= 0 ? `${horaPuntaIndex}:00` : "-";

  return (
    <div className="p-2" style={{ maxWidth: 400 }}>
      <div className="mb-3 d-flex gap-2 align-middle justify-content-left">
        <span className="alert border-0 alert-danger text-danger p-2 mb-0">
          <Clock size={25} />
        </span>
        <h6 className="mb-1 d-flex flex-column gap-1">
          <span className="fw-bold">Ventas por Hora</span>
          <p className="text-muted small mb-0">Actividad por horas del día</p>
        </h6>
      </div>
      {horasMostrar.map((hora) => {
        const ventas = ventasPorHora[hora];
        const percent = Math.round((ventas / maxVentas) * 100);
        return (
          <div
            key={hora}
            className="d-flex align-items-center mb-2"
            style={{ fontSize: "1rem" }}
          >
            <div style={{ width: 55, textAlign: "right", marginRight: 8 }}>
              {hora}:00
            </div>
            <div
              style={{
                flex: 1,
                background: "#f5f5f5",
                borderRadius: 20,
                height: 28,
                position: "relative",
                overflow: "hidden",
                marginRight: 8,
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  background: getBarColor(percent),
                  height: "100%",
                  borderRadius: 20,
                  transition: "width 0.5s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 10,
                  fontWeight: "bold",
                  color: "#fff",
                  fontSize: "1rem",
                }}
              >
                {ventas > 0 ? ventas : ""}
              </div>
            </div>
            <div
              style={{
                width: 40,
                textAlign: "left",
                fontWeight: "bold",
                color: "#330f0fff",
              }}
            >
              {percent}%
            </div>
          </div>
        );
      })}
      <div className=" text-left mt-4">
        <span className=" text-muted small">
          {" "}
          <ClockArrowUp /> Hora punta: {horaPunta}
        </span>
      </div>
    </div>
  );
};

export default GraficoLineaDayVentas;
