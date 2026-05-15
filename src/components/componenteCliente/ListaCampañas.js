import { GetCampañaPromos } from "../../service/accionesClientes/GetCampañaPromos";
import { useQuery } from "@tanstack/react-query";
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

export function ListaCampañas() {
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
    console.log("Editar campaña:", campana);
    // TODO: Abrir el modal pasándole los datos de la campaña seleccionada
  };

  const handleDelete = (idCampaña) => {
    console.log("Eliminar campaña con ID:", idCampaña);
    // TODO: Mostrar SweetAlert de confirmación y ejecutar mutation de eliminación
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
                            onClick={() => handleDelete(campana.id)}
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
                  <button className="btn btn-outline-dark w-100 fw-bold d-flex align-items-center justify-content-center gap-2 campana-btn-action">
                    Ver Estadísticas <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
