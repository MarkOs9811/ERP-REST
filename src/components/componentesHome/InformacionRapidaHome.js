import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GetMesas } from "../../service/GetMesas";
import { GetAlmacen } from "../../service/serviceAlmacen/GetAlmacen";
import { getPedidosPendientes } from "../../service/GetPedidosPendientes";
import { CircleAlert, Clock9, Store, Table } from "lucide-react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function InformacionRapidaHome() {
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
  const mesasOcupadas = mesasArray.filter((mesa) => Number(mesa.estado) === 0)
    .length;
  const totalMesas = mesasArray.length;

  const productosBajoStock = Array.isArray(almacen)
    ? almacen.filter((producto) => producto.cantidad <= 5).length
    : 0;

  const pedidosPendientes = Array.isArray(pedidosWeb) ? pedidosWeb.length : 0;

  return (
    <div className="row g-3">
      <div className="col-12 col-sm-6 col-xl-3">
        <CondicionCarga
          isLoading={isLoadingVentas}
          isError={isErrorVentas}
          mode="single-card"
        >
          <div className="card h-100 card-difuminada difuminado-ventas overflow-hidden">
            <div className="card-body d-flex align-items-center">
              <div>
                <p className="mb-1 metric-card-title">Ventas Hoy</p>
                <p className="mb-0 text-dark h2 fw-bold metric-card-value">
                  S/ {ventasHoyFormatted}
                </p>
              </div>
              <div className="ms-auto metric-icon-badge metric-icon-badge--ventas">
                <Store size={32} className="icono-institucional-ventas" />
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>

      <div className="col-12 col-sm-6 col-xl-3">
        <CondicionCarga
          isLoading={isLoadingMesas}
          isError={isErrorMesas}
          mode="single-card"
        >
          <div className="card h-100 card-difuminada difuminado-mesas overflow-hidden">
            <div className="card-body d-flex align-items-center">
              <div className="w-100 me-2">
                <p className="mb-1 metric-card-title">Mesas Ocupadas</p>
                <p className="mb-0 text-dark h2 fw-bold metric-card-value">
                  {mesasOcupadas}/{totalMesas}
                </p>
                <div className="progress mt-2" style={{ height: "5px" }}>
                  <div
                    className="progress-bar barra-institucional-mesas"
                    style={{
                      width: `${
                        totalMesas > 0 ? (mesasOcupadas / totalMesas) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="ms-auto metric-icon-badge metric-icon-badge--mesas">
                <Table size={32} className="icono-institucional-mesas" />
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>

      <div className="col-12 col-sm-6 col-xl-3">
        <CondicionCarga
          isLoading={isLoadingPedidosWeb}
          isError={isErrorPedidos}
          mode="single-card"
        >
          <div className="card h-100 card-difuminada difuminado-pedidos overflow-hidden">
            <div className="card-body d-flex align-items-center">
              <div>
                <p className="mb-1 metric-card-title">Pedidos Pendientes</p>
                <p className="mb-0 text-dark h2 fw-bold metric-card-value">
                  {pedidosPendientes}
                </p>
                <p className="mb-0 small text-muted metric-card-copy">
                  En estado pendiente
                </p>
              </div>
              <div className="ms-auto metric-icon-badge metric-icon-badge--pedidos">
                <Clock9 size={32} className="icono-institucional-pedidos" />
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>

      <div className="col-12 col-sm-6 col-xl-3">
        <CondicionCarga
          isLoading={isLoadingAlmacen}
          isError={isErrorAlmacen}
          mode="single-card"
        >
          <div className="card h-100 card-difuminada difuminado-almacen overflow-hidden">
            <div className="card-body d-flex align-items-center">
              <div>
                <p className="mb-1 metric-card-title">Alertas Almacén</p>
                <p className="mb-0 text-dark h2 fw-bold metric-card-value">
                  {productosBajoStock}
                </p>
                <p className="mb-0 small text-muted metric-card-copy">
                  Productos en bajo stock
                </p>
              </div>
              <div className="ms-auto metric-icon-badge metric-icon-badge--almacen">
                <CircleAlert
                  size={32}
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
