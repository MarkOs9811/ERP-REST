import React from "react";

export const TicketCerrarCaja = React.forwardRef((props, ref) => {
  const { cajaData } = props;

  // 1. Validamos que exista data
  if (!cajaData) return <div ref={ref}></div>;

  // 2. Extraemos valores generales
  const montoInicial = parseFloat(cajaData.montoInicial || 0);
  const totalVentas = parseFloat(cajaData.totalVenta || 0);
  const totalEnCaja = montoInicial + totalVentas;

  const usuario = cajaData.usuario?.name || "Cajero";
  // Manejo seguro de fechas
  const fecha = cajaData.fechaApertura || new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString();

  // 3. AGRUPACIÓN CORRECTA (Aquí estaba el detalle)
  // Usamos 'metodoPago' para coincidir con tu backend
  const resumenMetodos = cajaData.detallesVenta?.reduce((acc, venta) => {
    // Normalizamos el nombre (todo a mayúsculas para evitar duplicados tipo "Yape" vs "yape")
    // Intentamos leer metodoPago (camelCase) o metodo_pago (snake_case) por seguridad
    const metodoRaw = venta.metodoPago || venta.metodo_pago || "OTROS";
    const metodo = metodoRaw.toUpperCase();

    const monto = parseFloat(venta.total || 0);

    // Sumamos al acumulador
    acc[metodo] = (acc[metodo] || 0) + monto;
    return acc;
  }, {});

  return (
    <div
      ref={ref}
      style={{
        width: "72mm",
        padding: "5mm",
        margin: "0",
        backgroundColor: "white",
        color: "black",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <div className="ticket-container">
        <style>{`
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .bold { font-weight: bold; }
          hr { border: none; border-top: 1px dashed black; margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; font-size: 9pt; }
          td, th { padding: 2px 0; }
          
          @media print {
            @page { margin: 0; size: auto; }
            body { margin: 0; }
          }
        `}</style>

        {/* --- ENCABEZADO --- */}
        <div className="text-center">
          <h2 style={{ margin: 0, fontSize: "16pt" }}>FIRE WOK</h2>
          <p className="bold" style={{ fontSize: "12pt", margin: "5px 0" }}>
            *** CIERRE DE CAJA ***
          </p>
          <p style={{ fontSize: "9pt", margin: 0 }}>CAJERO: {usuario}</p>
          <p style={{ fontSize: "9pt", margin: 0 }}>
            FECHA: {fecha} - {hora}
          </p>
        </div>

        <hr />

        {/* --- RESUMEN GENERAL --- */}
        <div style={{ fontSize: "11pt" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>FONDO INICIAL:</span>
            <span>S/ {montoInicial.toFixed(2)}</span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="bold"
          >
            <span>+ VENTAS DEL DÍA:</span>
            <span>S/ {totalVentas.toFixed(2)}</span>
          </div>
          <hr />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13pt",
            }}
            className="bold"
          >
            <span>TOTAL EN CAJA:</span>
            <span>S/ {totalEnCaja.toFixed(2)}</span>
          </div>
        </div>

        <hr />

        {/* --- DESGLOSE POR MÉTODO (Aquí se verá la suma agrupada) --- */}
        <p
          className="text-center bold"
          style={{ margin: "5px 0", fontSize: "10pt" }}
        >
          RESUMEN POR MEDIO DE PAGO
        </p>
        <table style={{ fontSize: "10pt" }}>
          <tbody>
            {resumenMetodos &&
              Object.keys(resumenMetodos).map((metodo, i) => (
                <tr key={i}>
                  <td style={{ textTransform: "uppercase" }}>{metodo}</td>
                  <td className="text-right">
                    S/ {resumenMetodos[metodo].toFixed(2)}
                  </td>
                </tr>
              ))}
            {/* Fila de control para verificar que sume el total de ventas */}
            <tr style={{ borderTop: "1px dashed #000" }}>
              <td className="bold">TOTAL VENTAS</td>
              <td className="text-right bold">S/ {totalVentas.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <hr />

        {/* --- DETALLE DE OPERACIONES --- */}
        <p
          className="text-center bold"
          style={{ margin: "5px 0", fontSize: "10pt" }}
        >
          DETALLE DE OPERACIONES
        </p>
        <table>
          <thead>
            <tr style={{ borderBottom: "1px solid black" }}>
              <th align="left">PEDIDO</th>
              <th align="center">MÉTODO</th>
              <th align="right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {cajaData.detallesVenta?.map((item, i) => (
              <tr key={i}>
                <td align="left">#{item.pedido || item.idPedido}</td>
                <td
                  align="center"
                  style={{ fontSize: "8pt", textTransform: "uppercase" }}
                >
                  {/* Aseguramos usar la misma propiedad que en el cálculo */}
                  {(item.metodoPago || item.metodo_pago)?.substring(0, 10)}
                </td>
                <td align="right">{parseFloat(item.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />
        <br />
        <br />
        <div className="text-center">
          <p>__________________________</p>
          <p>FIRMA DEL CAJERO</p>
          <p>{usuario}</p>
        </div>
        <br />
        <p className="text-center">.</p>
      </div>
    </div>
  );
});
