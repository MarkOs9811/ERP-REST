import React from "react";
import "../../css/ModalAlertQuestion.css";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

function ModalGenerales({
  show,
  idProceso = null,
  handleAccion,
  handleCloseModal,
  mensaje,
  cuerpo,
  children,
  width = "400px",
  height = "auto",
  showButtons = true,
  textConfirm = "Confirmar",
  textCancel = "Cancelar",
  btnConfirmColor = "btn-danger",
}) {
  const handleConfirm = async () => {
    try {
      if (handleAccion) {
        const exito = idProceso
          ? await handleAccion(idProceso)
          : await handleAccion();

        if (exito === true) {
          handleCloseModal();
        }
      } else {
        // Si el modal no tiene handleAccion (es solo un aviso), lo cerramos directo
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error en modal:", error);
    }
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className={`modal-overlay ${show ? "show" : ""} m-0 p-0 d-flex justify-content-center align-items-center`}
      style={{ zIndex: 1050 }}
    >
      <div
        // ATENCIÓN AQUÍ: Agregué 'position-relative' para poder anclar la X
        className="bg-white rounded-4 shadow-lg d-flex flex-column overflow-hidden position-relative"
        style={{
          width: width,
          height: height,
          maxWidth: "95vw",
          maxHeight: "95vh",
          animation: "fadeIn 0.2s ease-in-out",
        }}
      >
        {/* --- BOTÓN CERRAR "X" ELEGANTE --- */}
        <button
          onClick={handleCloseModal}
          // Añadí 'text-dark' por si tienes esa clase de Bootstrap, pero el style lo asegura.
          className="position-absolute top-0 bg-light rounded-pill border-0 end-0 m-2 z-1 p-2 shadow-md text-dark d-flex justify-content-center align-items-center"
          aria-label="Cerrar"
        >
          {/* Ahora sí, Lucide debería verse perfecto */}
          <X size={20} />
        </button>
        {/* --------------------------------- */}

        {/* Título más limpio sin el fondo gris duro */}
        {mensaje && (
          <div className="pt-4 pb-2 px-4 text-center mt-2">
            <h4 className="fw-bold text-dark m-0">{mensaje}</h4>
          </div>
        )}

        {/* Contenido centrado */}
        <div className="modal-body px-4 py-3 text-center">
          {children
            ? children
            : cuerpo &&
              (typeof cuerpo === "function"
                ? cuerpo({ handleCloseModal })
                : cuerpo)}
        </div>

        {/* Botones centrados y redondeados */}
        {showButtons && (
          <div className="d-flex justify-content-center gap-3 px-4 pb-4 pt-2">
            <button
              onClick={handleCloseModal}
              className="btn btn-light fw-bold rounded-pill px-4 py-2 text-muted border"
            >
              {textCancel}
            </button>
            <button
              onClick={handleConfirm}
              className={`btn ${btnConfirmColor} fw-bold rounded-pill px-4 py-2 shadow-sm`}
            >
              {textConfirm}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default ModalGenerales;
