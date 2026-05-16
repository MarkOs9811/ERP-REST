import {
  TrendingUp,
  Users,
  Ticket,
  CircleDollarSign,
  CalendarDays,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatearFecha } from "../../utils/formatearFechas";
import "../../css/estilosClientes/EstiloCampanas.css";

export function EstadisticasCampana({ campana }) {
  if (!campana) return null;

  const usados = campana.usados || 0;
  const limite = campana.limite_uso;
  const disponibles = limite ? limite - usados : "∞";
  const porcentajeUso =
    limite && limite > 0 ? ((usados / limite) * 100).toFixed(0) : 0;
  const isAgotado = limite && disponibles <= 0;

  return (
    <div className="estadisticas-container p-4">
      {/* Header con nombre y estado */}
      <div className="mb-4 pb-3 border-bottom">
        <h4 className="fw-bold text-dark mb-1">{campana.nombre}</h4>
        <p className="text-muted small mb-0">
          {campana.tipo === "cupon"
            ? "Campaña de Cupón"
            : "Programa de Beneficios"}
        </p>
      </div>

      {/* Sección 1: Detalles del Cupón */}
      <div className="mb-4">
        <h6 className="fw-bold text-secondary mb-3">Información del Cupón</h6>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="info-card bg-light rounded p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Ticket size={16} className="text-secondary" />
                <span className="text-muted small fw-bold">CÓDIGO</span>
              </div>
              <p className="fw-bold text-dark mb-0 text-uppercase">
                {campana.codigo_cupon}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="info-card bg-light rounded p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <CircleDollarSign size={16} className="text-secondary" />
                <span className="text-muted small fw-bold">DESCUENTO</span>
              </div>
              <p className="fw-bold text-dark mb-0">
                {campana.tipo_descuento === "porcentaje"
                  ? `-${campana.valor_descuento}%`
                  : `- S/ ${campana.valor_descuento}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 2: Condiciones */}
      <div className="mb-4">
        <h6 className="fw-bold text-secondary mb-3">Condiciones</h6>
        <div className="row g-3">
          {campana.monto_minimo_compra > 0 && (
            <div className="col-md-6">
              <div className="info-card bg-light rounded p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CircleDollarSign size={16} className="text-secondary" />
                  <span className="text-muted small fw-bold">
                    COMPRA MÍNIMA
                  </span>
                </div>
                <p className="fw-bold text-dark mb-0">
                  S/ {campana.monto_minimo_compra}
                </p>
              </div>
            </div>
          )}
          <div className="col-md-6">
            <div className="info-card bg-light rounded p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <CalendarDays size={16} className="text-secondary" />
                <span className="text-muted small fw-bold">VIGENCIA</span>
              </div>
              <p className="text-dark mb-0 small">
                <strong>{formatearFecha(campana.fecha_inicio)}</strong> al{" "}
                <strong>{formatearFecha(campana.fecha_fin)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 3: Estadísticas de Uso */}
      <div className="mb-4">
        <h6 className="fw-bold text-secondary mb-3">Estadísticas de Uso</h6>

        {/* Barras de Estadísticas */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="stat-card bg-light rounded p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span className="text-muted small fw-bold">
                    USOS REALIZADOS
                  </span>
                </div>
                <span className="badge bg-success">{usados}</span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${limite ? (usados / limite) * 100 : 0}%` }}
                  aria-valuenow={usados}
                  aria-valuemin="0"
                  aria-valuemax={limite || 100}
                ></div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className={`stat-card rounded p-3 ${isAgotado ? "bg-danger-subtle" : "bg-light"}`}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <TrendingUp
                    size={16}
                    className={isAgotado ? "text-danger" : "text-info"}
                  />
                  <span
                    className={`text-muted small fw-bold ${isAgotado ? "text-danger" : ""}`}
                  >
                    DISPONIBLES
                  </span>
                </div>
                <span
                  className={`badge ${isAgotado ? "bg-danger" : "bg-info"}`}
                >
                  {disponibles}
                </span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div
                  className={`progress-bar ${isAgotado ? "bg-danger" : "bg-info"}`}
                  role="progressbar"
                  style={{
                    width: `${limite ? ((limite - usados) / limite) * 100 : 100}%`,
                  }}
                  aria-valuenow={disponibles}
                  aria-valuemin="0"
                  aria-valuemax={limite || 100}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de Porcentaje */}
        {limite && (
          <div className="alert alert-info mb-0 d-flex align-items-center gap-2">
            <AlertCircle size={18} />
            <span>
              Se ha utilizado el <strong>{porcentajeUso}%</strong> del límite
              total (<strong>{usados}</strong> de <strong>{limite}</strong>{" "}
              usos)
            </span>
          </div>
        )}
      </div>

      {/* Sección 4: Estado de la Campaña */}
      <div className="mb-0">
        <h6 className="fw-bold text-secondary mb-3">Estado</h6>
        <div className="info-card bg-light rounded p-3">
          <div className="d-flex align-items-center justify-content-between">
            <span className="text-muted small fw-bold">ESTADO ACTUAL</span>
            <span
              className={`badge ${campana.estado ? "bg-success" : "bg-warning"}`}
            >
              {campana.estado ? "ACTIVA" : "INACTIVA"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
