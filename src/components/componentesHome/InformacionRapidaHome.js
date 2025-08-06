import { useQuery } from "@tanstack/react-query";

import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GetMesas } from "../../service/GetMesas";
import { GetAlmacen } from "../../service/serviceAlmacen/GetAlmacen";
import { getPedidosPendientes } from "../../service/GetPedidosPendientes";
import { UsuariosActivosHome } from "./UsuariosActivosHome";
import { CircleAlert, Clock9 } from "lucide-react";

export function InformacionRapidaHome({}) {
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
      <div className="col-md-12">
        <div className="row  h-100">
          <div className="col-md-12 mb-3">
            <div className="card h-100 shadow-sm card-pedidos-pendientes">
              <div className="card-body d-flex align-items-center ">
                <div className="badge-ico badge-ico-pedidos-pendientes me-3">
                  <Clock9 color={"auto"} height="40px" width="40px" />
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
                  <CircleAlert color={"auto"} height="40px" width="40px" />
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
      <div className="col-md-6">
        <div className="card h-100 shadow-sm">
          <div className="card-body d-flex justify-content-center align-items-center">
            <div className="text-center">
              <p className="fw-semibold mb-3" style={{ fontSize: "1.1rem" }}>
                Ventas Hoy
              </p>
              <p className="mb-0 text-dark h2 fw-bold">
                S/ {ventasHoyFormatted}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mesas Ocupadas */}
      <div className="col-md-6">
        <div className="card h-100 shadow-sm">
          <div className="card-body d-flex justify-content-center align-items-center">
            <div className="text-center">
              <p className="fw-semibold mb-2" style={{ fontSize: "1.1rem" }}>
                Mesas Ocupadas
              </p>
              <p
                className="mb-0 text-dark h2 fw-bold"
                style={{ fontSize: "1.7rem" }}
              >
                {mesasOcupadas}/{totalMesas}
              </p>
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
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <UsuariosActivosHome />
      </div>

      {/* Pedidos Pendientes */}
    </div>
  );
}
