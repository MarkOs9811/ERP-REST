import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GetMesas } from "../../service/GetMesas";
import { GetAlmacen } from "../../service/serviceAlmacen/GetAlmacen";
import { getPedidosPendientes } from "../../service/GetPedidosPendientes";
import { CircleAlert, Clock9, Store, Table } from "lucide-react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

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

  const hoy = new Date().toISOString().split("T")[0];

  const ventasHoy = ventas
    .filter((venta) => venta.fechaVenta === hoy)
    .reduce((total, venta) => total + Number(venta.total || 0), 0);

  const ventasHoyFormatted = ventasHoy.toFixed(2);

  const mesasArray = Array.isArray(mesas.data) ? mesas.data : [];
  const mesasOcupadas = mesasArray.filter((mesa) => mesa.estado == 0).length;
  const totalMesas = mesasArray.length;

  const productosBajoStock = Array.isArray(almacen)
    ? almacen.filter((producto) => producto.cantidad <= 5).length
    : 0;

  const pedidosPendientes = pedidosWeb.length;

  return (
    <div className="row g-3">
      {/* Ventas Hoy */}
      <div className="col-md-3">
        <CondicionCarga
          isLoading={isLoadingVentas}
          isError={isErrorVentas}
          mode="single-card"
        >
          <div className="card h-100 card-difuminada difuminado-ventas overflow-hidden">
            <div className="card-body d-flex justify-content-left align-items-center">
              <div className="text-center">
                <p className="mb-3" style={{ fontSize: "1.1rem" }}>
                  Ventas Hoy
                </p>
                <p className="mb-0 text-dark h2 fw-bold">
                  S/ {ventasHoyFormatted}
                </p>
              </div>
              <div className="ms-auto p-2 rounded-pill alert alert-success">
                {/* Ícono restaurado sin mis colores de Bootstrap */}
                <Store size={40} className="icono-institucional-ventas" />
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>

      {/* Mesas Ocupadas */}
      <div className="col-md-3">
        <CondicionCarga
          isLoading={isLoadingMesas}
          isError={isErrorMesas}
          mode="single-card"
        >
          <div className="card h-100 card-difuminada difuminado-mesas overflow-hidden">
            <div className="card-body d-flex justify-content-left align-items-center">
              <div className="text-left w-100">
                <p className="mb-2" style={{ fontSize: "1.1rem" }}>
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
                    className="progress-bar barra-institucional-mesas"
                    style={{
                      width: `${totalMesas > 0 ? (mesasOcupadas / totalMesas) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="ms-auto p-2 rounded-pill alert alert-dark">
                {/* Ícono restaurado */}
                <Table size={40} className="icono-institucional-mesas" />
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>

      {/* Pedidos Pendientes */}
      <div className="col-md-3">
        <CondicionCarga
          isLoading={isLoadingPedidosWeb}
          isError={isErrorPedidos}
          mode="single-card"
        >
          <div className="card h-100 card-difuminada difuminado-pedidos overflow-hidden">
            <div className="card-body d-flex align-items-center p-3">
              <div>
                <p className="h6 mb-2">Pedidos Pendientes</p>
                <p className="mb-0 small text-muted">
                  {pedidosPendientes} Pedidos en estado pendiente
                </p>
              </div>
              <div className="ms-auto p-2 rounded-pill alert alert-warning">
                {/* Ícono restaurado */}
                <Clock9 size={40} className="icono-institucional-pedidos" />
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>

      {/* Alertas Almacén */}
      <div className="col-md-3">
        <CondicionCarga
          isLoading={isLoadingAlmacen}
          isError={isErrorAlmacen}
          mode="single-card"
        >
          <div className="card h-100 card-alerta-almacen card-difuminada difuminado-almacen overflow-hidden">
            <div className="card-body d-flex align-items-center p-3">
              <div>
                <p className="h6 mb-2">Alertas Almacen</p>
                <p className="mb-0 small text-muted">
                  {productosBajoStock} productos en bajo stock
                </p>
              </div>
              <div className="ms-auto p-2 rounded-pill alert alert-danger">
                {/* Ícono restaurado */}
                <CircleAlert
                  size={40}
                  className="icono-institucional-almacen"
                />
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>
    </div>
  );
}
