import React from "react";
import "../../css/EstilosIconoCargando.css";
import { AlertTriangle } from "lucide-react";

export function CondicionCarga({
  isLoading,
  isError,
  children,
  mode = "default",
  errorMessage = "No se pudo cargar la información.",
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-0">
              <div className="skeleton-card min-h-32 rounded-xl p-3">
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
        className="flex min-h-[200px] w-full flex-col items-center justify-center p-5"
        style={{ minHeight: "200px" }}
      >
        <div className="modern-spinner"></div>
        <span className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Cargando...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-0 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-destructive shadow-sm">
        <AlertTriangle className="mt-1 shrink-0" size={18} />
        <div>
          <div className="text-sm font-semibold">No se pudo cargar la información</div>
          <div className="mt-1 text-sm">{errorMessage}</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
