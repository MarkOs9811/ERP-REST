import { useState } from "react"; // 1. Importamos useState
import { useQuery } from "@tanstack/react-query";
import { GetSedes } from "../../../service/accionesAreasCargos/GetSedes";
import { Spinner } from "react-bootstrap"; // Ya no importamos Offcanvas
import {
  Building2,
  CheckCheck,
  EllipsisVertical,
  MapPin,
  MinusCircle,
  Phone,
  Plus,
} from "lucide-react";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { FormularioSede } from "./FormularioSede";

// (Ya no necesitamos importar FormularioSedes aquí, porque ModalRight seguramente lo maneja)

// --- ESTADOS DE CARGA Y ERROR ---
const SedesLoading = () => (
  <div className="text-center mt-4">
    <Spinner animation="border" />
    <p className="text-muted mt-2">Cargando sedes...</p>
  </div>
);

const SedesError = () => (
  <p className="text-danger text-center mt-4">Error al cargar las sedes.</p>
);

// --- COMPONENTE PRINCIPAL ---

export function Sedes() {
  const {
    data: sedes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sedes"],
    queryFn: GetSedes,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // --- 3. ESTADO PARA EL MODAL (se mantiene igual) ---
  const [showModal, setShowModal] = useState(false);
  const [sedeActual, setSedeActual] = useState(null);

  // --- 4. FUNCIONES PARA CONTROLAR EL MODAL (se mantiene igual) ---
  const handleCloseModal = () => setShowModal(false);

  const handleAddSedeClick = () => {
    setSedeActual(null);
    setShowModal(true);
  };

  const handleEditClick = (sede) => {
    setSedeActual(sede);
    setShowModal(true);
  };

  if (isLoading) return <SedesLoading />;
  if (isError) return <SedesError />;

  return (
    // Usamos Fragment para que el ModalRight sea hermano del card
    <>
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          {/* ... (código del header sin cambios) ... */}
          <div className="d-flex gap-2 align-items-center">
            <div className="p-2 alert alert-danger rounded-lg mb-0">
              <Building2 className="text-danger" size={20} />{" "}
            </div>
            <div className="d-flex flex-column">
              <h4 className="fw-bold m-0">Sedes</h4>
              <small className="text-muted">
                Administra las ubicaciones de tu empresa
              </small>
            </div>
          </div>
          <BotonMotionGeneral
            text="Agregar Sede"
            icon={<Plus size={18} />}
            onClick={handleAddSedeClick} // 👈 5. Conectado
          />
        </div>
        <div className="card-body">
          <div className="row g-4">
            {sedes.map((sede, i) => (
              <div className="col-md-6 col-lg-4" key={sede.codigo || i}>
                {/* 👈 6. Pasamos la función 'onEdit' a la tarjeta */}
                <SedeCard sede={sede} index={i} onEdit={handleEditClick} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && ( // Renderizamos el modal solo cuando showModal es true
        <ModalRight
          title={sedeActual ? "Editar Sede" : "Agregar Nueva Sede"}
          isOpen={showModal}
          onClose={handleCloseModal}
          sede={sedeActual}
          hideFooter={true}
        >
          {({ handleClose }) => (
            <FormularioSede onClose={handleClose} sede={sedeActual} />
          )}
        </ModalRight>
      )}
    </>
  );
}
function SedeCard({ sede, index, onEdit }) {
  return (
    <div className="card border h-100 position-relative">
      {/* 👈 9. Pasamos 'onEdit' al menú de acciones */}
      <SedeActionsMenu sede={sede} index={index} onEdit={onEdit} />
      <div className="card-body p-3 d-flex flex-column">
        {/* ... (resto del código de la card) ... */}
        <div className="flex-grow-1">
          <h5 className="card-title d-flex align-items-center gap-2 mb-3">
            <Building2 className="text-primary" height="20px" width="20px" />
            <span className="fw-bold">{sede.nombre}</span>
          </h5>
          <div className="d-flex flex-column gap-2 mb-3">
            <span className="card-text d-flex align-items-start gap-2">
              <MapPin className="text-muted mt-1" height="16px" width="16px" />
              <span>{sede.direccion}</span>
            </span>
            <span className="card-text d-flex align-items-center gap-2">
              <Phone className="text-muted" height="16px" width="16px" />
              {sede.telefono}
            </span>
          </div>
          <p className="card-text mb-3 text-muted small">
            Código: <strong>{sede.codigo}</strong>
          </p>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
          <SedeStatusBadge estado={sede.estado} />
          {sede.estado == 0 && (
            <button className="btn btn-outline-success btn-sm">Activar</button>
          )}
        </div>
      </div>
    </div>
  );
}

function SedeActionsMenu({ sede, index, onEdit }) {
  return (
    <div
      className="position-absolute top-0 end-0 p-2 dropdown"
      style={{ zIndex: 2 }}
    >
      <button
        className="btn btn-sm btn-light bg-transparent border-0"
        type="button"
        id={`dropdownMenuButton-${index}`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Opciones de sede"
      >
        <EllipsisVertical className="text-muted" width="20px" height="20px" />
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby={`dropdownMenuButton-${index}`}
      >
        {sede.estado == 0 && (
          <li>
            <a className="dropdown-item" href="#">
              Activar
            </a>
          </li>
        )}
        <li>
          {/* 👈 11. ¡LA CONEXIÓN FINAL! */}
          <button
            className="dropdown-item"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onEdit(sede);
            }}
          >
            Editar
          </button>
        </li>
        {sede.estado == 1 && (
          <li>
            <button className="dropdown-item" href="#">
              Desactivar
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

function SedeStatusBadge({ estado }) {
  // ... (código sin cambios)
  const isActivo = estado == 1;
  const badgeClass = isActivo
    ? "bg-success-subtle text-success-emphasis"
    : "bg-secondary-subtle text-secondary-emphasis";
  const Icon = isActivo ? CheckCheck : MinusCircle;
  const text = isActivo ? "Activado" : "Desactivado";

  return (
    <span
      className={`badge ${badgeClass} d-inline-flex align-items-center gap-1 py-2 px-2`}
      style={{ fontSize: "0.8rem" }}
    >
      <Icon height="16px" width="16px" />
      {text}
    </span>
  );
}
