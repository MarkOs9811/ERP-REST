import React from "react";
import { Tag, AlertCircle, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GetCampañaPromos } from "../../service/accionesClientes/GetCampañaPromos";

export function CuponActivoHome() {
  const navigate = useNavigate();

  const {
    data: listaCampañas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["campanasPromos"],
    queryFn: GetCampañaPromos,
    refetchOnWindowFocus: false,
  });

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Sin fecha";
    return new Date(fechaString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading || isError) {
    return (
      <div className="fw-promo-card align-items-center justify-content-center text-center">
        {isLoading ? (
          <div
            className="spinner-border text-secondary mb-2"
            role="status"
          ></div>
        ) : (
          <AlertCircle size={32} className="text-danger mb-2" />
        )}
        <span className="fw-promo-text">
          {isLoading ? "Cargando..." : "Error de conexión"}
        </span>
      </div>
    );
  }

  const campanaActiva = listaCampañas.length > 0 ? listaCampañas[0] : null;

  if (!campanaActiva) {
    return (
      <div className="fw-promo-card align-items-center justify-content-center text-center">
        <Tag size={40} className="mb-3 text-muted opacity-50" />
        <h4 className="fw-promo-title mb-2">Sin Campañas</h4>
        <p className="fw-promo-text mb-4">
          Crea una promoción para premiar a tus clientes.
        </p>
        <button
          onClick={() => navigate("/clientes/fidelizacion")}
          className="fw-btn-action fw-btn-emerald w-100 mt-auto"
        >
          + Nueva Campaña
        </button>
      </div>
    );
  }

  return (
    <div className="fw-promo-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-badge fw-badge-emerald">
          <Tag size={14} /> Campaña Activa
        </span>
        <span className="small text-muted">
          {listaCampañas.length} disponibles
        </span>
      </div>

      <h2 className="fw-promo-title">
        {campanaActiva.nombre || "Promoción Especial"}
      </h2>
      <p className="fw-promo-text mb-3">
        {campanaActiva.descuento
          ? `${campanaActiva.descuento}% de descuento aplicado`
          : "Beneficio especial activo"}
      </p>

      <div className="d-flex align-items-center justify-content-between mb-3 bg-light p-2 rounded">
        <span className="small text-muted fw-bold">Cupón:</span>
        <span className="fw-promo-code">
          {campanaActiva.codigo_cupon || "CUPON"}
        </span>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
        <div>
          <span className="d-block small text-muted">Vence el:</span>
          <span className="fw-bold text-dark">
            {formatearFecha(campanaActiva.fecha_fin)}
          </span>
        </div>
        <div className="text-end">
          <span
            className="d-flex align-items-center gap-1 fw-bold"
            style={{ color: "var(--fw-emerald)", fontSize: "0.9rem" }}
          >
            <Circle size={10} fill="currentColor" /> Activo
          </span>
        </div>
      </div>
    </div>
  );
}
