import { Printer } from "lucide-react";
import { TicketImpresion } from "../componenteVender/TiketsType/TicketImpresion";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";

export function ModalDetallesVentas({ dataVentas }) {
  const {
    id,
    fechaVenta,
    usuario,
    metodo_pago,
    subTotal,
    igv,
    descuento,
    total,
    boleta,
    factura,
    pedido = {},
  } = dataVentas;

  const detallePedidos =
    pedido?.detalle_pedidos || dataVentas?.pedido_web?.detalles_pedido || [];

  const documento = boleta
    ? `Boleta B001-${boleta.numero}`
    : factura
      ? `Factura F001-${factura.numero}`
      : "Documento no disponible";

  // PARA IMPRIMIR
  const componentRef = useRef();

  // 1. Ya no necesitamos el useState(null), porque vamos a mapear los datos directamente.
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // o content: () => componentRef.current (dependiendo de tu versión de react-to-print)
  });

  const ventaParaImpresion = {
    tipo_comprobante: boleta
      ? "BOLETA DE VENTA"
      : factura
        ? "FACTURA"
        : "TICKET DE VENTA",
    serie_correlativo: documento, // Ya lo tienes calculado arriba
    fecha: fechaVenta,
    cliente: {
      // Ajusta las rutas de cliente según cómo venga tu backend
      nombre:
        pedido?.cliente?.nombre ||
        dataVentas?.cliente?.nombre ||
        "Público General",
      documento:
        pedido?.cliente?.documento || dataVentas?.cliente?.documento || "---",
    },
    productos: detallePedidos.map((item) => ({
      cantidad: item.cantidad,
      descripcion: item.producto?.nombre || item.plato?.nombre || "Desconocido",
      precio_unitario:
        parseFloat(item.precio_unitario) || parseFloat(item.plato?.precio) || 0,
    })),
    subtotal: subTotal,
    igv: igv,
    total: total,
    metodo_pago: metodo_pago?.nombre || "N/A",
    observacion: pedido?.observaciones || dataVentas?.observacion || "", // Si manejas observaciones
  };
  if (!dataVentas) return <div>Cargando...</div>;

  return (
    <div className="container py-3">
      {/* Encabezado */}
      <div className="mb-4 border-bottom pb-3">
        <h4 className="fw-bold">Venta #{id}</h4>
        <p className="text-muted mb-1">{documento}</p>
        <ul className="list-unstyled mb-0">
          <li>
            <strong>Fecha:</strong> {fechaVenta}
          </li>
          <li>
            <strong>Vendedor:</strong> {usuario?.correo || "N/A"}
          </li>
          <li>
            <strong>Método de pago:</strong> {metodo_pago?.nombre || "N/A"}
          </li>
          <li>
            <strong>Tipo de venta:</strong> {pedido?.tipoVenta || "N/A"}
          </li>
        </ul>
      </div>

      {/* Detalle de productos */}
      <div className="mb-4">
        <h5 className="mb-3">Detalle de productos</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-end">Precio Unitario</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detallePedidos.map((item) => {
                // Tomar precio desde detalle o desde plato
                const precio =
                  parseFloat(item.precio_unitario) ||
                  parseFloat(item.plato?.precio) ||
                  0;

                const subtotal = (item.cantidad * precio).toFixed(2);

                return (
                  <tr key={item.id}>
                    <td>
                      {item.producto?.nombre ||
                        item.plato?.nombre ||
                        "Desconocido"}
                    </td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end">S/ {precio.toFixed(2)}</td>
                    <td className="text-end">S/ {subtotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totales */}
      <div className="text-end border-top pt-3">
        <p>
          <strong>Subtotal:</strong> S/ {parseFloat(subTotal).toFixed(2)}
        </p>
        <p>
          <strong>IGV:</strong> S/ {parseFloat(igv).toFixed(2)}
        </p>
        <p>
          <strong>Descuento:</strong> S/ {parseFloat(descuento).toFixed(2)}
        </p>
        <p className="h5 fw-bold text-success">
          Total: S/ {parseFloat(total).toFixed(2)}
        </p>
      </div>
      <div className="card-footer mt-4">
        <button
          onClick={() => handlePrint()}
          className="btn btn-outline-primary"
        >
          <Printer size={18} className="me-2" /> Imprimir Ticket
        </button>

        {/* 3. Pasamos el objeto mapeado al ticket oculto */}
        <div style={{ display: "none" }}>
          <TicketImpresion ref={componentRef} venta={ventaParaImpresion} />
        </div>
      </div>
    </div>
  );
}
