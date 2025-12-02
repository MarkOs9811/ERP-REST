import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Network, Shield, ArrowRight, Users2 } from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";

export function StepAreaCargo({ onFinish }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const cambiarEstado = async (estado) => {
    setLoading(true); // Bloqueamos el botón para que no den doble click
    navigate("/areas-y-cargos");
    const success = await PutData("empresasSteps", estado);

    if (success) {
      const empresa = JSON.parse(localStorage.getItem("empresa")) || {};
      empresa.setup_steps = estado;
      localStorage.setItem("empresa", JSON.stringify(empresa));

      // 2. Cerramos el modal
      if (onFinish) onFinish();
    }

    setLoading(false);
  };
  return (
    <div className="card text-center border-0 shadow-sm animate-fade-in overflow-hidden">
      {/* 1. CARD HEADER: Imagen e Identidad Visual */}
      <div className="card-header bg-light py-4 position-relative border-0">
        {/* Fondo decorativo sutil */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(to bottom, #f0fff4, #ffffff)", // Gradiente verde muy suave
            opacity: 0.8,
          }}
        ></div>

        <div className="position-relative z-1">
          {/* Imagen Principal */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/2679/2679269.png"
            alt="Estructura Organizacional"
            className="mb-2"
            style={{
              width: "90px",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
            }}
          />

          {/* Icono Flotante Superpuesto (Badge) */}
          <div className="position-absolute top-100 start-50 translate-middle mt-2">
            <div className="bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
              <Network className="text-success" size={28} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. CARD BODY: Contenido */}
      <div className="card-body pt-5 pb-4 px-4">
        {/* Título */}
        <h3 className="fw-bold text-dark mb-3 mt-2">Define tu Estructura</h3>

        {/* Descripción */}
        <p
          className="text-muted mx-auto mb-4"
          style={{ maxWidth: "550px", fontSize: "1.1rem" }}
        >
          Para que tu empresa funcione como un reloj, necesitas orden. Crea tus{" "}
          <span className="text-success fw-bold">Áreas</span> (ej. Cocina,
          Ventas) y asigna sus{" "}
          <span className="text-success fw-bold">Cargos</span> correspondientes
          (ej. Chef, Cajero).
        </p>

        {/* Beneficios (Features) */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <Briefcase className="me-2 text-success" size={18} />
            <span className="small fw-bold">Roles Claros</span>
          </div>

          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <Shield className="me-2 text-success" size={18} />
            <span className="small fw-bold">Seguridad</span>
          </div>

          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <Users2 className="me-2 text-success" size={18} />
            <span className="small fw-bold">Nómina</span>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="mb-2">
          <button
            type="button"
            onClick={() => cambiarEstado(2)}
            className="btn-guardar w-auto btn-lg px-5 py-3 rounded-pill shadow d-inline-flex align-items-center gap-2"
            style={{
              background: "linear-gradient(90deg, #198754, #20c997)",
              border: "none",
              transition: "transform 0.2s",
              textDecoration: "none",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Crear Áreas y Cargos
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-3 text-muted small">
          Paso 2 de 5 para completar la configuración
        </div>
      </div>
    </div>
  );
}
