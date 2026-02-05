import React from "react";

export const TicketPedidosWeb = React.forwardRef((props, ref) => {
  const { dataActual } = props;

  // Cálculos de seguridad
  const productos = dataActual?.productos || [];
  const total = dataActual?.total || 0;
  const subtotal = total / 1.18;
  const igv = total - subtotal;
  const codigoPedido = dataActual?.codigo_pedido || "S/N";
  const nombreCliente = dataActual?.nombre_cliente || "Cliente General";
  const numeroCliente = dataActual?.numero_cliente || "-";
  const fecha = dataActual?.fecha || new Date().toLocaleDateString();
  const estadoPago = dataActual?.estado_pago || "Por Pagar";

  return (
    <div
      ref={ref}
      style={{
        width: "68mm",
        padding: "5mm",
        margin: "0",
        color: "black",
        backgroundColor: "white",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {productos.length > 0 && (
        <div className="ticket-container">
          <style>{`
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-top: 5px; }
            .col-cant { width: 15%; font-size: 8pt; }
            .col-desc { width: 55%; font-size: 8pt; overflow: hidden; white-space: nowrap; }
            .col-total { width: 30%; font-size: 8pt; text-align: right; }
            hr { border: none; border-top: 1px dashed black; margin: 5px 0; }
            
            @media print {
              @page { margin: 0; size: auto; }
              body { margin: 0; }
            }
          `}</style>

          <div className="text-center">
            <h2 style={{ margin: "0", fontSize: "12pt" }}>FIRE WOK</h2>
            <p className="bold" style={{ margin: "2px 0", fontSize: "10pt" }}>
              *** PEDIDO WHATSAPP ***
            </p>
          </div>

          <hr />
          <div style={{ fontSize: "8pt" }}>
            <p style={{ margin: "0" }}>PEDIDO: {codigoPedido}</p>
            <p style={{ margin: "0" }}>CLIENTE: {nombreCliente}</p>
            <p style={{ margin: "0" }}>TELÉFONO: {numeroCliente}</p>
          </div>
          <hr />

          <div style={{ fontSize: "8pt" }}>
            <p style={{ margin: "0" }}>FECHA: {fecha}</p>
            <p style={{ margin: "0" }}>
              ESTADO: {estadoPago === "pagado" ? "PAGADO" : "POR PAGAR"}
            </p>
          </div>
          <hr />

          <table>
            <thead>
              <tr style={{ fontSize: "8pt" }}>
                <th className="col-cant" align="left">
                  CANT
                </th>
                <th className="col-desc" align="left">
                  DESCRIPCIÓN
                </th>
                <th className="col-total" align="right">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {productos.map((item, i) => (
                <tr key={i}>
                  <td className="col-cant" valign="top">
                    {item.cantidad || 1}
                  </td>
                  <td className="col-desc" valign="top">
                    {item.nombre?.substring(0, 20) || "Producto"}
                  </td>
                  <td className="col-total" valign="top" align="right">
                    S/. {parseFloat(item.precio || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />
          <div className="text-right" style={{ fontSize: "9pt" }}>
            <p style={{ margin: "1px 0" }}>
              SUBTOTAL: S/ {subtotal.toFixed(2)}
            </p>
            <p style={{ margin: "1px 0" }}>IGV (18%): S/ {igv.toFixed(2)}</p>
            <p style={{ margin: "2px 0", fontSize: "11pt" }} className="bold">
              TOTAL A PAGAR: S/ {total.toFixed(2)}
            </p>
          </div>

          <div
            className="text-center"
            style={{ marginTop: "10px", fontSize: "8pt" }}
          >
            <p style={{ margin: "5px 0" }}>
              Este documento no es un comprobante de pago.
            </p>
            <p style={{ margin: "0" }}>Solicite su Boleta o Factura en Caja.</p>
            <br />
            <p style={{ color: "white" }}>.</p>
          </div>
        </div>
      )}
    </div>
  );
});
