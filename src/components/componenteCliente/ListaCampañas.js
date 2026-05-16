import { GetCampañaPromos } from "../../service/accionesClientes/GetCampañaPromos";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MoreHorizontal,
  Users,
  TrendingUp,
  ChevronRight,
  Star,
  Edit,
  Trash2,
  Ticket,
  CircleDollarSign,
  CalendarDays,
} from "lucide-react";
import "../../css/estilosClientes/EstiloCampanas.css";
import { formatearFecha } from "../../utils/formatearFechas";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";
import { useState } from "react";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import { DeleteData } from "../../service/CRUD/DeleteData";
import { PutData } from "../../service/CRUD/PutData";
import ToastAlert from "../componenteToast/ToastAlert";
import ModalRight from "../componentesReutilizables/ModalRight";
import { FormEditarCampañas } from "./FormEditarCampañas";
import { EstadisticasCampana } from "./EstadisticasCampana";

export function ListaCampañas() {
  const [campanaSeleccionada, setCampanaSeleccionada] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [campanaEditando, setCampanaEditando] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [campanaStats, setCampanaStats] = useState(null);
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const {
    data: listaCampañas = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["campanasPromos"],
    queryFn: GetCampañaPromos,
  });

  // Funciones manejadoras para las acciones del dropdown
  const handleEdit = (campana) => {
    setCampanaEditando(campana);
    setShowEditModal(true);
  };

  const handleVerEstadisticas = (campana) => {
    setCampanaStats(campana);
    setShowStatsModal(true);
  };

  const handleEliminarCampana = async (dataId) => {
    try {
      await DeleteData("campanasPromos", dataId);

      queryClient.invalidateQueries(["campanasPromos"]); // Refresca la lista de campañas
      setShowDeleteModal(false); // Cerramos el modal
    } catch (error) {
      const errorBak = error.response?.data?.message || error.message;
      ToastAlert("error", errorBak);
      console.error("Error al eliminar la campaña:", error);
    }
  };

  const onSubmitEdit = async (data) => {
    setIsSaving(true);
    try {
      const success = await PutData("campanasPromos", campanaEditando.id, data);
      if (success) {
        queryClient.invalidateQueries(["campanasPromos"]); // Refresca la lista de campañas
        setShowEditModal(false); // Cierra el modal
        setCampanaEditando(null); // Limpia el estado
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
      const errorBak = error.response?.data?.message || error.message;
      ToastAlert("error", errorBak);
      console.error("Error al actualizar la campaña:", error);
    }
  };

  if (isLoading)
    return <div className="p-3 text-center">Cargando campañas...</div>;
  if (error)
    return <div className="p-3 text-danger">Error al cargar las campañas</div>;

  const gradientClasses = [
    "bg-gradient-orange",
    "bg-gradient-purple",
    "bg-gradient-blue",
  ];

  return (
    <div className="card border-0 p-3 bg-transparent">
      <h3 className="mb-4 fw-bold text-dark">Campañas Activas</h3>

      <div className="campanas-grid">
        {listaCampañas.length === 0 ? (
          <p className="text-muted">No hay campañas creadas aún.</p>
        ) : (
          listaCampañas.map((campana, index) => {
            const gradientClass =
              gradientClasses[index % gradientClasses.length];
            const isDraft = !campana.estado;

            return (
              <div
                key={campana.id || index}
                className="card campana-card overflow-hidden rounded-5 bg-white"
              >
                {/* Cabecera con degradado */}
                <div className={`campana-header ${gradientClass}`}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <BadgeComponent
                      label={isDraft ? "Borrador" : "Activo"}
                      className="mb-0"
                    />

                    {/* DROPDOWN DE ACCIONES */}
                    <div className="dropdown">
                      <button
                        className="btn btn-link text-white p-0 border-0"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                        <li>
                          <button
                            className="dropdown-item d-flex align-items-center gap-2"
                            onClick={() => handleEdit(campana)}
                          >
                            <Edit size={16} className="text-secondary" />
                            Editar
                          </button>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item d-flex align-items-center gap-2 text-danger"
                            onClick={() => {
                              setShowDeleteModal(true);
                              setCampanaSeleccionada(campana);
                            }}
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Avatares superpuestos */}
                  <div className="avatars-group">
                    <div className="avatar bg-light"></div>
                    <div className="avatar bg-secondary"></div>
                    <div className="avatar bg-dark"></div>
                    <div className="avatar avatar-more">+12</div>
                  </div>
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="campana-body">
                  <h5 className="campana-title fw-bold text-dark mb-3">
                    {campana.nombre}
                  </h5>

                  {/* Bloque de Detalles Dinámico según Tipo */}
                  {campana.tipo === "cupon" ? (
                    <div className="detalles-cupon mb-4">
                      {/* Código y Valor Resaltados */}
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge-codigo-cupon">
                          <Ticket size={14} className="me-1" />
                          {campana.codigo_cupon}
                        </span>
                        <span className="badge-valor-cupon fw-bold">
                          {campana.tipo_descuento === "porcentaje"
                            ? `-${campana.valor_descuento}%`
                            : `- S/ ${campana.valor_descuento}`}
                        </span>
                      </div>

                      {/* Lista de Condiciones Minimalista */}
                      <ul className="condiciones-lista list-unstyled mb-0 mt-3 text-muted">
                        {campana.monto_minimo_compra > 0 && (
                          <li className="d-flex align-items-start gap-2 mb-1">
                            <CircleDollarSign
                              size={14}
                              className="mt-1 flex-shrink-0 text-secondary"
                            />
                            <span>
                              Aplica en compras mayores a{" "}
                              <strong>S/ {campana.monto_minimo_compra}</strong>
                            </span>
                          </li>
                        )}
                        <li className="d-flex align-items-start gap-2">
                          <CalendarDays
                            size={14}
                            className="mt-1 flex-shrink-0 text-secondary"
                          />
                          <span>
                            Válido del {formatearFecha(campana.fecha_inicio)} al{" "}
                            {formatearFecha(campana.fecha_fin)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    // Vista para otros tipos de campañas (puntos, etc)
                    <p className="campana-desc text-muted mb-4 text-truncate-2">
                      Programa de beneficios y puntos para clientes leales.
                    </p>
                  )}

                  {/* Estadísticas de Uso y Límite */}
                  {(() => {
                    const usados = campana.usados || 0;
                    const limite = campana.limite_uso;
                    const disponibles = limite ? limite - usados : "∞";
                    const isAgotado = limite && disponibles <= 0;

                    return (
                      <div className="campana-stats d-flex justify-content-between gap-2 border-bottom pb-3 mb-3">
                        <div className="stat-item flex-fill text-center border rounded py-2 bg-light border-0">
                          <span
                            className="stat-label text-muted d-block text-uppercase mb-1"
                            style={{
                              fontSize: "0.65rem",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Usados
                          </span>
                          <span className="stat-value fw-bold text-dark d-flex align-items-center justify-content-center gap-1">
                            <Users size={14} /> {usados}
                          </span>
                        </div>

                        <div
                          className={`stat-item flex-fill text-center border rounded py-2 ${isAgotado ? "border-danger bg-danger-subtle" : "border-0 bg-light"}`}
                        >
                          <span
                            className={`stat-label text-uppercase d-block mb-1 ${isAgotado ? "text-danger" : "text-muted"}`}
                            style={{
                              fontSize: "0.65rem",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Disponibles
                          </span>
                          <span
                            className={`stat-value fw-bold d-flex align-items-center justify-content-center gap-1 ${isAgotado ? "text-danger" : "text-success"}`}
                          >
                            <TrendingUp size={14} /> {disponibles}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Botón Acción */}
                  <button
                    className="btn btn-outline-dark w-100 fw-bold d-flex align-items-center justify-content-center gap-2 campana-btn-action"
                    onClick={() => handleVerEstadisticas(campana)}
                  >
                    Ver Estadísticas <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ModalAlertQuestion
        show={showDeleteModal}
        handleCloseModal={() => setShowDeleteModal(false)}
        handleEliminar={handleEliminarCampana}
        idEliminar={campanaSeleccionada?.id}
        tipo="Campaña"
        nombre={campanaSeleccionada?.nombre}
      />

      <ModalRight
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setCampanaEditando(null);
        }}
        title="Editar Campaña"
        subtitulo={campanaEditando?.nombre}
        submitText="Actualizar"
        onSubmit={() => {
          document
            .getElementById("formEditarCampana")
            .dispatchEvent(new Event("submit", { bubbles: true }));
        }}
        width="600px"
        isLoading={isSaving}
      >
        <div className="p-4">
          <FormEditarCampañas
            formId="formEditarCampana"
            dataCampaña={campanaEditando}
            onSubmitHandler={onSubmitEdit}
          />
        </div>
      </ModalRight>

      <ModalRight
        isOpen={showStatsModal}
        onClose={() => {
          setShowStatsModal(false);
          setCampanaStats(null);
        }}
        title="Estadísticas"
        subtitulo={campanaStats?.nombre}
        hideFooter={true}
        width="600px"
      >
        <EstadisticasCampana campana={campanaStats} />
      </ModalRight>
    </div>
  );
}
