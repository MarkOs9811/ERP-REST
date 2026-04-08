import {
  FileText,
  Plus,
  Phone,
  Mail,
  User,
  Search,
  Eye,
  PowerOff,
  Trash2,
  Edit2,
  Power,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetUsuarios } from "../../service/GetUsuarios";
import "../../css/estilosDelivery/EstilosRepartidores.css";

import ModalRight from "../../components/componentesReutilizables/ModalRight";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
import { FormAddRepartidor } from "../../components/componenteDelivery/FormAddRepartidor";
import { FormEditRepartidor } from "../../components/componenteDelivery/FormEditRepartidor";
import { PutData } from "../../service/CRUD/PutData";
import { DeleteData } from "../../service/CRUD/DeleteData";
import { useNavigate } from "react-router-dom";

export function Repartidores() {
  const {
    data: repartidores,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repartidores"],
    queryFn: GetUsuarios,
  });

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [repartidorSelected, setRepartidorSelected] = useState(null);

  const [showModalActivar, setShowModalActivar] = useState(false);
  const [repartidorAccion, setRepartidorAccion] = useState(null);

  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [repartidorDelete, setRepartidorDelete] = useState(null);

  const handleToggleEstado = async (id) => {
    const nuevoEstado = repartidorAccion?.estado == 1 ? 0 : 1;
    const exito = await PutData("delivery/repartidores-estado", id, {
      estado: nuevoEstado,
    });
    if (exito) {
      queryClient.invalidateQueries(["repartidores"]);
      return true;
    }
    return false;
  };

  const handleDeleteRepartidor = async (id) => {
    const exito = await DeleteData("delivery/repartidores", id);
    if (exito) {
      queryClient.invalidateQueries(["repartidores"]);
      return true;
    }
    return false;
  };

  const usuariosRepartidores = repartidores
    ? repartidores.filter(
        (usuario) => usuario?.empleado?.cargo?.nombre === "delivery",
      )
    : [];

  return (
    <div className="container-fluid p-0">
      <div className="card rounded-4">
        {/* HEADER DE LA VISTA */}
        <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3">
          <div className="d-flex align-items-center">
            <h4 className="card-title mb-0 titulo-card-especial">
              Panel de Repartidores
              <span className="badge-header">
                {usuariosRepartidores.length} activos
              </span>
            </h4>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0 align-items-center ms-auto">
            <div className="header-search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar repartidor..."
                className="form-control"
              />
            </div>
            <button
              className="btn btn-outline-dark px-3"
              title="Generar Reporte Completo"
            >
              <FileText size={18} />
              <span className="d-none d-sm-inline">Reporte</span>
            </button>
            <button
              className="btn btn-primary px-3"
              title="Agregar Nuevo Repartidor"
              onClick={() => {
                navigate("/rrhh");
              }}
            >
              <Plus size={18} />
              <span className="d-none d-sm-inline">Agregar</span>
            </button>
          </div>
        </div>

        {/* BODY CON EL LISTADO HORIZONTAL (GRID DE BOOTSTRAP 5) */}
        <div className="card-body p-4">
          <div className="row g-3">
            {isLoading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted mt-2 small">
                  Sincronizando la flota...
                </p>
              </div>
            ) : error ? (
              <div className="col-12">
                <div className="alert alert-danger shadow-sm border-0 small">
                  Error al cargar repartidores: {error.message}
                </div>
              </div>
            ) : usuariosRepartidores.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted fs-5">
                  No hay repartidores registrados actualmente.
                </p>
              </div>
            ) : (
              usuariosRepartidores.map((repartidor) => (
                /* AQUÍ ESTÁ LA CLAVE: col-md-6 (2 por fila en tablet) col-xl-4 o col-xl-3 (3 o 4 por fila en desktop) */
                <div className="col-12 col-md-6 col-xl-4" key={repartidor.id}>
                  <div className="card h-100  bg-white ">
                    {/* Rejilla interna simplificada con Flexbox puro */}
                    <div className="card-body p-3 d-flex align-items-center gap-3">
                      {/* 1. Avatar fijo a la izquierda */}
                      <div className="position-relative flex-shrink-0">
                        <div className="avatar-circle-horizontal">
                          <User size={24} strokeWidth={1.5} />
                        </div>
                        <div
                          className={`status-indicator-horizontal ${repartidor.estado == 1 ? "bg-success" : "bg-danger"}`}
                          title={
                            repartidor.estado == 1
                              ? "Activo/Conectado"
                              : "Inactivo"
                          }
                        ></div>
                      </div>

                      {/* 2. Información central fluida */}
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6
                            className="mb-0 fw-bold text-truncate"
                            title={`${repartidor.empleado.persona.nombre} ${repartidor.empleado.persona.apellidos}`}
                          >
                            {repartidor.empleado.persona.nombre}{" "}
                            {repartidor.empleado.persona.apellidos}
                          </h6>
                        </div>

                        <div className="mb-2">
                          <span
                            className="badge bg-success bg-opacity-10  border border-success border-opacity-25 rounded-pill px-2 py-1"
                            style={{ fontSize: "0.65rem" }}
                          >
                            Motorizado
                          </span>
                        </div>

                        <div
                          className="d-flex flex-column gap-1 text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <div className="d-flex align-items-center gap-2 text-truncate">
                            <Phone
                              size={12}
                              className="text-secondary flex-shrink-0"
                            />
                            <span className="text-truncate">
                              {repartidor?.empleado?.persona?.telefono ||
                                "Sin registro"}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2 text-truncate">
                            <Mail
                              size={12}
                              className="text-secondary flex-shrink-0"
                            />
                            <span
                              className="text-truncate"
                              title={repartidor.email}
                            >
                              {repartidor.email || "Sin correo"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Acciones alineadas a la derecha */}
                      <div className="d-flex justify-content-center align-items-center flex-shrink-0 gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary p-2"
                          title="Editar Repartidor"
                          onClick={() => {
                            setRepartidorSelected(repartidor);
                            setIsModalEditOpen(true);
                          }}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className={`btn btn-sm  p-2 ${repartidor.estado == 1 ? "btn-outline-danger" : "btn-outline-success"}`}
                          title={
                            repartidor.estado == 1
                              ? "Desactivar Repartidor"
                              : "Activar Repartidor"
                          }
                          onClick={() => {
                            setRepartidorAccion(repartidor);
                            setShowModalActivar(true);
                          }}
                        >
                          {repartidor.estado == 0 ? (
                            <Power size={18} />
                          ) : (
                            <PowerOff size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL PARA EDITAR REPARTIDOR */}
      <ModalRight
        isOpen={isModalEditOpen}
        onClose={() => {
          setIsModalEditOpen(false);
          setRepartidorSelected(null);
        }}
        title="Editar Repartidor"
        subtitulo="Modifica la información de contacto y vehículo"
        hideFooter={true}
        width="450px"
      >
        {({ handleClose }) => (
          <FormEditRepartidor
            onClose={handleClose}
            repartidor={repartidorSelected}
          />
        )}
      </ModalRight>

      {/* MODAL PARA CONFIRMAR ACTIVAR/DESACTIVAR */}
      <ModalAlertQuestion
        show={showModalActivar}
        handleCloseModal={() => {
          setShowModalActivar(false);
          setRepartidorAccion(null);
        }}
        handleEliminar={handleToggleEstado}
        idEliminar={repartidorAccion?.id}
        nombre={
          repartidorAccion
            ? `${repartidorAccion.empleado?.persona?.nombre} ${repartidorAccion.empleado?.persona?.apellidos}`
            : ""
        }
        pregunta={`¿Estás seguro de ${repartidorAccion?.estado == 1 ? "desactivar" : "activar"}`}
        tipo="el repartidor"
      />
    </div>
  );
}
