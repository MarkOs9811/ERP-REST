import { Globe, ShoppingBag, Utensils } from "lucide-react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

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
    <CondicionCarga isLoading={load} isError={error}>
      <div className="d-flex flex-column gap-3">
        {/* Pedidos Web */}
        <div className="d-flex align-items-center p-3 rounded-3 bg-light border border-light">
          <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
            <Globe size={24} />
          </div>
          <div className="flex-grow-1">
            <div className="fw-bold text-dark">Pedidos Web</div>
            <div className="small text-muted">Este mes</div>
          </div>
          <div className="fs-4 fw-bold text-dark">{totalVentasWeb}</div>
        </div>

        {/* Pedidos Llevar */}
        <div className="d-flex align-items-center p-3 rounded-3 bg-light border border-light">
          <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
            <ShoppingBag size={24} />
          </div>
          <div className="flex-grow-1">
            <div className="fw-bold text-dark">Llevar</div>
            <div className="small text-muted">Este mes</div>
          </div>
          <div className="fs-4 fw-bold text-dark">{totalPedidosLlevar}</div>
        </div>

        {/* Pedidos Mesa */}
        <div className="d-flex align-items-center p-3 rounded-3 bg-light border border-light">
          <div className="p-2 bg-success bg-opacity-10 text-success rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
            <Utensils size={24} />
          </div>
          <div className="flex-grow-1">
            <div className="fw-bold text-dark">En Mesa</div>
            <div className="small text-muted">Este mes</div>
          </div>
          <div className="fs-4 fw-bold text-dark">{totalPedidosMesa}</div>
        </div>
      </div>
    </CondicionCarga>
  );
}
