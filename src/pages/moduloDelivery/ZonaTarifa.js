import {
  Search,
  FileText,
  Plus,
  MapPin,
  Settings,
  Clock,
  HeartHandshake,
  Map,
  AlertCircle,
  PowerOff,
  Trash2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import "../../css/estilosDelivery/EstilosZonasTarifas.css";
import { GetSedes } from "../../service/accionesAreasCargos/GetSedes";

import ModalRight from "../../components/componentesReutilizables/ModalRight";
import ModalAlertQuestion from "../../components/componenteToast/ModalAlertQuestion";
import { FormAddConfigTarifa } from "../../components/componenteDelivery/FormAddConfigTarifa";
import { FormEditConfigTarifa } from "../../components/componenteDelivery/FormEditConfigTarifa";
import { PutData } from "../../service/CRUD/PutData";
import { DeleteData } from "../../service/CRUD/DeleteData";

export function ZonaTarifa() {
  const {
    data: sedes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sedesConfiguracion"],
    queryFn: GetSedes,
  });

  const queryClient = useQueryClient();

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [sedeForAdd, setSedeForAdd] = useState(null);

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [configSelected, setConfigSelected] = useState(null);

  const [showModalActivar, setShowModalActivar] = useState(false);
  const [configAccion, setConfigAccion] = useState(null);

  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [configDelete, setConfigDelete] = useState(null);

  const handleToggleEstado = async (id) => {
    const nuevoEstado = configAccion?.estado == 1 ? 0 : 1;
    const exito = await PutData("delivery/zona-tarifa-estado", id, { estado: nuevoEstado });
    if (exito) {
      queryClient.invalidateQueries(["sedesConfiguracion"]);
      return true;
    }
    return false;
  };

  const handleDeleteConfig = async (id) => {
    const exito = await DeleteData("delivery/zona-tarifa", id);
    if (exito) {
      queryClient.invalidateQueries(["sedesConfiguracion"]);
      return true;
    }
    return false;
  };

  return (
    <div className="container-fluid p-0">
      <div className="card shadow-sm border-0 rounded-4">
        {/* HEADER DE LA VISTA */}
        <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3">
          <div className="d-flex align-items-center">
            <h4 className="card-title mb-0 titulo-card-especial">
              Zonas y Tarifas
              <span className="badge-header">
                {sedes?.length || 0} sedes
              </span>
            </h4>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0 align-items-center ms-auto">
            <div className="header-search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar sede..."
                className="form-control"
              />
            </div>
            <button className="btn btn-outline-dark px-3">
              <FileText size={18} />
              <span className="d-none d-sm-inline">Reporte</span>
            </button>

          </div>
        </div>

        {/* BODY CON EL LISTADO DE SEDES Y SUS CONFIGURACIONES */}
        <div className="card-body p-4">
          <div className="row g-4">
            {isLoading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted mt-2 small">
                  Cargando configuraciones...
                </p>
              </div>
            ) : error ? (
              <div className="col-12">
                <div className="alert alert-danger shadow-sm border-0 small">
                  Error al cargar las sedes: {error.message}
                </div>
              </div>
            ) : sedes?.length == 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted fs-5">
                  No hay sedes registradas en la empresa.
                </p>
              </div>
            ) : (
              sedes.map((sede) => {
                // Laravel suele devolver las relaciones en snake_case al pasarlas a JSON
                const config =
                  sede.configuracion_delivery || sede.configuracionDelivery;

                // Procesar propinas (por si vienen como string JSON desde la BD)
                let propinas = [];
                try {
                  propinas =
                    config && typeof config.propinas_sugeridas == "string"
                      ? JSON.parse(config.propinas_sugeridas)
                      : config?.propinas_sugeridas || [];
                } catch (e) {
                  propinas = [];
                }

                return (
                  <div className="col-12 col-xl-6" key={sede.id}>
                    <div className={`card h-100 sede-config-card shadow-sm border ${config && config.estado !== 1 ? 'bg-light' : ''}`}>
                      {/* Cabecera de la Tarjeta (Datos de la Sede) */}
                      <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1 fw-bold text-dark">
                            {sede.nombre}
                          </h5>
                          <div className="d-flex align-items-center text-muted small">
                            <MapPin size={14} className="me-1 text-danger" />
                            {sede.direccion || "Sin dirección registrada"}
                          </div>
                        </div>
                        <span
                          className={`badge ${config?.estado == 1 ? "bg-success" : "bg-danger"} bg-opacity-10 text-${config?.estado == 1 ? "success" : "danger"} border border-${config?.estado == 1 ? "success" : "danger"} border-opacity-25 rounded-pill px-3 py-2`}
                        >
                          {config?.estado == 1 ? "Activa" : "Inactiva"}
                        </span>
                      </div>

                      {/* Cuerpo de la Tarjeta (Configuración Delivery) */}
                      <div className="card-body px-4 py-2">
                        {config ? (
                          <div className="d-flex flex-column">
                            {/* Tarifas Base y Prioridad */}
                            <div className="config-item">
                              <div className="icon-box icon-box-primary flex-shrink-0">
                                <span className="fw-bold" style={{ fontSize: "1.2rem" }}>S/</span>
                              </div>
                              <div className="w-100 d-flex justify-content-between align-items-center">
                                <div>
                                  <p
                                    className="mb-0 fw-medium text-dark"
                                    style={{ fontSize: "0.9rem" }}
                                  >
                                    Costo de Envío
                                  </p>
                                  <small className="text-muted">
                                    Tarifa estándar de la sede
                                  </small>
                                </div>
                                <div className="text-end">
                                  <p className="mb-0 fw-bold fs-6">
                                    S/{" "}
                                    {Number(config.costo_base_delivery).toFixed(
                                      2,
                                    )}
                                  </p>
                                  <small className="text-muted">
                                    Prioridad: S/{" "}
                                    {Number(config.costo_prioridad).toFixed(2)}
                                  </small>
                                </div>
                              </div>
                            </div>

                            {/* Tiempos de Entrega */}
                            <div className="config-item">
                              <div className="icon-box icon-box-warning flex-shrink-0">
                                <Clock size={20} strokeWidth={2} />
                              </div>
                              <div className="w-100 d-flex justify-content-between align-items-center">
                                <div>
                                  <p
                                    className="mb-0 fw-medium text-dark"
                                    style={{ fontSize: "0.9rem" }}
                                  >
                                    Tiempo Estimado (ETA)
                                  </p>
                                  <small className="text-muted">
                                    Rango de entrega visible en la App
                                  </small>
                                </div>
                                <div className="text-end">
                                  <span className="badge bg-warning text-dark px-2 py-1 fs-6 rounded-3">
                                    {config.tiempo_min} - {config.tiempo_max}{" "}
                                    min
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Propinas Sugeridas */}
                            <div className="config-item border-bottom-0 pb-1">
                              <div className="icon-box icon-box-success flex-shrink-0">
                                <HeartHandshake size={20} strokeWidth={2} />
                              </div>
                              <div className="w-100">
                                <p
                                  className="mb-1 fw-medium text-dark"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  Propinas Sugeridas
                                </p>
                                <div className="d-flex gap-2 flex-wrap">
                                  {propinas.length > 0 ? (
                                    propinas.map((prop, idx) => (
                                      <span key={idx} className="propina-badge">
                                        S/ {Number(prop).toFixed(2)}
                                      </span>
                                    ))
                                  ) : (
                                    <small className="text-muted">
                                      No configurado
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Estado Vacio: Si la Sede aún no tiene configuración en la DB */
                          <div className="text-center py-4">
                            <AlertCircle
                              size={32}
                              className="text-muted mb-2 opacity-50"
                            />
                            <h6 className="text-dark fw-medium">
                              Sin configuración general
                            </h6>
                            <p className="text-muted small mb-3">
                              Esta sede no tiene costos ni tiempos definidos
                              aún.
                            </p>
                            <button
                              className="btn btn-sm btn-outline-primary rounded-pill px-4"
                              onClick={() => {
                                setSedeForAdd(sede);
                                setIsModalAddOpen(true);
                              }}
                            >
                              Configurar Sede
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Pie de la Tarjeta (Botones de Acción) */}
                      <div className="card-footer bg-transparent border-top px-4 py-3 d-flex gap-2">
                        <button
                          className="btn btn-dark border d-flex justify-content-center align-items-center gap-2 rounded-pill fw-medium "
                          disabled={!config}
                          style={{ minWidth: '110px' }}
                          onClick={() => {
                            if (config) {
                              setConfigSelected(config);
                              setIsModalEditOpen(true);
                            }
                          }}
                        >
                          <Settings size={15} />
                          Ajustes
                        </button>
                        <button
                          className="btn-principal d-flex flex-grow-1 justify-content-center align-items-center gap-2 rounded-pill fw-medium"
                          disabled={!config}
                        >
                          <Map size={15} />
                          Zonas
                        </button>

                        {config && (
                          <div className="d-flex ms-auto gap-2">
                            <button
                              className="btn btn-outline-secondary d-flex justify-content-center align-items-center rounded-circle"
                              style={{ width: '38px', height: '38px', padding: 0 }}
                              title={config.estado == 1 ? "Desactivar Configuración" : "Activar Configuración"}
                              onClick={() => {
                                setConfigAccion(config);
                                setShowModalActivar(true);
                              }}
                            >
                              <PowerOff size={16} />
                            </button>
                            <button
                              className="btn btn-outline-danger d-flex justify-content-center align-items-center rounded-circle"
                              style={{ width: '38px', height: '38px', padding: 0 }}
                              title="Eliminar Configuración"
                              onClick={() => {
                                setConfigDelete(config);
                                setShowModalEliminar(true);
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* MODAL PARA CONFIGURAR SEDE (AGREGAR) */}
      <ModalRight
        isOpen={isModalAddOpen}
        onClose={() => {
          setIsModalAddOpen(false);
          setSedeForAdd(null);
        }}
        title="Configurar Sede"
        subtitulo={sedeForAdd ? `Sede: ${sedeForAdd.nombre}` : ""}
        hideFooter={true}
        width="450px"
      >
        {({ handleClose }) => (
          <FormAddConfigTarifa
            onClose={handleClose}
            sedeId={sedeForAdd?.id}
          />
        )}
      </ModalRight>

      {/* MODAL PARA AJUSTES (EDITAR) */}
      <ModalRight
        isOpen={isModalEditOpen}
        onClose={() => {
          setIsModalEditOpen(false);
          setConfigSelected(null);
        }}
        title="Ajustes de Delivery"
        subtitulo="Modificar la configuración de tarifa y tiempo"
        hideFooter={true}
        width="450px"
      >
        {({ handleClose }) => (
          <FormEditConfigTarifa
            onClose={handleClose}
            configuracion={configSelected}
          />
        )}
      </ModalRight>

      {/* MODAL PARA CONFIRMAR ACTIVAR/DESACTIVAR */}
      <ModalAlertQuestion
        show={showModalActivar}
        handleCloseModal={() => {
          setShowModalActivar(false);
          setConfigAccion(null);
        }}
        handleEliminar={handleToggleEstado}
        idEliminar={configAccion?.id}
        nombre="Configuración de Sede"
        pregunta={`¿Estás seguro de ${configAccion?.estado == 1 ? 'desactivar' : 'activar'}`}
        tipo="esta configuración"
      />

      {/* MODAL PARA CONFIRMAR ELIMINAR OPCIÓN DEFINITIVA */}
      <ModalAlertQuestion
        show={showModalEliminar}
        handleCloseModal={() => {
          setShowModalEliminar(false);
          setConfigDelete(null);
        }}
        handleEliminar={handleDeleteConfig}
        idEliminar={configDelete?.id}
        nombre="Configuración de Sede"
        pregunta="¿Estás completamente seguro de ELIMINAR"
        tipo="esta configuración"
      />
    </div>
  );
}
