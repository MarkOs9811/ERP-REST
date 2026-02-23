import React from "react";

export const TicketsPedido = React.forwardRef((props, ref) => {
  const { venta } = props;

  // Extraemos los datos según la estructura que devuelve tu Backend
  const productos = venta?.pedidoRegistro || [];
  const nota = venta?.nota || ""; // <--- Extraemos la nota del objeto 'data'

  return (
    <div
      ref={ref}
      style={{
        width: "68mm",
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
                font-size: 10pt; 
                line-height: 1.2;
                margin: 0;
              }
              .text-center { text-align: center; }
              .bold { font-weight: bold; }
              hr { border: none; border-top: 1px dashed black; margin: 4px 0; width: 100%; }
              table { width: 100%; border-collapse: collapse; }
              .col-cant { width: 20%; font-weight: bold; font-size: 11pt; }
              .col-desc { width: 80%; }
              
              /* Estilo para el recuadro de nota */
              .nota-box {
                border: 1px solid black;
                padding: 5px;
                margin-top: 10px;
                background-color: #f0f0f0; /* Un gris tenue para resaltar en pantalla */
              }

              @page { margin: 0; size: auto; }
            }
          `}</style>

          <div className="text-center">
            <h2 style={{ margin: "0", fontSize: "14pt" }}>FIRE WOK</h2>
            <h3 style={{ margin: "0", fontSize: "12pt" }} className="bold">
              ORDEN DE COCINA
            </h3>
            <p style={{ margin: "2px 0", fontSize: "11pt" }} className="bold">
              MESA: {productos[0]?.idMesa || "---"}
            </p>
          </div>

          <hr />
          <div style={{ fontSize: "9pt" }}>
            <p style={{ margin: "0" }}>FECHA: {new Date().toLocaleString()}</p>
            <p style={{ margin: "0" }}>TIPO: ATENCIÓN EN MESA</p>
          </div>
          <hr />

          <table>
            <thead>
              <tr style={{ fontSize: "9pt", borderBottom: "1px solid black" }}>
                <th className="col-cant" align="left">
                  CANT
                </th>
                <th className="col-desc" align="left">
                  DESCRIPCIÓN
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "10pt" }}>
              {productos.map((prod, i) => (
                <tr key={i} style={{ borderBottom: "1px dashed #ccc" }}>
                  <td
                    className="col-cant"
                    valign="top"
                    style={{ padding: "4px 0" }}
                  >
                    {prod.cantidad}
                  </td>
                  <td
                    className="col-desc"
                    valign="top"
                    style={{ padding: "4px 0" }}
                  >
                    {(prod.plato?.nombre || "Plato").toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SECCIÓN DE NOTA: Solo se muestra si existe una nota */}
          {nota && (
            <div className="nota-box">
              <p
                className="bold"
                style={{
                  margin: "0",
                  fontSize: "9pt",
                  borderBottom: "1px solid black",
                }}
              >
                NOTA:
              </p>
              <p
                style={{
                  margin: "5px 0 0 0",
                  fontSize: "11pt",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {nota}
              </p>
            </div>
          )}

          <hr />

          <div
            className="text-center"
            style={{ marginTop: "15px", fontSize: "9pt" }}
          >
            <p className="bold" style={{ margin: "0" }}>
              *** FIN DE PEDIDO ***
            </p>
            <br />
            <p style={{ margin: "0" }}>.</p>
          </div>
        </div>
      )}
    </div>
  );
});
