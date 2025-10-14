import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { Cargando } from "../components/componentesReutilizables/Cargando";
import { Crown, PieChart } from "lucide-react";

// Función para calcular el color según el porcentaje
function getBarColor(percent) {
  if (percent >= 90) return "#2e7d32"; // verde fuerte
  if (percent >= 70) return "#66bb6a"; // verde medio
  if (percent >= 40) return "#a5d6a7"; // verde claro
  return "#e0f2f1"; // muy claro
}

const GraficoMetodoPago = () => {
  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // Procesar ventas por método de pago
  function procesarMetodosPago(ventas) {
    const resumen = {};
    let total = 0;

    ventas.forEach((venta) => {
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
  }

  if (isLoading) return <Cargando />;
  if (isError) return <p>Error al cargar datos</p>;

  const metodos = procesarMetodosPago(listVentas);
  const metodoTop = metodos[0];

  return (
    <div className="p-2" style={{ maxWidth: 400 }}>
      <div className="mb-3 d-flex gap-2 align-middle justify-content-left p-3">
        <span className="alert border-0 alert-success text-success p-2 mb-0">
          <PieChart size={25} />
        </span>
        <h6 className="mb-1 d-flex flex-column gap-1">
          <span className="fw-bold">Métodos de Pago</span>
          <p className="text-muted small mb-0">Porcentaje de uso en ventas</p>
        </h6>
      </div>
      {metodos.map(({ metodo, cantidad, percent }) => (
        <div
          key={metodo}
          className="d-flex align-items-center mb-2"
          style={{ fontSize: "1rem" }}
        >
          <div style={{ width: 120, textAlign: "right", marginRight: 8 }}>
            {metodo}
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
              {cantidad}
            </div>
          </div>
          <div
            style={{
              width: 40,
              textAlign: "left",
              fontWeight: "bold",
              color: "#2e7d32",
            }}
          >
            {percent}%
          </div>
        </div>
      ))}
      <div className="text-left mt-4 p-3">
        <span className="text-muted small">
          <Crown className="mb-1" /> Método más usado:{" "}
          <span className="fw-bold text-success">{metodoTop?.metodo}</span>
        </span>
      </div>
    </div>
  );
};

export default GraficoMetodoPago;
