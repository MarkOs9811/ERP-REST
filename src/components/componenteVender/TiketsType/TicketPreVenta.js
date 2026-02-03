import React from "react";

export const TicketPreVenta = React.forwardRef((props, ref) => {
  const { dataActual } = props;

  // Cálculos de seguridad
  const items = Array.isArray(dataActual) ? dataActual : [];
  const total = items.reduce(
    (acc, item) => acc + parseFloat(item.plato?.precio || 0),
    0,
  );
  const subtotal = total / 1.18;
  const igv = total - subtotal;
  const mesa = items[0]?.mesa?.numero || "S/N";
  const mozo = items[0]?.usuario?.name || "General";

  return (
    <div
      ref={ref}
      style={{
        width: "68mm",
        padding: "5mm", // Añadimos un poco de padding real
        margin: "0",
        color: "black",
        backgroundColor: "white",
        fontFamily: "'Courier New', Courier, monospace", // Fuente fuera del style tag
      }}
    >
      {items.length > 0 && (
        <div className="ticket-container">
          {/* Mantenemos el style para ajustes finos, pero quitamos el @media print para la estructura base */}
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
              *** PRE-CUENTA ***
            </p>
            <p style={{ margin: "0", fontSize: "9pt" }}>MESA: {mesa}</p>
          </div>

          <hr />
          <div style={{ fontSize: "8pt" }}>
            <p style={{ margin: "0" }}>FECHA: {new Date().toLocaleString()}</p>
            <p style={{ margin: "0" }}>MOZO: {mozo}</p>
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
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="col-cant" valign="top">
                    1
                  </td>
                  <td className="col-desc" valign="top">
                    {item.plato?.nombre?.substring(0, 20)}
                  </td>
                  <td className="col-total" valign="top" align="right">
                    {parseFloat(item.plato?.precio || 0).toFixed(2)}
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
