import { useState } from "react"; // 1. Importamos useState
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import ModalAlertQuestion from "../../componenteToast/ModalAlertQuestion";
import { PutData } from "../../../service/CRUD/PutData";
import ModalAlertActivar from "../../componenteToast/ModalAlertActivar";
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";

const SedesLoading = () => (
  <div className="text-center mt-4">
    <Spinner animation="border" />
    <p className="text-muted mt-2">Cargando sedes...</p>
  </div>
);

const SedesError = () => (
  <p className="text-danger text-center mt-4">Error al cargar las sedes.</p>
);

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

  const miSedeActual = JSON.parse(localStorage.getItem("user")) || null;

  const miSede = miSedeActual ? miSedeActual.sede?.nombre : null;
  const queryClient = useQueryClient(); // <-- agregado
  const [showModal, setShowModal] = useState(false);
  const [sedeActual, setSedeActual] = useState(null);
  const [showModalDesactivar, setShowModalDesactivar] = useState(false);
  const [loadingDesactivar, setLoadingDesactivar] = useState(false); // <-- estado loading
  const [showModalActivar, setShowModalActivar] = useState(false); // <-- modal activar
  const [loadingActivar, setLoadingActivar] = useState(false); // <-- loading activar

  const handleCloseModal = () => setShowModal(false);

  const handleEditClick = (sede) => {
    setSedeActual(sede);
    setShowModal(true);
  };

  // CORRECCIÓN: recibir id, usar queryClient e indicar loading
  const handleDesactivarSede = async (id) => {
    setLoadingDesactivar(true);
    try {
      // si tu endpoint requiere body puedes enviarlo en el 3er argumento
      const exito = await PutData("sedesDesactivar", id, {});
      if (exito) {
        await queryClient.invalidateQueries(["sedes"]);
        setShowModalDesactivar(false);
        setSedeActual(null);
      }
    } catch (err) {
      console.error("Error al desactivar sede:", err);
    } finally {
      setLoadingDesactivar(false);
    }
  };

  // NUEVO: método para activar sede
  const handleActivarSede = async (id) => {
    setLoadingActivar(true);
    try {
      const exito = await PutData("sedesActivar", id, {});
      if (exito) {
        await queryClient.invalidateQueries(["sedes"]);
        setShowModalActivar(false);
        setSedeActual(null);
      }
    } catch (err) {
      console.error("Error al activar sede:", err);
    } finally {
      setLoadingActivar(false);
    }
  };

  if (isLoading) return <SedesLoading />;
  if (isError) return <SedesError />;

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
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
            onClick={() => {
              setSedeActual(null);
              setShowModal(true);
            }}
          />
        </div>
        <div className="card-body">
          <div className="row g-4">
            {sedes.map((sede, i) => (
              <div className="col-md-6 col-lg-4" key={sede?.codigo || i}>
                <SedeCard
                  sede={sede}
                  index={i}
                  onEdit={handleEditClick}
                  setSedeActual={setSedeActual}
                  setShowModalDesactivar={setShowModalDesactivar}
                  setShowModalActivar={setShowModalActivar} // <-- pasar handler activar
                  miSede={miSede}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
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

      {showModalDesactivar && (
        <ModalAlertQuestion
          show={showModalDesactivar}
          idEliminar={sedeActual?.id}
          nombre={sedeActual?.nombre}
          handleEliminar={handleDesactivarSede}
          handleCloseModal={() => setShowModalDesactivar(false)}
          tipo="sede"
          pregunta="¿Estás seguro de desactivar esta"
          loading={loadingDesactivar} // <-- pasamos el estado de loading
        />
      )}

      {/* Modal para activar sede */}
      {showModalActivar && (
        <ModalAlertActivar
          show={showModalActivar}
          idActivar={sedeActual?.id}
          nombre={sedeActual?.nombre}
          handleActivar={handleActivarSede}
          handleCloseModal={() => setShowModalActivar(false)}
          tipo="sede"
          pregunta="¿Estás seguro de activar esta"
          loading={loadingActivar}
        />
      )}
    </>
  );
}

function SedeCard({
  sede,
  index,
  onEdit,
  setSedeActual,
  setShowModalDesactivar,
  setShowModalActivar, // <-- recibir handler activar
  miSede,
}) {
  const isMiSede = miSede == sede?.nombre;

  return (
    <div
      // 1. Quité la clase 'border' que tenías en el código anterior (ahora no está)
      //    La clase 'card' ya tiene un borde por defecto.
      className="rounded h-100 position-relative"
      style={{
        border: isMiSede
          ? "2px solid #dc3545"
          : "2px solid rgba(227, 228, 230, 1)",

        backgroundColor: isMiSede ? "#fff5f5" : undefined,
        boxShadow: isMiSede ? "0 6px 20px rgba(220,53,69,0.10)" : undefined,
      }}
    >
      {/* Pasamos handlers al menú de acciones */}
      <SedeActionsMenu
        sede={sede}
        index={index}
        onEdit={onEdit}
        setSedeActual={setSedeActual}
        setShowModalDesactivar={setShowModalDesactivar}
        setShowModalActivar={setShowModalActivar}
      />
      <div className="card-body p-3 d-flex flex-column">
        {/* ...resto del contenido... */}
        <div className="flex-grow-1">
          <h5 className="card-title d-flex align-items-center gap-2 mb-3">
            <Building2 className="text-danger" height="20px" width="20px" />
            <span className="fw-bold">
              {capitalizeFirstLetter(sede?.nombre)}
            </span>
          </h5>
          <div className="d-flex flex-column gap-2 mb-3">
            <span className="card-text d-flex align-items-start gap-2">
              <MapPin className="text-muted mt-1" height="16px" width="16px" />
              <span>{sede?.direccion}</span>
            </span>
            <span className="card-text d-flex align-items-center gap-2">
              <Phone className="text-muted" height="16px" width="16px" />
              {sede?.telefono}
            </span>
          </div>
          <p className="card-text mb-3 text-muted small">
            Código: <strong>{sede?.codigo}</strong>
          </p>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
          <SedeStatusBadge estado={sede?.estado} />
          {sede?.estado == 0 && (
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => {
                if (typeof setSedeActual === "function") setSedeActual(sede);
                if (typeof setShowModalActivar === "function")
                  setShowModalActivar(true);
              }}
            >
              Activar
            </button>
          )}
          {isMiSede && <span className="badge bg-danger">Sede Actual</span>}
        </div>
      </div>
    </div>
  );
}
// ...existing code...

function SedeActionsMenu({
  sede,
  index,
  onEdit,
  setSedeActual,
  setShowModalDesactivar,
  setShowModalActivar,
}) {
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
        {sede?.estado == 0 && (
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (typeof setSedeActual === "function") setSedeActual(sede);
                if (typeof setShowModalActivar === "function")
                  setShowModalActivar(true);
              }}
            >
              Activar
            </button>
          </li>
        )}
        <li>
          <button
            className="dropdown-item"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onEdit(sede);
            }}
          >
            Editar
          </button>
        </li>
        {sede?.estado == 1 && (
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                // ahora sí llamamos a los setters que vienen del componente padre
                if (typeof setSedeActual === "function") setSedeActual(sede);
                if (typeof setShowModalDesactivar === "function")
                  setShowModalDesactivar(true);
              }}
            >
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
    ? "btn-outline-success btn bg-success-subtle text-success-emphasis"
    : "btn-outline-dark btn bg-secondary-subtle text-secondary-emphasis";
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
