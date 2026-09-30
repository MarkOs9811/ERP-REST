import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { Cargando } from "../components/componentesReutilizables/Cargando";
import { Clock, ClockArrowUp } from "lucide-react";

const GraficoLineaDayVentas = () => {
  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // Procesar ventas del día actual por hora (Optimizado con useMemo)
  const { ventasPorHora, maxVentas, horaPunta } = useMemo(() => {
    if (!listVentas.length) {
      return { ventasPorHora: Array(24).fill(0), maxVentas: 1, horaPunta: "-" };
    }

    const ventasHora = Array(24).fill(0);
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split("T")[0];

    listVentas.forEach((venta) => {
      if (!venta.created_at) return;
      // Normalizar fecha
      const fecha = new Date(venta.created_at.replace(" ", "T"));
      const fechaVenta = fecha.toISOString().split("T")[0];

      // Si la venta es de hoy, sumar al array en la posición de su hora
      if (fechaVenta === fechaHoy) {
        const hora = fecha.getHours();
        ventasHora[hora] += parseFloat(venta.total) || 0;
      }
    });

    const arrFinal = ventasHora.map((v) => parseFloat(v.toFixed(2)));
    const maximo = Math.max(...arrFinal, 1); // Evitar división por 0

    // Encontrar la hora punta (solo si hay más de 0 ventas)
    const puntaIdx = arrFinal.indexOf(maximo);
    const puntaTexto = maximo > 0 && puntaIdx >= 0 ? `${puntaIdx}:00` : "-";

    return {
      ventasPorHora: arrFinal,
      maxVentas: maximo,
      horaPunta: puntaTexto,
    };
  }, [listVentas]);

  if (isLoading) return <Cargando />;
  if (isError) return <p className="text-danger p-3">Error al cargar datos</p>;

  // Solo mostrar de 12:00 a 21:00 (Rango de operaciones del restaurante)
  const horasMostrar = Array.from({ length: 10 }, (_, i) => i + 12);

  return (
    <div className="d-flex flex-column h-100">
      {/* Cabecera Limpia (Estilo Fire Wok) */}
      <div className="mb-4 d-flex gap-3 align-items-center">
        <span
          className="rounded-circle p-2 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "var(--bg-saffron-soft)",
            color: "var(--fw-saffron)",
            minWidth: "48px",
            minHeight: "48px",
          }}
        >
          <Clock size={24} />
        </span>

        <div className="d-flex flex-column flex-grow-1">
          <span
            className="fw-bold"
            style={{ color: "var(--text-main)", fontSize: "1.1rem" }}
          >
            Ventas por Hora
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Actividad por horas del día
          </span>
        </div>
      </div>

      {/* Lista de Barras de Tiempo */}
      <div className="flex-grow-1">
        {horasMostrar.map((hora) => {
          const ventas = ventasPorHora[hora];
          const percent = Math.round((ventas / maxVentas) * 100);

          return (
            <div
              key={hora}
              className="d-flex align-items-center mb-3"
              style={{ fontSize: "0.95rem" }}
            >
              {/* Etiqueta de la Hora */}
              <div
                style={{
                  width: 55,
                  textAlign: "right",
                  marginRight: 12,
                  color: "var(--text-main)",
                  fontWeight: "500",
                }}
              >
                {hora}:00
              </div>

              {/* Contenedor de la barra (Fondo dinámico claro/oscuro) */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "var(--bg-main)",
                  borderRadius: 20,
                  height: 28,
                  position: "relative",
                  overflow: "hidden",
                  marginRight: 12,
                }}
              >
                {/* Relleno de la barra (Saffron - Naranja para indicar actividad) */}
                <div
                  style={{
                    width: `${percent}%`,
                    backgroundColor: "var(--fw-saffron)",
                    height: "100%",
                    borderRadius: 20,
                    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 10,
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    fontSize: "0.85rem",
                  }}
                >
                  {ventas > 0 ? `S/ ${ventas}` : ""}
                </div>
              </div>

              {/* Porcentaje numérico */}
              <div
                style={{
                  width: 45,
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "var(--text-main)",
                }}
              >
                {percent}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer del componente (Hora Punta) */}
      <div
        className="mt-auto pt-3 border-top"
        style={{ borderColor: "var(--bg-main) !important" }}
      >
        <span
          className="d-flex align-items-center gap-2"
          style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
        >
          <ClockArrowUp size={20} style={{ color: "var(--fw-strawberry)" }} />
          Hora punta:{" "}
          <span className="fw-bold" style={{ color: "var(--fw-saffron)" }}>
            {horaPunta}
          </span>
        </span>
      </div>
    </div>
  );
};

export default GraficoLineaDayVentas;
