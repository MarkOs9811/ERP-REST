import React from "react";
import { Tag, AlertCircle, ArrowRight, Circle } from "lucide-react";
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
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="fw-solid-card h-100 d-flex flex-column align-items-center justify-content-center p-4">
        <div className="spinner-border text-light mb-2" role="status"></div>
        <span>Cargando promociones...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fw-solid-card h-100 d-flex flex-column align-items-center justify-content-center p-4">
        <AlertCircle size={32} className="text-danger mb-2" />
        <span className="text-center">Error al conectar con promociones.</span>
      </div>
    );
  }

  const campanaActiva = listaCampañas.length > 0 ? listaCampañas[0] : null;

  if (!campanaActiva) {
    return (
      <div className="fw-solid-card h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
        <Tag size={40} className="mb-3 opacity-50" />
        <h4 className="fw-bold mb-2">Sin Campañas Activas</h4>
        <p className="small mb-4 opacity-75">
          Crea una promoción para premiar a tus clientes.
        </p>
        <button
          onClick={() => navigate("/clientes/fidelizacion")}
          className="fw-solid-btn w-100"
        >
          + Lanzar Nueva Campaña
        </button>
      </div>
    );
  }

  return (
    <div className="fw-solid-card h-100 d-flex flex-column p-4">
      {/* Cabecera (Badge) */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="fw-solid-badge d-flex align-items-center gap-2">
          <Tag size={14} /> CAMPAÑA ACTIVA
        </span>
        <span className="fw-solid-counter">
          {listaCampañas.length} disponibles
        </span>
      </div>

      {/* Info Principal */}
      <div className="mb-4">
        <h2 className="fw-solid-title mb-2">
          {campanaActiva.nombre || "PROMOCIÓN"}
        </h2>
        <p className="fw-solid-subtitle mb-3">
          {campanaActiva.descuento
            ? `${campanaActiva.descuento}% de descuento aplicado en sistema`
            : "Promoción especial para clientes"}
        </p>

        <div className="d-flex align-items-center gap-2">
          <span className="fw-solid-label">Código cupón:</span>
          <span className="fw-solid-code">
            {campanaActiva.codigo_cupon || "CUPON"}
          </span>
        </div>
      </div>

      <hr className="fw-solid-divider" />

      {/* Detalles y Estado */}
      <div className="d-flex justify-content-between align-items-center mb-auto mt-2">
        <div>
          <span className="fw-solid-label d-block mb-1">Validez hasta:</span>
          <span className="fw-solid-value fw-bold">
            {formatearFecha(campanaActiva.fecha_fin)}
          </span>
        </div>
        <div className="text-end">
          <span className="fw-solid-label d-block mb-1">Estado:</span>
          <span className="fw-solid-status d-flex align-items-center gap-1 justify-content-end">
            <Circle size={10} fill="currentColor" /> Activo
          </span>
        </div>
      </div>

      {/* Botón Acción (Fijado al fondo gracias al mb-auto de arriba) */}
      <button
        onClick={() => navigate("/clientes/fidelizacion")}
        className="fw-solid-btn w-100 mt-4"
      >
        + Lanzar Nueva Campaña
      </button>
    </div>
  );
}
