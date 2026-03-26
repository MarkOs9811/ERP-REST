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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPlatos } from "../../service/GetPlatos";

import "../../css/estilosDelivery/EstilosPromociones.css";
import { FormAddPromocion } from "../../components/componenteDelivery/FormAddPromocion";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { GetData } from "../../service/CRUD/GetData";
import { PutData } from "../../service/CRUD/PutData";
import { DeleteData } from "../../service/CRUD/DeleteData";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { FormEditPromocion } from "../../components/componenteDelivery/FormEditPromocion";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";

export function Promociones() {
  // Estado para controlar los modales y el registro seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [promocionSelected, setPromocionSelected] = useState(null);
  const [showModalActivar, setShowModalActivar] = useState(false);
  const [promoAccion, setPromoAccion] = useState(null);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [promoDelete, setPromoDelete] = useState(null);
  const queryClient = useQueryClient();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleToggleEstado = async (id) => {
    const nuevoEstado = promoAccion.estado === 1 ? 0 : 1;
    const exito = await PutData("delivery/promociones", id, { estado: nuevoEstado });
    if (exito) {
      queryClient.invalidateQueries(["promocionesApp"]);
      return true;
    }
    return false;
  };

  const handleDeletePromocion = async (id) => {
    const exito = await DeleteData("delivery/promociones", id);
    if (exito) {
      queryClient.invalidateQueries(["promocionesApp"]);
      return true;
    }
    return false;
  };

  const { data: platos } = useQuery({
    queryKey: ["platos"],
    queryFn: GetPlatos,
  });


  const {
    data: promociones,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["promocionesApp"],
    queryFn: () => GetData("delivery/promociones"),
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
                  <div className="col-12 col-md-6 col-xl-3" key={promo.id}>
                    <div className={`card h-100 promo-card shadow-sm border-secondary overflow-hidden ${promo.estado === 1 ? '' : 'inactiva'}`}>
                      {/* Banner Image */}
                      <div className="promo-banner-container">
                        <img
                          src={
                            BASE_URL + "/storage/" + promo.imagen_banner
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
                            size={18}
                            className="text-danger flex-shrink-0 fw-bold"
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
                        <button
                          className="btn-editar"
                          title="Editar Promoción"
                          onClick={() => {
                            setPromocionSelected(promo);
                            setIsModalEditOpen(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={promo.estado === 1 ? "btn-desactivar" : "btn-activar"}
                          title={promo.estado === 1 ? "Desactivar" : "Activar"}
                          onClick={() => {
                            setPromoAccion(promo);
                            setShowModalActivar(true);
                          }}
                        >
                          <PowerOff size={16} />
                        </button>
                        <button
                          className="btn-eliminar"
                          title="Eliminar Promoción"
                          onClick={() => {
                            setPromoDelete(promo);
                            setShowModalEliminar(true);
                          }}
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

      {/* AQUÍ INVOCAMOS TU MODAL RIGHT PARA AGREGAR */}
      <ModalRight
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Promoción"
        subtitulo="Atrae más clientes con ofertas exclusivas"
        hideFooter={true}
        width="450px"
      >
        <FormAddPromocion
          onClose={() => setIsModalOpen(false)}
          platos={platos}
        />
      </ModalRight>

      {/* AQUÍ INVOCAMOS TU MODAL RIGHT PARA EDITAR */}
      <ModalRight
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        title="Editar Promoción"
        subtitulo="Actualiza los detalles de la oferta"
        hideFooter={true}
        width="450px"
      >
        {({ handleClose }) => (
          <FormEditPromocion
            onClose={handleClose}
            platos={platos}
            promocionSelected={promocionSelected}
          />
        )}
      </ModalRight>

      {/* MODAL PARA CONFIRMAR ACTIVAR/DESACTIVAR */}
      <ModalAlertQuestion
        show={showModalActivar}
        handleCloseModal={() => {
          setShowModalActivar(false);
          setPromoAccion(null);
        }}
        handleEliminar={handleToggleEstado}
        idEliminar={promoAccion?.id}
        nombre={promoAccion?.titulo}
        pregunta={`¿Estás seguro de ${promoAccion?.estado === 1 ? 'desactivar' : 'activar'}`}
        tipo="esta promoción"
      />

      {/* MODAL PARA CONFIRMAR ELIMINAR OPCIÓN DEFINITIVA */}
      <ModalAlertQuestion
        show={showModalEliminar}
        handleCloseModal={() => {
          setShowModalEliminar(false);
          setPromoDelete(null);
        }}
        handleEliminar={handleDeletePromocion}
        idEliminar={promoDelete?.id}
        nombre={promoDelete?.titulo}
        pregunta="¿Estás completamente seguro de ELIMINAR"
        tipo="esta promoción"
      />
    </div>
  );
}
