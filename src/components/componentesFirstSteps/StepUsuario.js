import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Importamos iconos de Lucide relacionados con personas y equipos
import {
  UserPlus,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";

export function StepUsuario({ onFinish }) {
  const navigate = useNavigate();

  const handleGoToUsuarios = () => {
    navigate("/usuarios");
  };
  const [loading, setLoading] = useState(false);

  const handleSkip = async () => {
    setLoading(true); // Bloqueamos el botón para que no den doble click

    const success = await PutData("superadmin/empresasSteps/complete-setup");

    if (success) {
      const empresa = JSON.parse(localStorage.getItem("empresa")) || {};
      empresa.setup_steps = 5;
      localStorage.setItem("empresa", JSON.stringify(empresa));

      // 2. Cerramos el modal
      if (onFinish) onFinish();
    }

    setLoading(false);
  };

  return (
    <div className="card p-0 text-center border-0 rounded-0 shadow-sm animate-fade-in overflow-hidden">
      {/* 1. CARD HEADER: Tema Púrpura (Equipo/Admin) */}
      <div className="card-header py-4 position-relative border-0 m-0">
        {/* Fondo degradado suave Violeta/Lila */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 p-0"
          style={{
            background: "linear-gradient(to bottom, #f3e8ff, #ffffff)", // Lila muy suave
            opacity: 1,
          }}
        />

        <div className="position-relative z-1">
          {/* Imagen Principal (3D Team Icon) */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/3215/3215935.png" // Icono 3D de Colaboración/Team
            alt="Equipo de Trabajo"
            className="mb-2"
            style={{
              width: "100px",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
            }}
          />

          {/* Icono Flotante (Badge) */}
          <div className="position-absolute top-100 start-50 translate-middle mt-2">
            <div className="bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
              <UserPlus
                className="text-primary" // O un color morado personalizado
                style={{ color: "#6f42c1" }} // Púrpura Bootstrap
                size={30}
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. CARD BODY */}
      <div className="card-body pt-5 pb-4 px-4">
        {/* Título */}
        <h3 className="fw-bold text-dark mb-3 mt-2">Tu Equipo de Trabajo</h3>

        {/* Descripción (Enfatizando que es opcional) */}
        <p
          className="text-muted mx-auto mb-4"
          style={{ maxWidth: "580px", fontSize: "1.1rem" }}
        >
          Si tienes colaboradores, regístralos ahora para asignarles roles
          (Cajero, Mozo). Cada usuario tendrá su propio acceso y permisos.{" "}
          <br />
          <span className="fw-semibold text-dark fst-italic">
            ¿Trabajas solo? Puedes saltar este paso.
          </span>
        </p>

        {/* 3. Beneficios (Pills) */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <ShieldCheck
              className="me-2"
              style={{ color: "#6f42c1" }}
              size={18}
            />
            <span className="small fw-bold">Accesos</span>
          </div>

          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <Clock className="me-2" style={{ color: "#6f42c1" }} size={18} />
            <span className="small fw-bold">Turnos</span>
          </div>

          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <CheckCircle2
              className="me-2"
              style={{ color: "#6f42c1" }}
              size={18}
            />
            <span className="small fw-bold">Rendimiento</span>
          </div>
        </div>

        {/* 4. Botones de Acción (Principal y Secundario) */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center mb-2">
          {/* Opción A: Crear Usuario (Principal) */}
          <button
            type="button"
            className="btn-guardar w-auto text-white btn-lg px-5 py-3 rounded-pill shadow d-inline-flex align-items-center gap-2"
            style={{
              background: "linear-gradient(90deg, #6f42c1, #a66efa)", // Gradiente Púrpura
              border: "none",
              transition: "transform 0.2s",
            }}
            onClick={handleGoToUsuarios}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Crear Usuario
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Opción B: Omitir (Secundario/Link) */}
        <div className="mt-3">
          <button
            onClick={handleSkip}
            className="btn text-primary text-decoration-none small"
            disabled={loading}
          >
            {loading
              ? "Finalizando..."
              : "No tengo personal por ahora, finalizar configuración"}
          </button>
        </div>

        <div className="mt-3 text-muted small">Paso 5 de 5 - Último paso</div>
      </div>
    </div>
  );
}
