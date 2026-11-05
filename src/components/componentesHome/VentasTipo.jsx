import { Globe, ShoppingBag, Utensils } from "lucide-react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { Card } from "@/components/ui/card";

export function VentasTipo({
  load,
  error,
  errorLoad,
  ventasList,
  esRestaurante = false,
}) {
  const isError = error ?? errorLoad;
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
    ...(esRestaurante
      ? [
          {
            id: "mesa",
            titulo: "En Mesa",
            subtitulo: "Este mes",
            valor: totales.mesa,
            icono: <Utensils size={24} color="var(--fw-strawberry)" />,
            bgIcono: "var(--bg-strawberry-soft)",
          },
        ]
      : []),
  ];

  return (
    <CondicionCarga isLoading={load} isError={isError}>
      <Card className="h-full rounded-2xl border-border/70 bg-card p-4 text-card-foreground shadow-none">
        <h2 className="mb-4 text-base font-semibold">Canales de venta</h2>
        <div className="flex flex-col gap-3">
          {tarjetasStats.map((stat) => (
            <div
              key={stat.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3"
            >
              {/* Ícono */}
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-full"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: stat.bgIcono,
                }}
              >
                {stat.icono}
              </div>

              {/* Textos (flex-grow-1 empuja el número hacia la derecha automáticamente) */}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-semibold text-foreground">
                  {stat.titulo}
                </span>
                <small className="text-sm text-muted-foreground">
                  {stat.subtitulo}
                </small>
              </div>

              {/* Valor (Número final) */}
              <div className="text-2xl font-bold text-foreground">
                {stat.valor}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </CondicionCarga>
  );
}
