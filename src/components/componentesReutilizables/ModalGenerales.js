import React, { useState } from "react";
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
  // --- NUEVO: Estado para controlar la carga ---
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      if (handleAccion) {
        setIsLoading(true); // Encendemos el loader

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
    } finally {
      setIsLoading(false); // Apagamos el loader pase lo que pase (éxito o error)
    }
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className={`modal-overlay ${show ? "show" : ""} m-0 p-0 d-flex justify-content-center align-items-center`}
      style={{ zIndex: 1050 }}
    >
      <div
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
          className="position-absolute top-0 bg-light rounded-pill border-0 end-0 m-2 z-1 p-2 shadow-md text-dark d-flex justify-content-center align-items-center"
          aria-label="Cerrar"
          disabled={isLoading} // Bloqueamos la X si está cargando
        >
          <X size={20} />
        </button>
        {/* --------------------------------- */}

        {mensaje && (
          <div className="pt-4 pb-2 px-4 text-center mt-2">
            <h4 className="fw-bold text-dark m-0">{mensaje}</h4>
          </div>
        )}

        {/* Contenido centrado */}
        <div className="modal-body px-4 py-3">
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
              // Deshabilitamos si no hay acción o si está cargando
              disabled={!handleAccion || isLoading}
            >
              {textCancel}
            </button>
            <button
              onClick={handleConfirm}
              className={`btn ${btnConfirmColor} fw-bold rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {/* Gusanito nativo de Bootstrap */}
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Procesando...
                </>
              ) : (
                textConfirm
              )}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default ModalGenerales;
