import { useQuery } from "@tanstack/react-query";
import {
  AlertCircleOutline,
  CashOutline,
  RestaurantOutline,
  TimeOutline,
} from "react-ionicons";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GetMesas } from "../../service/GetMesas";
import { GetAlmacen } from "../../service/serviceAlmacen/GetAlmacen";
import { getPedidosPendientes } from "../../service/GetPedidosPendientes";

export function InformacionRapidaHome({}) {
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
  console.log(ventas);
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

  const {
    data: mesas = [],
    isLoading: isLoadingMesas,
    isError: isErrorMesas,
  } = useQuery({
    queryKey: ["mesas"],
    queryFn: GetMesas,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: almacen = [],
    isLoading: isLoadingAlmacen,
    isError: isErrorAlmacen,
  } = useQuery({
    queryKey: ["almacen"],
    queryFn: GetAlmacen,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: pedidosWeb = [],
    isLoading: isLoadingPedidosWeb,
    isError: isErrorPedidos,
  } = useQuery({
    queryKey: ["pedidosWeb"],
    queryFn: getPedidosPendientes,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const hoy = new Date().toISOString().split("T")[0];

  // Calcular ventasHoy
  const ventasHoy = ventas
    .filter((venta) => venta.fechaVenta === hoy) // Filtrar ventas del día de hoy
    .reduce((total, venta) => total + Number(venta.total || 0), 0); // Convertir 'total' a número y sumar

  const ventasHoyFormatted = ventasHoy.toFixed(2); // Formatear a 2 decimales

  // Calcular mesas ocupadas
  console.log(mesas);
  // Verificar si mesas es un objeto que contiene un array
  const mesasArray = Array.isArray(mesas.mesas) ? mesas.mesas : [];

  // Calcular mesas ocupadas
  const mesasOcupadas = mesasArray.filter((mesa) => mesa.estado === 0).length;

  // Calcular total de mesas
  const totalMesas = mesasArray.length;

  // Calcular productos con bajo stock
  const productosBajoStock = Array.isArray(almacen)
    ? almacen.filter((producto) => producto.cantidad <= 5).length
    : 0;

  // Calcular pedidos pendientes
  const pedidosPendientes = pedidosWeb.length;

  return (
    <div className="row mb-3 g-3">
      <div className="col-md-3">
        <div className="row  h-100">
          <div className="col-md-12 mb-3">
            <div className="card h-100 shadow-sm card-pedidos-pendientes">
              <div className="card-body d-flex align-items-center ">
                <div className="badge-ico badge-ico-pedidos-pendientes me-3">
                  <TimeOutline color={"auto"} height="40px" width="40px" />
                </div>
                <div>
                  <p className="h6" style={{ color: "white" }}>
                    Pedidos Pendientes
                  </p>
                  <p className="mb-0 text-white fw-semibold">
                    {pedidosPendientes} Pedidos en estado pendiente
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="card h-100 shadow-sm card-alerta-almacen">
              <div className="card-body d-flex align-items-center">
                <div className="badge-ico badge-ico-almacen me-3">
                  <AlertCircleOutline
                    color={"auto"}
                    height="40px"
                    width="40px"
                  />
                </div>
                <div>
                  <p className="h6" style={{ color: "white" }}>
                    Alertas Almacen
                  </p>
                  <p className="mb-0 text-white fw-semibold">
                    {productosBajoStock} productos en bajo stock
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Ventas Hoy */}
      <div className="col-md-3">
        <div className="card h-100 shadow-sm">
          <div className="card-body d-flex justify-content-center align-items-center">
            <div className="text-center">
              <p
                className="fw-semibold mb-3"
                style={{ color: "#444", fontSize: "1.1rem" }}
              >
                Ventas Hoy
              </p>
              <h3 className="mb-0 text-dark">S/ {ventasHoyFormatted}</h3>
            </div>
            <CashOutline
              color={"var(--accent-blue)"}
              height="50px"
              width="50px"
              style={{ marginLeft: "15px" }} // Espacio entre el texto y el ícono
            />
          </div>
        </div>
      </div>

      {/* Mesas Ocupadas */}
      <div className="col-md-3">
        <div className="card h-100 shadow-sm">
          <div className="card-body d-flex justify-content-center align-items-center">
            <div className="text-center">
              <p
                className="fw-semibold mb-2"
                style={{ color: "#444", fontSize: "1.1rem" }}
              >
                Mesas Ocupadas
              </p>
              <h3 className="mb-0 text-dark" style={{ fontSize: "1.7rem" }}>
                {mesasOcupadas}/{totalMesas}
              </h3>
              <div
                className="progress mt-2"
                style={{ height: "5px", width: "100%" }}
              >
                <div
                  className="progress-bar bg-danger"
                  style={{
                    width: `${
                      totalMesas > 0 ? (mesasOcupadas / totalMesas) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <RestaurantOutline
              color={"var(--primary-red)"}
              height="50px"
              width="50px"
              style={{ marginLeft: "15px" }} // Espacio entre el texto y el ícono
            />
          </div>
        </div>
      </div>

      {/* Platos más pedidos */}
      <div className="col-md-3">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p
                  className="fw-semibold mb-2"
                  style={{ color: "#444", fontSize: "1.1rem" }}
                >
                  Platos más pedidos
                </p>
                <ul className="list-group mt-3">
                  {topPlatos.map(([plato, { cantidad, foto }], index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex align-items-center justify-content-between"
                      style={{
                        border: "none",
                        padding: "10px 0",
                        fontSize: "0.9rem",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={`${BASE_URL}/storage/${foto}`}
                          alt={plato}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "20%",
                            border: "2px solid #fff",
                            marginRight: "15px", // Espacio entre la imagen y el texto
                          }}
                        />
                        <span>{plato}</span>
                      </div>
                      <span
                        className="badge bg-danger rounded-pill ms-5"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {cantidad}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedidos Pendientes */}
    </div>
  );
}
