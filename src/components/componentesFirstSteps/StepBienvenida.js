import React from "react";
import { Rocket, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export function StepBienvenida({ onStart }) {
  const empresa = JSON.parse(localStorage.getItem("empresa")) || {};

  return (
    // Agregamos overflow-hidden para que la imagen respete los bordes redondeados
    <div className="card text-center border-0 shadow-sm rounded-0 overflow-hidden">
      {/* 1. CABECERA TIPO PORTADA */}
      <div className="position-relative bg-light" style={{ height: "200px" }}>
        {/* IMAGEN: Accedemos directamente desde la raíz / */}
        <img
          src="/images/fondo_subMenu.svg"
          alt="Fondo bienvenida"
          className="w-100 h-100"
          style={{ objectFit: "cover", opacity: 0.85 }} // object-fit recorta la imagen sin deformarla
        />

        {/* Overlay opcional para oscurecer un poco la imagen si el texto no se lee */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(0,0,0,0.1))",
          }}
        ></div>
        {/* 2. ICONO FLOTANTE (Con margen negativo para subirlo) */}
        <div
          className="d-inline-flex justify-content-center align-items-center bg-white rounded-circle shadow p-4 position-relative"
          style={{
            marginTop: "-60px", // Esto hace que suba y tape la imagen
            width: "100px",
            height: "100px",
            zIndex: 10,
          }}
        >
          <Rocket size={48} className="text-danger floating-icon" />
        </div>
      </div>

      <div className="card-body px-4 pb-5">
        {/* Estilos de animación en línea para el cohete */}
        <style>
          {`
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
                100% { transform: translateY(0px); }
            }
            .floating-icon { animation: float 3s ease-in-out infinite; }
            `}
        </style>

        {/* 3. TÍTULO */}
        <h2 className="mt-5 mb-3 fw-bold">
          ¡Bienvenido a <br />
          <span
            style={{
              background: "linear-gradient(90deg, #fd0d0d, #f0270d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {empresa.nombre || "Tu Plataforma"}
          </span>
          !
        </h2>

        <p
          className="lead text-muted mb-4 mx-auto"
          style={{ maxWidth: "600px", fontSize: "1.1rem" }}
        >
          Estamos listos para despegar. Hemos preparado un asistente rápido para
          configurar los cimientos de tu negocio en minutos.
        </p>

        {/* 4. BENEFICIOS */}
        <div className="row justify-content-center mb-5 g-2">
          {["Configuración Guiada", "Gestión Eficiente", "Soporte 24/7"].map(
            (item, index) => (
              <div key={index} className="col-auto">
                <div className="d-flex align-items-center bg-light border px-3 py-2 rounded-pill">
                  <CheckCircle2 size={16} className="text-success me-2" />
                  <span className="fw-bold text-secondary small">{item}</span>
                </div>
              </div>
            )
          )}
        </div>

        {/* 5. BOTÓN DE ACCIÓN */}
        <div className="mb-4">
          <button
            onClick={onStart}
            className="btn-guardar btn-lg px-5 py-3 rounded-pill shadow fw-bold d-inline-flex align-items-center gap-2 hover-scale"
            style={{
              border: "none",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ¡Comencemos!
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
