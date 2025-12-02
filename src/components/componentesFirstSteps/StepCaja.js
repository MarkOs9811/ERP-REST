import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Importamos iconos de Lucide relacionados con dinero y ventas
import {
  CircleDollarSign,
  Receipt,
  LockKeyhole,
  ArrowRight,
  Store,
} from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";

export function StepCaja({ onFinish }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const cambiarEstado = async (estado) => {
    setLoading(true); // Bloqueamos el botón para que no den doble click
    navigate("/ventas/cajas");
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
    <div className="card p-0 text-center border-0 shadow-sm animate-fade-in overflow-hidden">
      {/* 1. CARD HEADER: Tema Dorado (Dinero) */}
      <div className="card-header py-4 position-relative border-0 m-0">
        {/* Fondo degradado suave Ámbar/Dorado */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 p-0"
          style={{
            background: "linear-gradient(to bottom, #fff8e1, #ffffff)", // Un crema/dorado muy suave
            opacity: 1,
          }}
        />

        <div className="position-relative z-1">
          {/* Imagen Principal */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/2454/2454282.png" // Icono de Caja Registradora 3D
            alt="Caja Registradora"
            className="mb-2"
            style={{
              width: "90px",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
            }}
          />

          {/* Icono Flotante (Badge) */}
          <div className="position-absolute top-100 start-50 translate-middle mt-2">
            <div className="bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
              <CircleDollarSign
                className="text-warning"
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
        <h3 className="fw-bold text-dark mb-3 mt-2">Crea tu Punto de Venta</h3>

        {/* Descripción Mejorada */}
        <p
          className="text-muted mx-auto mb-4"
          style={{ maxWidth: "580px", fontSize: "1.1rem" }}
        >
          Para empezar a facturar, necesitas definir{" "}
          <b>dónde ingresa el dinero</b>. Crea tu primera Caja (ej.{" "}
          <i>"Caja Principal"</i> o <i>"Barra"</i>) para controlar ventas,
          cortes de turno y movimientos de efectivo de forma segura.
        </p>

        {/* 3. Beneficios (Pills) */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <Store className="me-2 text-warning" size={18} />
            <span className="small fw-bold">Facturación</span>
          </div>

          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <Receipt className="me-2 text-warning" size={18} />
            <span className="small fw-bold">Cortes y Arqueos</span>
          </div>

          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <LockKeyhole className="me-2 text-warning" size={18} />
            <span className="small fw-bold">Seguridad</span>
          </div>
        </div>

        {/* 4. Botones de Acción */}
        <div className="d-flex gap-3 justify-content-center align-items-center mb-2">
          {/* Botón Principal (Estilo Dorado/Ámbar) */}
          <button
            type="button"
            onClick={() => cambiarEstado(3)}
            className="btn-guardar w-auto text-white btn-lg px-5 py-3 rounded-pill shadow d-inline-flex align-items-center gap-2"
            style={{
              background: "linear-gradient(90deg, #f59e0b, #d97706)", // Gradiente Ámbar
              border: "none",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Ir a Crear Caja
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-4 text-muted small">
          Paso 3 de 5 para completar la configuración
        </div>
      </div>
    </div>
  );
}
