import React, { useMemo } from "react";

export const TicketPreVenta = React.forwardRef((props, ref) => {
  const { dataActual } = props;

  // 1. SOLUCIÓN CANTIDAD: Agrupar items iguales por ID de plato
  const itemsAgrupados = useMemo(() => {
    if (!dataActual || !Array.isArray(dataActual)) return [];

    const agrupados = {};

    dataActual.forEach((item) => {
      // Usamos el ID del plato para identificar duplicados
      const idPlato = item.plato?.id || item.idPlato;

      if (!agrupados[idPlato]) {
        // Si no existe, lo creamos clonando el item
        agrupados[idPlato] = {
          ...item,
          cantidad: Number(item.cantidad), // Asegurar que sea número
          // Guardamos precio base para cálculos
          precioUnitario: parseFloat(item.plato?.precio || 0),
        };
      } else {
        // Si ya existe, sumamos la cantidad
        agrupados[idPlato].cantidad += Number(item.cantidad);
      }
    });

    return Object.values(agrupados);
  }, [dataActual]);

  // Cálculos totales usando la lista YA AGRUPADA
  const total = itemsAgrupados.reduce(
    (acc, item) => acc + item.cantidad * item.precioUnitario,
    0,
  );

  const subtotal = total / 1.18;
  const igv = total - subtotal;

  // Datos de cabecera (tomamos del primer item original si existe)
  const mesa =
    (Array.isArray(dataActual) && dataActual[0]?.mesa?.numero) || "S/N";
  const mozo =
    (Array.isArray(dataActual) && dataActual[0]?.usuario?.name) || "General";

  return (
    <div
      ref={ref}
      style={{
        width: "72mm", // Aumenté un poco para asegurar márgenes
        padding: "2mm",
        margin: "0",
        color: "black",
        backgroundColor: "white",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {itemsAgrupados.length > 0 && (
        <div className="ticket-container">
          <style>{`
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 5px; 
            }
            
            td, th { vertical-align: top; padding-top: 2px; }

            .col-cant { 
                width: 12%; 
                font-size: 9pt; 
                text-align: center;
            }
            
            /* 2. SOLUCIÓN TEXTO CORTADO */
            .col-desc { 
                width: 58%; 
                font-size: 8pt; 
                /* Quitamos nowrap y hidden para permitir salto de línea */
                white-space: normal; 
                word-wrap: break-word;
                line-height: 1.1; 
                padding-right: 5px;
            }
            
            .col-total { 
                width: 30%; 
                font-size: 9pt; 
                text-align: right; 
            }
            
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
            <p style={{ margin: "0", fontSize: "10pt", fontWeight: "bold" }}>
              MESA: {mesa}
            </p>
          </div>

          <hr />
          <div style={{ fontSize: "8pt" }}>
            <p style={{ margin: "0" }}>FECHA: {new Date().toLocaleString()}</p>
            <p style={{ margin: "0" }}>MOZO: {mozo}</p>
          </div>
          <hr />

          <table>
            <thead>
              <tr style={{ fontSize: "8pt", borderBottom: "1px solid #000" }}>
                <th className="col-cant">CANT</th>
                <th className="col-desc" align="left">
                  DESCRIPCIÓN
                </th>
                <th className="col-total" align="right">
                  IMPORTE
                </th>
              </tr>
            </thead>
            <tbody>
              {itemsAgrupados.map((item, i) => (
                <tr key={i}>
                  <td className="col-cant">{item.cantidad}</td>
                  <td className="col-desc">
                    {/* Renderizamos nombre completo sin cortar */}
                    {item.plato?.nombre}
                  </td>
                  <td className="col-total">
                    {(item.precioUnitario * item.cantidad).toFixed(2)}
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
            <p style={{ margin: "4px 0", fontSize: "12pt" }} className="bold">
              TOTAL: S/ {total.toFixed(2)}
            </p>
          </div>

          <div
            className="text-center"
            style={{ marginTop: "15px", fontSize: "8pt" }}
          >
            <p style={{ margin: "0" }}>No válido como comprobante.</p>
            <p style={{ margin: "0" }}>Solicite su comprobante en Caja.</p>
            <br />
            <p style={{ color: "white" }}>.</p>
          </div>
        </div>
      )}
    </div>
  );
});
