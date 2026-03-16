import { useState } from "react";
import {
  Search,
  FileText,
  Plus,
  Tag,
  Edit2,
  Trash2,
  PowerOff,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetPlatos } from "../../service/GetPlatos";

import "../../css/estilosDelivery/EstilosPromociones.css";
import { FormAddPromocion } from "../../components/componenteDelivery/FormAddPromocion";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { GetData } from "../../service/CRUD/GetData";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";

export function Promociones() {
  // Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Traer los platos (Para pasárselos al formulario)
  const { data: platos } = useQuery({
    queryKey: ["platos"],
    queryFn: GetPlatos,
  });

  // 2. Traer las Promociones REAELS usando tu servicio genérico
  const {
    data: promociones,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["promocionesApp"],
    queryFn: GetData("delivery/promociones"),
  });

  const getBadgeClass = (estado) => {
    return estado === 1 || estado === true || estado === "Activa"
      ? "bg-success text-white border-success"
      : "bg-secondary text-white border-secondary";
  };

  return (
    <div className="container-fluid p-0">
      <div className="card shadow-sm border-0 rounded-4">
        {/* HEADER DE LA VISTA */}
        <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3">
          <div className="d-flex align-items-center">
            <h4 className="card-title mb-0 titulo-card-especial">
              Promociones App
              <span className="badge-header">
                {promociones?.length || 0} registradas
              </span>
            </h4>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0 align-items-center ms-auto">
            <div className="header-search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar promoción..."
                className="form-control"
              />
            </div>

            <button
              className="btn btn-outline-dark px-3"
              title="Reporte"
            >
              <FileText size={18} />
              <span className="d-none d-sm-inline">Reporte</span>
            </button>

            {/* BOTÓN QUE ABRE EL MODAL */}
            <button
              className="btn btn-dark px-3"
              title="Crear Promoción"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              <span className="d-none d-sm-inline">Crear Promo</span>
            </button>
          </div>
        </div>

        {/* BODY (GALERÍA DE PROMOCIONES REALES) */}
        <div className="card-body p-4">
          <CondicionCarga isLoading={isLoading} error={error} mode="cards">
            <div className="row g-4">
              {Array.isArray(promociones) &&
                promociones.map((promo) => (
                  <div className="col-12 col-md-6 col-xl-4" key={promo.id}>
                    <div className="card h-100 promo-card shadow-sm border-0">
                      {/* Banner Image */}
                      <div className="promo-banner-container">
                        <img
                          src={
                            promo.imagen_banner ||
                            "https://via.placeholder.com/500x200?text=Sin+Imagen"
                          }
                          alt={promo.titulo}
                          className="promo-banner"
                        />
                        <span
                          className={`badge border rounded-pill px-3 py-2 promo-badge-status fw-medium ${getBadgeClass(promo.estado)}`}
                        >
                          {promo.estado === 1 ? "Activa" : "Inactiva"}
                        </span>
                      </div>

                      {/* Info de la Promo */}
                      <div className="card-body p-4 pb-2">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Tag
                            size={16}
                            className="text-primary flex-shrink-0"
                          />
                          <h5
                            className="mb-0 fw-bold text-truncate"
                            title={promo.titulo}
                          >
                            {promo.titulo}
                          </h5>
                        </div>

                        <p className="text-muted small mb-3 text-truncate">
                          Plato:{" "}
                          <strong>
                            {promo.plato?.nombre || "Plato no encontrado"}
                          </strong>
                        </p>

                        <div className="d-flex justify-content-between align-items-end mb-3">
                          <div>
                            <span className="price-old d-block">
                              S/ {Number(promo.plato?.precio || 0).toFixed(2)}
                            </span>
                            <span className="price-new d-block">
                              S/ {Number(promo.precio_promocional).toFixed(2)}
                              {promo.porcentaje_descuento && (
                                <span
                                  className="badge bg-danger ms-2"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  -{promo.porcentaje_descuento}%
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="text-end text-muted small">
                            <Calendar size={12} className="me-1 mb-1" />
                            Hasta:{" "}
                            {promo.fecha_fin
                              ? new Date(promo.fecha_fin).toLocaleDateString()
                              : "Sin fecha"}
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="card-footer bg-light border-top-0 p-3 d-flex justify-content-end gap-2">
                        <button className="btn-editar" title="Editar Promoción">
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-desactivar"
                          title={promo.estado === 1 ? "Desactivar" : "Activar"}
                        >
                          <PowerOff size={16} />
                        </button>
                        <button
                          className="btn-eliminar"
                          title="Eliminar Promoción"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CondicionCarga>
        </div>
      </div>

      {/* AQUÍ INVOCAMOS TU MODAL RIGHT */}
      <ModalRight
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Promoción"
        subtitulo="Atrae más clientes con ofertas exclusivas"
        hideFooter={true} // Ocultamos el footer del modal porque el FormAddPromocion ya tiene los botones "Guardar" y "Cancelar"
        width="450px"
      >
        <FormAddPromocion
          onClose={() => setIsModalOpen(false)}
          platos={platos}
        />
      </ModalRight>
    </div>
  );
}
