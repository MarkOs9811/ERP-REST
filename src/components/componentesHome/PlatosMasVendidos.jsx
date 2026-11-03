import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { Award } from "lucide-react";
import { Card } from "@/components/ui/card";
 // Cambié el icono al de tu diseño

export function PlatoMasVendido() {
  const {
    data: ventas = [],
    isLoading: isLoadingVentas,
    isError: isErrorVentas,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Calcular los platos más vendidos
  const platosVendidos = {};

  ventas.forEach((venta) => {
    const fechaVenta = new Date(venta.created_at);
    const isThisMonth =
      fechaVenta.getMonth() + 1 === currentMonth &&
      fechaVenta.getFullYear() === currentYear;

    if (!isThisMonth) return;

    // 1. Pedidos Mesa / Llevar
    const pedido = venta.pedido;
    if (pedido) {
      const detalles = pedido.detalle_pedidos || pedido.detallePedidos || [];
      detalles.forEach((detalle) => {
        const plato = detalle.producto?.nombre || "Desconocido";
        const foto = detalle.producto?.foto_url || null;
        // Agregamos precio y categoría (ajusta según tu BD)
        const precio = detalle.precio || detalle.producto?.precio || 0;
        const categoria = detalle.producto?.categoria?.nombre || "Fondo";

        if (!platosVendidos[plato]) {
          platosVendidos[plato] = { cantidad: 0, foto, precio, categoria };
        }
        platosVendidos[plato].cantidad += detalle.cantidad;
      });
    }

    // 2. Pedidos Web
    const pedidoWeb = venta.pedido_web || venta.pedidoWeb;
    if (pedidoWeb) {
      const detallesWeb =
        pedidoWeb.detalles_pedido || pedidoWeb.detallesPedido || [];
      detallesWeb.forEach((detalle) => {
        const plato = detalle.plato?.nombre || "Desconocido";
        const foto = detalle.plato?.foto_url || null;
        const precio = detalle.precio || detalle.plato?.precio || 0;
        const categoria = detalle.plato?.categoria?.nombre || "Fondo";

        if (!platosVendidos[plato]) {
          platosVendidos[plato] = { cantidad: 0, foto, precio, categoria };
        }
        platosVendidos[plato].cantidad += detalle.cantidad;
      });
    }
  });

  // Ordenar de mayor a menor
  const todosLosPlatos = Object.entries(platosVendidos).sort(
    (a, b) => b[1].cantidad - a[1].cantidad,
  );

  // Dividimos la lista: Top 3 para arriba, el resto para abajo
  const top3Platos = todosLosPlatos.slice(0, 3);
  const menuSecundario = todosLosPlatos.slice(3);

  return (
    <CondicionCarga isLoading={isLoadingVentas} isError={isErrorVentas}>
      <Card className="h-full rounded-xl border border-border bg-card p-4 text-card-foreground">
        {/* CABECERA */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-base font-semibold">
              <Award className="text-amber-500" size={24} />
              Platos más Vendidos
            </h2>
            <p className="mb-0 text-sm text-muted-foreground">
              Platos más pedidos este mes.
            </p>
          </div>
        </div>

        {top3Platos.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No hay órdenes este mes.
          </div>
        ) : (
          <>
            {/* SECCIÓN TOP 3 (TARJETAS GRANDES) */}
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              {top3Platos.map(
                ([plato, { cantidad, foto, precio, categoria }], index) => (
                  <div className="min-w-0" key={index}>
                    <Card className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
                      {/* Badge de Ranking Flotante */}
                      <span
                        className={`absolute right-0 top-0 z-[1] flex size-8 translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full p-2 text-sm font-bold text-white shadow-sm ${
                          index === 0
                            ? "bg-rose-600"
                            : index === 1
                              ? "bg-amber-500 text-slate-950"
                              : "bg-slate-500"
                        }`}
                      >
                        #{index + 1}
                      </span>

                      {/* Imagen y Categoría */}
                      <div className="relative">
                        <img
                          src={
                            foto || "https://placehold.co/300x200?text=Plato"
                          }
                          className="h-40 w-full object-cover"
                          alt={plato}
                          style={{ height: "160px", objectFit: "cover" }}
                        />
                        <span className="absolute bottom-2 left-2 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-medium text-white">
                          {categoria}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="mb-1 truncate text-sm font-semibold text-foreground">
                          {plato}
                        </h3>
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">
                            {cantidad} órdenes registradas
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: "var(--fw-emerald, #10b981)" }}
                          >
                            S/ {parseFloat(precio).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ),
              )}
            </div>

            {/* SECCIÓN MENÚ SECUNDARIO (El resto de platos) */}
            {menuSecundario.length > 0 && (
              <div className="mt-6">
                <h6
                  className="mb-3 text-xs font-bold tracking-widest text-muted-foreground"
                  style={{ letterSpacing: "2px", fontSize: "0.8rem" }}
                >
                  MENÚ SECUNDARIO
                </h6>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {menuSecundario.map(
                    ([plato, { cantidad, foto, precio }], index) => (
                      <Card
                        className="w-64 shrink-0 rounded-xl border border-border bg-card"
                        key={index}
                      >
                        <div className="flex items-center justify-between gap-2 p-2">
                          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                            <img
                              src={
                                foto ||
                                "https://placehold.co/100x100?text=Plato"
                              }
                              className="size-12 shrink-0 rounded-lg object-cover"
                              alt={plato}
                            />
                            <div className="flex min-w-0 flex-col">
                              <h6
                                className="mb-0 truncate text-sm font-semibold"
                                style={{
                                  fontSize: "0.9rem",
                                }}
                              >
                                {plato}
                              </h6>
                              <small
                                className="text-xs text-muted-foreground"
                                style={{ fontSize: "0.75rem" }}
                              >
                                {cantidad} órdenes
                              </small>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex flex-col items-end">
                              <span
                                className="font-semibold text-foreground"
                                style={{ fontSize: "0.9rem" }}
                              >
                                S/ {parseFloat(precio).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ),
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </CondicionCarga>
  );
}
