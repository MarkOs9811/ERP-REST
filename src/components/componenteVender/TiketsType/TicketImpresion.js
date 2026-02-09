import React from "react";

export const TicketImpresion = React.forwardRef(
  (props, ref, cliente = null) => {
    const { venta } = props;

    return (
      <div
        ref={ref}
        style={{
          width: "68mm", // Forzamos 68mm para que entre sobrado en el cabezal de 72mm
          padding: "0",
          margin: "0",
          color: "black",
          backgroundColor: "white",
        }}
      >
        {venta && (
          <div className="ticket-container">
            <style>{`
            @media print {
              .ticket-container { 
                width: 68mm; 
                font-family: 'Courier New', Courier, monospace; 
                font-size: 9pt; 
                line-height: 1.2;
                margin: 0;
              }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .bold { font-weight: bold; }
              hr { border: none; border-top: 1px dashed black; margin: 4px 0; width: 100%; }
              table { width: 100%; border-collapse: collapse; table-layout: fixed; }
              
              /* Anchos de columna fijos para evitar que se desplace el total */
              .col-cant { width: 12%; }
              .col-desc { width: 58%; overflow: hidden; white-space: nowrap; }
              .col-total { width: 30%; text-align: right; }
              
              @page { margin: 0; size: auto; }
            }
          `}</style>

            <div className="text-center">
              <h2 style={{ margin: "0", fontSize: "12pt" }}>
                Restaurante FIRE WOK
              </h2>
              <p style={{ margin: "1px 0" }}>{venta.tipo_comprobante}</p>
              <p className="bold" style={{ margin: "0" }}>
                {venta.serie_correlativo}
              </p>
            </div>

            <hr />
            <div style={{ fontSize: "8pt" }}>
              <p style={{ margin: "0" }}>FECHA: {venta.fecha}</p>
              <h1 style={{ margin: "0", fontSize: "10pt" }}>
                CLIENTE: {venta.cliente?.nombre?.substring(0, 20) || cliente}
              </h1>
              <p style={{ margin: "0" }}>DOC: {venta.cliente?.documento}</p>
            </div>
            <hr />

            <table>
              <thead>
                <tr style={{ fontSize: "8pt" }}>
                  <th className="col-cant" align="left">
                    C
                  </th>
                  <th className="col-desc" align="left">
                    DESCRIPCIÓN
                  </th>
                  <th className="col-total" align="right">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "8pt" }}>
                {venta.productos?.map((prod, i) => (
                  <tr key={i}>
                    <td className="col-cant" valign="top">
                      {prod.cantidad}
                    </td>
                    <td className="col-desc" valign="top">
                      {/* Cortamos el texto para que no empuje el precio fuera del papel */}
                      {(prod.descripcion || prod.nombre).substring(0, 18)}
                    </td>
                    <td className="col-total" valign="top" align="right">
                      {parseFloat(prod.precio_unitario * prod.cantidad).toFixed(
                        2,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ======================================================= */}
            {/* AQUÍ AGREGAMOS LA OBSERVACIÓN O DETALLE EXTRA DEL PEDIDO */}
            {/* ======================================================= */}
            {venta.observacion && (
              <div style={{ marginTop: "5px" }}>
                <hr />
                <div style={{ fontSize: "8pt", fontStyle: "italic" }}>
                  <p className="bold" style={{ margin: "0" }}>
                    NOTAS / OBSERVACIÓN:
                  </p>
                  <p
                    style={{
                      margin: "0",
                      whiteSpace: "normal", // Permite que el texto baje de línea si es largo
                      wordBreak: "break-all", // Evita que palabras muy largas rompan el diseño
                    }}
                  >
                    {venta.observacion}
                  </p>
                </div>
              </div>
            )}
            {/* ======================================================= */}

            <hr />
            <div
              className="text-right"
              style={{ fontSize: "9pt", paddingRight: "2mm" }}
            >
              <p style={{ margin: "1px 0" }}>
                SUBTOTAL: S/ {parseFloat(venta.subtotal).toFixed(2)}
              </p>
              <p style={{ margin: "1px 0" }}>
                IGV (18%): S/ {parseFloat(venta.igv).toFixed(2)}
              </p>
              <p style={{ margin: "2px 0", fontSize: "10pt" }} className="bold">
                TOTAL: S/ {parseFloat(venta.total).toFixed(2)}
              </p>
            </div>

            <div
              className="text-center"
              style={{ marginTop: "10px", fontSize: "8pt" }}
            >
              <p style={{ margin: "0" }}>
                MÉTODO: {venta.metodo_pago?.toUpperCase()}
              </p>
              <p style={{ margin: "5px 0" }}>¡Gracias por su compra!</p>
              <br />
              <p style={{ margin: "0" }}>.</p>{" "}
              {/* Espacio para el corte manual */}
            </div>
          </div>
        )}
      </div>
    );
  },
);
