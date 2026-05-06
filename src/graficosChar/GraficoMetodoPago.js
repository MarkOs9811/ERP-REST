import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { Cargando } from "../components/componentesReutilizables/Cargando";
import { Crown, PieChart } from "lucide-react";

const GraficoMetodoPago = () => {
  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // Procesar ventas por método de pago (Optimizado con useMemo)
  const metodos = useMemo(() => {
    if (!listVentas.length) return [];

    const resumen = {};
    let total = 0;

    listVentas.forEach((venta) => {
      const metodo = venta?.metodo_pago?.nombre || "Sin método";
      resumen[metodo] = (resumen[metodo] || 0) + 1;
      total += 1;
    });

    // Convertir a array y calcular porcentaje
    return Object.entries(resumen)
      .map(([metodo, cantidad]) => ({
        metodo,
        cantidad,
        percent: total ? Math.round((cantidad / total) * 100) : 0,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [listVentas]);

  if (isLoading) return <Cargando />;
  if (isError) return <p className="text-danger p-3">Error al cargar datos</p>;

  const metodoTop = metodos[0];

  return (
    <div className="d-flex flex-column h-100">
      {/* Cabecera Limpia (Estilo Fire Wok) */}
      <div className="mb-4 d-flex gap-3 align-items-center">
        <span
          className="rounded-circle p-2 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "var(--bg-emerald-soft)",
            color: "var(--fw-emerald)",
            minWidth: "48px",
            minHeight: "48px",
          }}
        >
          <PieChart size={24} />
        </span>

        <div className="d-flex flex-column flex-grow-1">
          <span
            className="fw-bold"
            style={{ color: "var(--text-main)", fontSize: "1.1rem" }}
          >
            Métodos de Pago
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Porcentaje de uso en ventas
          </span>
        </div>
      </div>

      {/* Lista de Barras */}
      <div className="flex-grow-1">
        {metodos.map(({ metodo, cantidad, percent }) => (
          <div
            key={metodo}
            className="d-flex align-items-center mb-3"
            style={{ fontSize: "0.95rem" }}
          >
            {/* Nombre del método */}
            <div
              style={{
                width: 80,
                textAlign: "right",
                marginRight: 12,
                color: "var(--text-main)",
                fontWeight: "500",
              }}
            >
              {metodo}
            </div>

            {/* Contenedor de la barra (Fondo dinámico claro/oscuro) */}
            <div
              style={{
                flex: 1,
                backgroundColor: "var(--bg-main)", // En modo oscuro se pone oscuro automáticamente
                borderRadius: 20,
                height: 28,
                position: "relative",
                overflow: "hidden",
                marginRight: 12,
              }}
            >
              {/* Relleno de la barra (Emerald) */}
              <div
                style={{
                  width: `${percent}%`,
                  backgroundColor: "var(--fw-emerald)",
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
                {cantidad > 0 ? cantidad : ""}
              </div>
            </div>

            {/* Porcentaje numérico */}
            <div
              style={{
                width: 45,
                textAlign: "left",
                fontWeight: "bold",
                color: "var(--text-main)", // Antes era verde fijo, ahora es neutro y elegante
              }}
            >
              {percent}%
            </div>
          </div>
        ))}
      </div>

      {/* Footer del componente (El Método Top) */}
      {metodoTop && (
        <div
          className="mt-auto pt-3 border-top"
          style={{ borderColor: "var(--bg-main) !important" }}
        >
          <span
            className="d-flex align-items-center gap-2"
            style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
          >
            <Crown size={20} style={{ color: "var(--fw-saffron)" }} />{" "}
            {/* Coronita Naranja Premium */}
            Método más usado:{" "}
            <span className="fw-bold" style={{ color: "var(--fw-emerald)" }}>
              {metodoTop.metodo}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default GraficoMetodoPago;
