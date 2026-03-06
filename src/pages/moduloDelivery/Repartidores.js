import {
  FileText,
  Plus,
  Phone,
  Mail,
  User,
  Search,
  Eye,
  MoreVertical,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetUsuarios } from "../../service/GetUsuarios";
import "../../css/estilosDelivery/EstilosRepartidores.css";

export function Repartidores() {
  const {
    data: repartidores,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repartidores"],
    queryFn: GetUsuarios,
  });

  const usuariosRepartidores = repartidores
    ? repartidores.filter(
        (usuario) => usuario?.empleado?.cargo?.nombre === "delivery",
      )
    : [];

  return (
    <div className="container-fluid p-0">
      <div className="card shadow-sm border-0 rounded-4">
        {/* HEADER DE LA VISTA */}
        <div className="card-header bg-white border-bottom-0 d-flex flex-wrap justify-content-between align-items-center p-4 pb-2">
          <h3 className="mb-2 mb-md-0 fw-bold d-flex align-items-center gap-2">
            Panel de Repartidores
            <span className="badge bg-light text-dark border rounded-pill fs-6 fw-medium">
              {usuariosRepartidores.length} activos
            </span>
          </h3>

          <div className="d-flex flex-wrap gap-2 ms-auto align-items-center">
            <div className="position-relative">
              <input
                type="text"
                placeholder="Buscar repartidor..."
                className="form-control form-control-sm search-input bg-light border-0"
                style={{ minWidth: "220px", paddingLeft: "35px" }}
              />
              <Search
                size={16}
                className="position-absolute text-muted"
                style={{
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-3 rounded-pill"
              title="Generar Reporte Completo"
            >
              <FileText size={16} />
              <span className="d-none d-sm-inline">Reporte</span>
            </button>
            <button
              className="btn btn-sm btn-dark d-flex align-items-center gap-1 px-3 rounded-pill"
              title="Agregar Nuevo Repartidor"
              onClick={() => {
                // Abrir el modal
              }}
            >
              <Plus size={16} />
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
                  <div className="card h-100 repartidor-card-horizontal bg-white shadow-sm">
                    {/* Rejilla interna simplificada con Flexbox puro */}
                    <div className="card-body p-3 d-flex align-items-center gap-3">
                      {/* 1. Avatar fijo a la izquierda */}
                      <div className="position-relative flex-shrink-0">
                        <div className="avatar-circle-horizontal">
                          <User size={24} strokeWidth={1.5} />
                        </div>
                        <div
                          className="status-indicator-horizontal"
                          title="Activo/Conectado"
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
                            className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-0"
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
                              {repartidor.telefono || "Sin registro"}
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
                      <div className="d-flex flex-column justify-content-center align-items-end flex-shrink-0 gap-2">
                        <button
                          className="btn btn-sm btn-light border rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                          title="Ver Detalles"
                        >
                          <Eye size={14} className="text-dark" />
                        </button>
                        <button className="btn btn-link text-muted p-0 m-0">
                          <MoreVertical size={16} />
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
    </div>
  );
}
