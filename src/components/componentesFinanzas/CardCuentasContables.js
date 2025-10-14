export function CardCuentaContable({ nombreCuenta, items }) {
  const cuenta = items[0]?.cuenta || {};
  const grupoCuenta = cuenta.grupoCuenta || {};
  const cuentaCerrada = cuenta.estado === 0;

  return (
    <div className="col-md-4 p-3 rounded-0 border-0">
      <div
        className={`card card-cuentasContables p-3 position-relative ${
          cuentaCerrada ? "cuenta-cerrada" : ""
        }`}
      >
        <div className={cuentaCerrada ? "cuenta-bloqueada-contenido" : ""}>
          <div className="card-header d-flex justify-content-between align-items-center rounded-0 card-cuenta-libro">
            <div
              className="d-flex align-items-center"
              style={{ fontSize: 12, borderLeft: "2px solid rgb(0, 112, 216)" }}
            >
              <span className="text-primary fw-bold mx-2">
                {grupoCuenta.codigo}
              </span>
              <small className="text-primary fw-bold me-2">Grupo</small>
            </div>
            <div className="text-center flex-grow-1">
              <p className="card-subtitle text-muted mb-0">{cuenta.codigo}</p>
              <h6 className="mb-0">{nombreCuenta}</h6>
            </div>
            <div style={{ width: 30 }}></div>
          </div>
          <div className="card-body registrosCuenta-Cuerpo">
            <div className="row">
              <div
                className="col-md-6"
                style={{ borderRight: "2px solid #063855" }}
              >
                <h6>DEBE</h6>
                {items.map((item, idx) => (
                  <div className="mb-2" key={idx}>
                    <span title={`${item.descripcion} - ${item.fecha}`}>
                      S/ {Number(item.debe).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="col-md-6 text-end">
                <h6>HABER</h6>
                {items.map((item, idx) => (
                  <div className="mb-2" key={idx}>
                    <span title={`${item.descripcion} - ${item.fecha}`}>
                      S/ {Number(item.haber).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card-footer text-muted">
            <div className="row">
              <div className="col-md-6">
                <strong>Total:</strong> S/{" "}
                {items.reduce((acc, i) => acc + Number(i.debe), 0).toFixed(2)}
              </div>
              <div className="col-md-6 text-end">
                <strong>Total:</strong> S/{" "}
                {items.reduce((acc, i) => acc + Number(i.haber), 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        {/* Overlay para cuenta cerrada */}
        {cuentaCerrada ? (
          <div className="cuenta-cerrada-overlay">
            <div className="text-center cuenta-cerrada-mensaje">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 48, color: "rgb(63, 63, 63)" }}
              >
                lock
              </span>
              <h2 className="text-dark">Cuenta Cerrada</h2>
              <button
                type="button"
                className="btn btn-aperturarCuenta btn-sm"
                title="Aperturar Cuenta"
              >
                <span className="material-symbols-outlined">open_in_new</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="row ">
            <div className="col-md-12 text-center">
              <button
                type="button"
                className="btn btn-cerrarCuenta btn-sm"
                title="Cerrar Cuenta"
              >
                <span className="material-symbols-outlined">lock</span>
              </button>
              <button
                type="button"
                className="btn btn-reporteCuenta btn-sm"
                title="Reporte"
              >
                <span className="material-symbols-outlined">analytics</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
