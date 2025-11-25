import React from "react";
import { useNavigate } from "react-router-dom";
// Importamos iconos de Lucide relacionados con comida y productos
import {
  UtensilsCrossed,
  Soup,
  Tags,
  ArrowRight,
  PackageSearch,
} from "lucide-react";

export function StepPlatosProductos() {
  const navigate = useNavigate();

  const handleGoToProductos = () => {
    // Ajusta la ruta a donde gestionas tus platos/productos
    navigate("/platos");
  };

  return (
    <div className="card p-0 text-center border-0 shadow-sm animate-fade-in overflow-hidden">
      {/* 1. CARD HEADER: Tema Naranja (Comida/Creatividad) */}
      <div className="card-header py-4 position-relative border-0 m-0">
        {/* Fondo degradado suave Naranja/Melocotón */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 p-0"
          style={{
            background: "linear-gradient(to bottom, #ffcdcdff, #ffffff)", // Un naranja pastel muy suave
            opacity: 1,
          }}
        />

        <div className="position-relative z-1">
          {/* Imagen Principal (3D Food Icon) */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" // Icono de Hamburguesa/Comida 3D
            alt="Menú y Productos"
            className="mb-2"
            style={{
              width: "100px",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
            }}
          />

          {/* Icono Flotante (Badge) */}
          <div className="position-absolute top-100 start-50 translate-middle mt-2">
            <div className="bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
              <UtensilsCrossed
                className="text-danger" // Color rojo/naranja
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
        <h3 className="fw-bold text-dark mb-3 mt-2">Arma tu Menú o Catálogo</h3>

        {/* Descripción */}
        <p
          className="text-muted mx-auto mb-4"
          style={{ maxWidth: "580px", fontSize: "1.1rem" }}
        >
          Dale vida a tu negocio. Crea tus <b>Categorías</b> (ej.{" "}
          <i>Entradas, Bebidas</i>) y registra tus <b>Platos o Productos</b>.
          Define precios, fotos y controla el stock para empezar a tomar
          pedidos.
        </p>

        {/* 3. Beneficios (Pills) */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <Tags className="me-2 text-danger" size={18} />
            <span className="small fw-bold">Categorías</span>
          </div>

          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <Soup className="me-2 text-danger" size={18} />
            <span className="small fw-bold">Carta Digital</span>
          </div>

          <div className="d-flex align-items-center text-secondary bg-light px-3 py-2 rounded-pill border">
            <PackageSearch className="me-2 text-danger" size={18} />
            <span className="small fw-bold">Control de Stock</span>
          </div>
        </div>

        {/* 4. Botones de Acción */}
        <div className="d-flex gap-3 justify-content-center align-items-center mb-2">
          {/* Botón Principal (Estilo Naranja Vibrante) */}
          <button
            type="button"
            className="btn-guardar w-auto text-white btn-lg px-5 py-3 rounded-pill shadow d-inline-flex align-items-center gap-2"
            style={{
              background: "linear-gradient(90deg, #fd7e14, #dc3545)", // Gradiente Naranja a Rojo
              border: "none",
              transition: "transform 0.2s",
            }}
            onClick={handleGoToProductos}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Crear Menú / Productos
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-4 text-muted small">
          Paso 4 de 5 para completar la configuración
        </div>
      </div>
    </div>
  );
}
