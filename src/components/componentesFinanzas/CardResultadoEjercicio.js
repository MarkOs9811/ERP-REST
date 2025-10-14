export function CardResultadoEjercicio({ registroEjercicio, resultado }) {
  if (!registroEjercicio) {
    return (
      <div className="alert alert-warning text-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        No se encontró ningún registro de resultados del ejercicio.
      </div>
    );
  }

  return (
    <div className="card shadow-card p-2 border-0">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">
              <i className="fas fa-exchange-alt me-2"></i>
              Resultado del Ejercicio - {registroEjercicio.temporada}
            </h5>
            <small className="text-secondary">
              <i className="fas fa-calendar-alt me-1"></i>
              Desde: {registroEjercicio.fechaInicio} Hasta:{" "}
              {registroEjercicio.fechaFin}
            </small>
          </div>
          <div>
            <button
              className="btn btn-outline-dark p-2 mx-2"
              title="Registros de balances"
            >
              <i className="fa-solid fa-clock-rotate-left"></i> Balances
              anteriores
            </button>
            <button
              className="btn btn-primary p-2"
              style={{
                fontSize: "1rem",
                backgroundColor: "#0e8ee9",
                borderColor: "#0e8ee9",
              }}
              title="Realizar Balance"
            >
              <i className="fa-solid fa-balance-scale"></i> Nuevo Balance
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <p className="card-text text-secondary">
          <i className="fas fa-info-circle me-2"></i>
          Resultados del ejercicio para la temporada{" "}
          {registroEjercicio.temporada}.
        </p>
        <p className="card-text text-secondary">
          <i className="fas fa-calendar-alt me-2"></i>
          Periodo: {registroEjercicio.fechaInicio} a{" "}
          {registroEjercicio.fechaFin}
        </p>
        <div className="row g-3">
          {/* Ingresos */}
          <div className="col-md-6 position-relative">
            <div className="card p-3">
              <p className="card-text text-ingreso">
                <i className="fas fa-arrow-up me-2"></i>
                <strong>Ingresos:</strong>
                <h3 className="text-ingreso">
                  S/.{Number(registroEjercicio.ingresos).toFixed(2)}
                </h3>
              </p>
              <span
                className="material-icons position-absolute"
                style={{
                  fontSize: 60,
                  color: "rgba(40, 95, 167, 0.2)",
                  right: 10,
                  bottom: 10,
                }}
              >
                savings
              </span>
            </div>
          </div>
          {/* Gastos */}
          <div className="col-md-6 position-relative">
            <div className="card p-3">
              <p className="card-text text-danger">
                <i className="fas fa-arrow-down me-2"></i>
                <strong>Gastos:</strong>
                <h3 className="text-danger">
                  S/.{Number(registroEjercicio.gastos).toFixed(2)}
                </h3>
              </p>
              <span
                className="material-icons position-absolute"
                style={{
                  fontSize: 60,
                  color: "rgba(220, 53, 69, 0.2)",
                  right: 10,
                  bottom: 10,
                }}
              >
                account_balance_wallet
              </span>
            </div>
          </div>
        </div>
        <div
          className={`alert text-center ${
            resultado > 0
              ? "alert-primary"
              : resultado < 0
              ? "alert-danger"
              : "alert-secondary"
          }`}
          role="alert"
        >
          <i
            className={`fas me-2 ${
              resultado > 0 ? "fa-smile" : resultado < 0 ? "fa-frown" : "fa-meh"
            }`}
          ></i>
          <strong>Resultado:</strong> {Number(resultado).toFixed(2)}{" "}
          {resultado > 0
            ? "(Beneficio)"
            : resultado < 0
            ? "(Pérdida)"
            : "(Equilibrio)"}
        </div>
      </div>
    </div>
  );
}
