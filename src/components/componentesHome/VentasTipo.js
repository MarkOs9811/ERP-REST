import { Globe, ShoppingBag, Utensils } from "lucide-react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function VentasTipo({ load, error, ventasList }) {
  // Lógica optimizada: Procesamos todo en una sola iteración (O(N)) usando reduce.
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const totales = (ventasList || []).reduce(
    (acc, venta) => {
      // 1. Cálculos de Pedidos (Llevar / Mesa)
      if (venta.pedido) {
        const { tipoVenta, detalle_pedidos, fechaPedido } = venta.pedido;
        const fechaPedidoDate = new Date(fechaPedido);

        if (
          fechaPedidoDate.getMonth() + 1 === currentMonth &&
          fechaPedidoDate.getFullYear() === currentYear
        ) {
          const cantidadPlatos = Array.isArray(detalle_pedidos)
            ? detalle_pedidos.length
            : 0;

          if (tipoVenta === "llevar") acc.llevar += cantidadPlatos;
          if (tipoVenta === "mesa") acc.mesa += cantidadPlatos;
        }
      }

      // 2. Cálculos de Ventas Web
      if (venta.idPedidoWeb !== null && venta.fechaVenta) {
        const fechaVentaDate = new Date(venta.fechaVenta);
        if (
          fechaVentaDate.getMonth() + 1 === currentMonth &&
          fechaVentaDate.getFullYear() === currentYear
        ) {
          acc.web += 1;
        }
      }

      return acc;
    },
    { web: 0, llevar: 0, mesa: 0 }, // Valores iniciales
  );

  // Estructura de datos para no repetir código HTML (DRY)
  const tarjetasStats = [
    {
      id: "web",
      titulo: "Pedidos Web",
      subtitulo: "Este mes",
      valor: totales.web,
      icono: <Globe size={24} color="var(--fw-emerald)" />,
      bgIcono: "var(--bg-emerald-soft)",
    },
    {
      id: "llevar",
      titulo: "Llevar",
      subtitulo: "Este mes",
      valor: totales.llevar,
      icono: <ShoppingBag size={24} color="var(--fw-saffron)" />,
      bgIcono: "var(--bg-saffron-soft)",
    },
    {
      id: "mesa",
      titulo: "En Mesa",
      subtitulo: "Este mes",
      valor: totales.mesa,
      icono: <Utensils size={24} color="var(--fw-strawberry)" />,
      bgIcono: "var(--bg-strawberry-soft)",
    },
  ];

  return (
    <CondicionCarga isLoading={load} isError={error}>
      {/* Container principal con Flexbox y gap nativo de Bootstrap */}
      <div className="d-flex flex-column gap-3 h-100">
        {tarjetasStats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white d-flex border align-items-center p-3"
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "var(--radius-md)",
            }}
          >
            {/* Ícono */}
            <div
              className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: stat.bgIcono,
              }}
            >
              {stat.icono}
            </div>

            {/* Textos (flex-grow-1 empuja el número hacia la derecha automáticamente) */}
            <div className="d-flex flex-column flex-grow-1">
              <span
                className="fw-bold m-0"
                style={{ color: "var(--text-main)" }}
              >
                {stat.titulo}
              </span>
              <small
                style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
              >
                {stat.subtitulo}
              </small>
            </div>

            {/* Valor (Número final) */}
            <div
              className="fs-4 fw-bold m-0"
              style={{ color: "var(--text-main)" }}
            >
              {stat.valor}
            </div>
          </div>
        ))}
      </div>
    </CondicionCarga>
  );
}
