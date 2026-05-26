import React from "react";
import { Ticket, Megaphone, AlertCircle, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // Importamos para la navegación
import { GetCampañaPromos } from "../../service/accionesClientes/GetCampañaPromos";

export function CuponActivoHome() {
  const navigate = useNavigate(); // Inicializamos la navegación

  const {
    data: listaCampañas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["campanasPromos"],
    queryFn: GetCampañaPromos,
    refetchOnWindowFocus: false,
  });

  // ESTADOS DE CARGA/ERROR (Diseño Minimal)
  if (isLoading) {
    return (
      <div className="fw-main-promo-card d-flex flex-column align-items-center justify-content-center p-4 text-muted">
        <div
          className="spinner-border spinner-border-sm text-secondary mb-2"
          role="status"
        ></div>
        <span className="small">Cargando...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fw-main-promo-card d-flex flex-column align-items-center justify-content-center p-4 text-danger">
        <AlertCircle size={24} className="mb-2" />
        <span className="small text-center">
          Error al conectar con promociones.
        </span>
      </div>
    );
  }

  const campanaActiva = listaCampañas.length > 0 ? listaCampañas[0] : null;

  // ESTADO VACÍO (Diseño Minimal)
  if (!campanaActiva) {
    return (
      <div className="fw-main-promo-card d-flex flex-column align-items-center justify-content-center p-4">
        <div className="bg-light rounded-circle p-3 mb-3">
          <Ticket size={28} className="text-secondary opacity-50" />
        </div>
        <h6 className="fw-bold text-dark mb-3">Sin Campañas Activas</h6>
        <button
          onClick={() => navigate("/clientes/fidelizacion")}
          className="btn btn-outline-dark btn-sm fw-medium d-flex align-items-center gap-2"
        >
          Ir a Fidelización <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  // ESTADO 4: Mapeo exacto de Image 7 (¡Ahora sí!)
  return (
    <div className="card card-cuponer-home border h-100 w-100 p-4">
      {/* 1. Header Area (Crema) */}
      <div className="fw-promo-header-area">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <Megaphone size={18} style={{ color: "#ff992c" }} />
            <h6
              className="m-0 fw-bold text-dark"
              style={{ letterSpacing: "-0.3px" }}
            >
              Campaña Activa
            </h6>
          </div>

          <button
            onClick={() => navigate("/clientes/fidelizacion")}
            className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-1"
            style={{ color: "#777", fontSize: "0.8rem", fontWeight: "500" }}
          >
            Ver Todas <ArrowRight size={14} />
          </button>
        </div>

        <div className="mb-2">
          <h4
            className="fw-bold text-dark mb-1"
            style={{ letterSpacing: "-0.5px" }}
          >
            {campanaActiva.nombre || "FELICES FIESTAS"}
          </h4>
          <p className="small text-muted mb-0">
            Válido hasta el {campanaActiva.fecha_fin || "2026-06-30"}
          </p>
        </div>
      </div>

      {/* 2. Dotted Promo Box */}
      <div className="fw-dotted-promo-box d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <Ticket size={26} style={{ color: "#ff992c" }} />
          <div>
            <h4
              className="m-0 fw-bold text-dark mb-1"
              style={{ letterSpacing: "1px" }}
            >
              {campanaActiva.codigo_cupon || "FELIZ28"}
            </h4>
            <span
              className="small fw-semibold"
              style={{ color: "var(--fw-emerald, #10b981)" }}
            >
              {campanaActiva.descuento
                ? `${campanaActiva.descuento}% Dcto.`
                : "Promoción"}
            </span>
          </div>
        </div>

        <div>
          <span className="fw-badge-activo">Activo</span>
        </div>
      </div>
    </div>
  );
}
