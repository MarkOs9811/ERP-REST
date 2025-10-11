import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { Crown } from "lucide-react";

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
    <div className=" card h-100 p-2 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center p-3">
        <div className="mb-3 d-flex gap-2 align-middle justify-content-center">
          <span className="alert border-0 alert-danger text-danger p-2 mb-0">
            <Crown size={25} />
          </span>
          <h6 className="mb-1 d-flex flex-column gap-1">
            <span className="fw-bold">Plato mas vendido</span>
            <p className="text-muted small mb-0">Del ultimo mes</p>
          </h6>
        </div>
      </div>
      <div className="card-body bg-auto">
        <div className="d-flex justify-content-between align-items-center">
          <ul className="w-100 m-auto p-0 mx-3">
            {topPlatos.map(([plato, { cantidad, foto }], index) => (
              <li
                key={index}
                className="w-100 list-group-item"
                style={{
                  border: "none",
                  padding: "10px 0",
                  fontSize: "0.9rem",
                }}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center">
                    <img
                      src={`${BASE_URL}/storage/${foto}`}
                      alt={plato}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "20%",
                        border: "2px solid #fafafa",
                        marginRight: "15px",
                      }}
                    />
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{plato}</span>
                      <div>
                        Órdenes
                        <span
                          className="fw-bold mx-2"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {cantidad}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Badge centrado verticalmente con el texto */}
                  <div className="">
                    <span className="badge bg-danger p-2  ">
                      <p className="mb-0"># {index + 1}</p>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
