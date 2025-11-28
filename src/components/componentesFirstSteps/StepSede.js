import React from "react";
import { Link } from "react-router-dom";
// 1. Importamos los iconos necesarios de Lucide
import { MapPin, Building2, Store, Users, ArrowRight } from "lucide-react";

export function StepSede() {
  return (
    <div className="card text-center p-3">
      <div className="card-header">
        {/* 1. Cabecera con Banner Vectorial */}
        <div className="mb-4 d-flex justify-content-center align-items-center">
          {/* Aquí iría tu imagen real. He puesto un placeholder visual. */}
          <div style={{ maxWidth: "300px", opacity: 0.9 }}>
            {/* Ejemplo de imagen temporal (puedes borrar esto cuando pongas la tuya) */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/869/869636.png"
              alt="Sede Config"
              style={{ width: "120px" }}
            />
          </div>
        </div>
      </div>
      <div className="card-body">
        {/* 2. Título y Descripción */}
        <h3 className="fw-bold text-dark mb-3 d-flex align-items-center justify-content-center gap-2">
          <MapPin className="text-danger" size={32} strokeWidth={2.5} />
          Establece tu Sede Principal
        </h3>

        <p
          className="text-muted mx-auto mb-4"
          style={{ maxWidth: "550px", fontSize: "1.1rem" }}
        >
          Todo comienza aquí. Antes de contratar personal o vender productos,
          necesitas definir <b>dónde</b> opera tu negocio. Registra la dirección
          y los datos de contacto de tu local principal.
        </p>

        {/* 3. Pequeños iconos informativos (Beneficios) */}
        <div className="d-flex flex-wrap justify-content-center gap-4 mb-5">
          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded shadow-sm">
            <Building2 className="me-2 text-primary" size={20} />
            <span>Control de Stock</span>
          </div>

          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded shadow-sm">
            <Store className="me-2 text-primary" size={20} />
            <span>Punto de Facturación</span>
          </div>

          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded shadow-sm">
            <Users className="me-2 text-primary" size={20} />
            <span>Asignación de Personal</span>
          </div>
        </div>

        {/* 4. Botón de Acción Principal */}
        <Link
          to="/areas-y-cargos" // <--- CORREGIDO: Lógica apunta a crear sedes
          className="btn-guardar btn-lg px-5 shadow py-2 rounded-pill d-inline-flex align-items-center gap-2 w-auto"
          style={{ transition: "transform 0.2s", textDecoration: "none" }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Ir a Crear Sede
          <ArrowRight size={20} />
        </Link>

        <div className="mt-3 text-muted small">
          <small>Paso 1 de 5 para completar la configuración</small>
        </div>
      </div>
    </div>
  );
}
