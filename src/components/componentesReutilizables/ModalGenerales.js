import React from "react";
import "../../css/ModalAlertQuestion.css";
import ReactDOM from "react-dom";

function ModalGenerales({
  show,
  idProceso = null,
  handleAccion,
  handleCloseModal,
  mensaje,
  cuerpo,
  children,
  width = "400px", // Un poco más angosto hace que las alertas se vean mejor
  height = "auto",
  showButtons = true,
  textConfirm = "Confirmar",
  textCancel = "Cancelar",
  btnConfirmColor = "btn-danger",
}) {
  const handleConfirm = async () => {
    try {
      if (handleAccion) {
        idProceso ? await handleAccion(idProceso) : await handleAccion();
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error en modal:", error);
      handleCloseModal();
    }
  };

  if (!show) return null;

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className={`modal-overlay ${show ? "show" : ""} m-0 p-0 d-flex justify-content-center align-items-center`}
      style={{ zIndex: 1050 }}
    >
      <div
        className="bg-white rounded-4 shadow-lg d-flex flex-column overflow-hidden"
        style={{
          width: width,
          height: height,
          maxWidth: "95vw",
          maxHeight: "95vh",
          animation: "fadeIn 0.2s ease-in-out", // Si tienes esta animación en tu CSS
        }}
      >
        {/* Título más limpio sin el fondo gris duro */}
        {mensaje && (
          <div className="pt-4 pb-2 px-4 text-center">
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
    document.body
  );
}

export default ModalGenerales;
