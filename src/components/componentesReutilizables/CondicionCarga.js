import React from "react";
import "../../css/EstilosIconoCargando.css";
import { AlertTriangle } from "lucide-react";

export function CondicionCarga({
  isLoading,
  isError,
  children,
  mode = "default", // 'default' | 'cards' | 'single-card' <--- NUEVO
}) {
  if (isLoading) {
    // === NUEVO MODO: SINGLE CARD (Para widgets individuales) ===
    if (mode === "single-card") {
      return (
        <div className="skeleton-card p-3 h-100 w-100 ">
          {/* Estructura interna igual, pero SIN el loop map() y SIN col-md-3 */}
          <div className="skeleton-bar skeleton-title"></div>
          <div className="skeleton-bar skeleton-text"></div>
          <div className="skeleton-bar skeleton-text-short"></div>
          <div className="shimmer-overlay"></div>
        </div>
      );
    }

    // === MODO: GRID DE TARJETAS (Para listados completos como Mesas) ===
    if (mode === "cards") {
      return (
        <div className="row g-3 ">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-12 col-md-6 col-lg-3">
              <div className="skeleton-card p-3">
                <div className="skeleton-bar skeleton-title"></div>
                <div className="skeleton-bar skeleton-text"></div>
                <div className="skeleton-bar skeleton-text-short"></div>
                <div className="shimmer-overlay"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // === MODO: DEFAULT (SPINNER) ===
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center p-5 w-100 p-2"
        style={{ minHeight: "200px" }}
      >
        <div className="modern-spinner"></div>
        <span className="mt-3 text-muted fw-bold small text-uppercase letter-spacing-2">
          Cargando...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger d-flex align-items-center m-0 p-3 shadow-sm border-0 rounded-3">
        <AlertTriangle className="me-2 flex-shrink-0" size={20} />
        <div>
          <small className="fw-bold">Error</small>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
