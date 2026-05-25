import { Printer } from "lucide-react";
import { TicketImpresion } from "../componenteVender/TiketsType/TicketImpresion";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import "../../css/estilosVentas/EstilosDetallesVentas.css"; // <-- Importamos los estilos Fire Wok

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
    pedido?.detalle_pedidos ||
    dataVentas?.pedido_web?.detalles_pedido ||
    dataVentas?.detalle_pedidos_web ||
    [];

  const documento = boleta
    ? `Boleta B001-${boleta.numero}`
    : factura
      ? `Factura F001-${factura.numero}`
      : "Documento no disponible";

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const ventaParaImpresion = {
    tipo_comprobante: boleta
      ? "BOLETA DE VENTA"
      : factura
        ? "FACTURA"
        : "TICKET DE VENTA",
    serie_correlativo: documento,
    fecha: fechaVenta,
    cliente: {
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
    observacion: pedido?.observaciones || dataVentas?.observacion || "",
  };

  if (!dataVentas) return <div className="fw-loading">Cargando...</div>;

  return (
    <div className="container fw-modal-wrapper">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-start fw-header-section">
        <div>
          <h4 className="fw-title">Venta #{id}</h4>
          <span className="fw-badge-doc">{documento}</span>
        </div>
      </div>

      {/* Grid de Información General */}
      <div className="row fw-info-grid">
        <div className="col-12 col-md-6 d-flex flex-column fw-info-col">
          <span className="fw-label">Fecha</span>
          <span className="fw-value">{fechaVenta}</span>
        </div>
        <div className="col-12 col-md-6 d-flex flex-column fw-info-col">
          <span className="fw-label">Vendedor</span>
          <span className="fw-value">{usuario?.correo || "N/A"}</span>
        </div>
        <div className="col-12 col-md-6 d-flex flex-column fw-info-col">
          <span className="fw-label">Método de pago</span>
          <span className="fw-value">{metodo_pago?.nombre || "N/A"}</span>
        </div>
        <div className="col-12 col-md-6 d-flex flex-column fw-info-col">
          <span className="fw-label">Tipo de venta</span>
          <span className="fw-value">{pedido?.tipoVenta || "N/A"}</span>
        </div>
      </div>

      {/* Detalle de productos */}
      <div className="fw-table-section">
        <h5 className="fw-subtitle">Detalle de productos</h5>
        <div className="fw-table-container">
          <table className="fw-custom-table">
            <thead>
              <tr>
                <th className="fw-align-left">Producto</th>
                <th className="fw-align-center">Cantidad</th>
                <th className="fw-align-right">Precio Unitario</th>
                <th className="fw-align-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detallePedidos.map((item) => {
                const precio =
                  parseFloat(item.precio_unitario) ||
                  parseFloat(item.plato?.precio) ||
                  0;
                const subtotal = (item.cantidad * precio).toFixed(2);

                return (
                  <tr key={item.id}>
                    <td className="fw-align-left fw-product-name">
                      {item.producto?.nombre ||
                        item.plato?.nombre ||
                        "Desconocido"}
                    </td>
                    <td className="fw-align-center fw-product-qty">
                      {item.cantidad}
                    </td>
                    <td className="fw-align-right">S/ {precio.toFixed(2)}</td>
                    <td className="fw-align-right fw-product-sub">
                      S/ {subtotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totales */}
      <div className="d-flex justify-content-end fw-totals-section">
        <div className="fw-totals-box">
          <div className="d-flex justify-content-between fw-total-row">
            <span className="fw-label">Subtotal:</span>
            <span className="fw-value">
              S/ {parseFloat(subTotal).toFixed(2)}
            </span>
          </div>
          <div className="d-flex justify-content-between fw-total-row">
            <span className="fw-label">IGV:</span>
            <span className="fw-value">S/ {parseFloat(igv).toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between fw-total-row">
            <span className="fw-label">Descuento:</span>
            <span className="fw-value">
              S/ {parseFloat(descuento).toFixed(2)}
            </span>
          </div>
          <div className="d-flex justify-content-between fw-total-final">
            <span>Total:</span>
            <span>S/ {parseFloat(total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="d-flex justify-content-end fw-actions-section">
        <button onClick={() => handlePrint()} className="fw-btn-print">
          <Printer size={18} />
          <span>Imprimir Ticket</span>
        </button>

        <div style={{ display: "none" }}>
          <TicketImpresion ref={componentRef} venta={ventaParaImpresion} />
        </div>
      </div>
    </div>
  );
}
