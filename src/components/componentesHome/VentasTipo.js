import { LayoutPanelTop } from "lucide-react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger, faTruckFast } from "@fortawesome/free-solid-svg-icons";

export function VentasTipo({ load, error, ventasList }) {
  // Obtener el mes y año actual
  const currentMonth = new Date().getMonth() + 1; // Los meses en JavaScript son 0-indexados
  const currentYear = new Date().getFullYear();

  // Contar los pedidos para "llevar" y "mesa" del presente mes
  let totalPedidosLlevar = 0;
  let totalPedidosMesa = 0;

  ventasList.forEach((venta) => {
    if (venta.pedido) {
      const { tipoVenta, detalle_pedidos, fechaPedido } = venta.pedido;

      // Verificar que el pedido sea del presente mes
      const fechaPedidoDate = new Date(fechaPedido);
      const esDelMesActual =
        fechaPedidoDate.getMonth() + 1 === currentMonth &&
        fechaPedidoDate.getFullYear() === currentYear;

      if (esDelMesActual) {
        if (tipoVenta === "llevar" && Array.isArray(detalle_pedidos)) {
          totalPedidosLlevar += detalle_pedidos.length; // Contar los platos en detalle_pedidos
        } else if (tipoVenta === "mesa" && Array.isArray(detalle_pedidos)) {
          totalPedidosMesa += detalle_pedidos.length; // Contar los platos en detalle_pedidos
        }
      }
    }
  });

  // Filtrar las ventas por web del presente mes
  const ventasWebMes =
    ventasList?.filter((venta) => {
      const fechaVenta = new Date(venta.fechaVenta);
      return (
        venta.idPedidoWeb !== null && // idPedidoWeb no es null
        fechaVenta.getMonth() + 1 === currentMonth && // Mismo mes
        fechaVenta.getFullYear() === currentYear // Mismo año
      );
    }) || []; // Asegúrate de que sea un array

  // Contar las ventas por web
  const totalVentasWeb = ventasWebMes.length || 0;
  return (
    <div className="card bg-transparent h-100">
      <div className="row g-3 h-100">
        <div className="col-md-12 col-sm-12 ">
          <CondicionCarga isLoading={load} isError={error}>
            <div className="card shadow-sm h-100 card-pedidos-web overflow-hidden">
              <div className="card-header-web position-relative"></div>
              <div className="card-body text-auto position-relative d-flex flex-column justify-content-center align-items-center ">
                <div className="ico-bagde resumen-mes-pedidos-web">
                  <LayoutPanelTop color={"white"} />
                </div>
                <div className="text-center ">
                  <p className="h2 fw-bold">{totalVentasWeb}</p>
                  <p className="h6">Pedidos Web</p>
                  <small>Este Mes</small>
                </div>
              </div>
            </div>
          </CondicionCarga>
        </div>
        <div className="col-md-12 col-sm-12 ">
          <CondicionCarga isLoading={load} isError={error}>
            <div className="card shadow-sm h-100 card-pedido-llevar overflow-hidden">
              <div className="card-header-llevar position-relative"></div>
              <div className="card-body text-auto position-relative d-flex flex-column justify-content-center align-items-center">
                <div className="ico-bagde resumen-mes-pedidos-llevar">
                  <FontAwesomeIcon icon={faTruckFast} />
                </div>
                <div className="text-center ">
                  <p className="h2 fw-bold">{totalPedidosLlevar}</p>
                  <p className="h6">Pedidos Llevar</p>
                  <small>Este Mes</small>
                </div>
              </div>
            </div>
          </CondicionCarga>
        </div>
        <div className="col-md-12 col-sm-12 h-100">
          <CondicionCarga isLoading={load} isError={error}>
            <div className="card shadow-sm  card-pedido-mesa overflow-hidden">
              <div className="card-header-mesa position-relative"></div>
              <div className="card-body text-auto position-relative d-flex flex-column justify-content-center align-items-center">
                <div className="ico-bagde resumen-mes-pedidos-mesa">
                  <FontAwesomeIcon icon={faBurger} />
                </div>
                <div className="text-center ">
                  <p className="h2 fw-bold">{totalPedidosMesa}</p>
                  <p className="h6">Pedidos Mesa</p>
                  <small>Este Mes</small>
                </div>
              </div>
            </div>
          </CondicionCarga>
        </div>
      </div>
    </div>
  );
}
