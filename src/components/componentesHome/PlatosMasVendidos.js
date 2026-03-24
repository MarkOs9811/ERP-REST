import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function PlatoMasVendido() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

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

  // Obtener el mes y año actual
  const currentMonth = new Date().getMonth() + 1; // Los meses en JavaScript son 0-indexados
  const currentYear = new Date().getFullYear();

  // Calcular los platos más vendidos
  const platosVendidos = {};

  ventas.forEach((venta) => {
    // Procesar los platos de `pedido`
    if (venta.pedido && Array.isArray(venta.pedido.detalle_pedidos)) {
      const { detalle_pedidos, fechaPedido } = venta.pedido;
      const fechaPedidoDate = new Date(fechaPedido);

      if (
        fechaPedidoDate.getMonth() + 1 === currentMonth &&
        fechaPedidoDate.getFullYear() === currentYear
      ) {
        detalle_pedidos.forEach((detalle) => {
          const plato = detalle.producto?.nombre || "Desconocido";
          const foto = detalle.producto?.foto || null;

          if (!platosVendidos[plato]) {
            platosVendidos[plato] = { cantidad: 0, foto };
          }
          platosVendidos[plato].cantidad += detalle.cantidad;
        });
      }
    }

    // Procesar los platos de `pedido_web`
    if (venta.pedido_web && Array.isArray(venta.pedido_web.detalles_pedido)) {
      const { detalles_pedido, created_at } = venta.pedido_web;
      const fechaPedidoDate = new Date(created_at);

      if (
        fechaPedidoDate.getMonth() + 1 === currentMonth &&
        fechaPedidoDate.getFullYear() === currentYear
      ) {
        detalles_pedido.forEach((detalle) => {
          const plato = detalle.plato?.nombre || "Desconocido";
          const foto = detalle.plato?.foto || null;

          if (!platosVendidos[plato]) {
            platosVendidos[plato] = { cantidad: 0, foto };
          }
          platosVendidos[plato].cantidad += detalle.cantidad;
        });
      }
    }
  });

  // Ordenar los platos por cantidad vendida y tomar el Top 3
  const topPlatos = Object.entries(platosVendidos)
    .sort((a, b) => b[1].cantidad - a[1].cantidad) // Ordenar por cantidad descendente
    .slice(0, 3); // Tomar los 3 primeros
    
  return (
    <CondicionCarga isLoading={isLoadingVentas} isError={isErrorVentas}>
      <div className="h-100 p-0">
        <ul className="list-group list-group-flush w-100">
          {topPlatos.length === 0 && (
            <div className="text-muted text-center py-4 small">No hay órdenes este mes.</div>
          )}
          {topPlatos.map(([plato, { cantidad, foto }], index) => (
            <li
              key={index}
              className={`list-group-item d-flex align-items-center justify-content-between px-0 py-3 bg-transparent ${index === topPlatos.length - 1 ? 'border-bottom-0' : 'border-bottom border-light'}`}
            >
              <div className="d-flex align-items-center w-100 overflow-hidden">
                <img
                  src={foto ? `${BASE_URL}/storage/${foto}` : 'https://placehold.co/100x100?text=Plato'}
                  alt={plato}
                  className="shadow-sm flex-shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    marginRight: "12px",
                  }}
                />
                <div className="d-flex flex-column text-truncate">
                  <span className="fw-bold text-dark text-truncate" style={{ fontSize: "0.95rem" }}>{plato}</span>
                  <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                    {cantidad} {cantidad === 1 ? 'orden' : 'órdenes'}
                  </span>
                </div>
              </div>
              <div className="ms-2 flex-shrink-0">
                <span 
                  className={`badge rounded-pill fw-bold p-2 px-3 shadow-sm ${
                    index === 0 ? 'bg-danger' : 
                    index === 1 ? 'bg-warning text-dark' : 
                    'bg-secondary'
                  }`}
                >
                  #{index + 1}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </CondicionCarga>
  );
}
