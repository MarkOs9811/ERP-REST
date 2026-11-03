import React, { useState } from "react";
import "../../css/ModalAlertQuestion.css";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { Button } from "../ui/button";

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
    <div className={`fw-modal-overlay ${show ? "show" : ""}`}>
      <div
        className="fw-modal-shell d-flex flex-column overflow-hidden position-relative"
        style={{
          width: width,
          height: height,
          maxWidth: "95vw",
          maxHeight: "95vh",
          backgroundColor: "var(--bg-surface, #ffffff)",
          color: "var(--text-main, #0f172a)",
        }}
      >
        <Button
          onClick={handleCloseModal}
          className="fw-modal-close-btn btn-icon"
          aria-label="Cerrar"
          disabled={isLoading}
         variant="default">
          <X size={20} />
        </Button>

        {mensaje && (
          <div className="fw-modal-header text-center">
            <h4 className="fw-bold m-0">{mensaje}</h4>
          </div>
        )}

        <div className="fw-modal-body modal-body">
          {children
            ? children
            : cuerpo &&
              (typeof cuerpo === "function"
                ? cuerpo({ handleCloseModal })
                : cuerpo)}
        </div>

        {showButtons && (
          <div className="fw-modal-actions">
            <Button
              onClick={handleCloseModal}
              className="btn-cerrar-modal"
              disabled={!handleAccion || isLoading}
             variant="default">
              {textCancel}
            </Button>
            <Button
              onClick={handleConfirm}
              className={`btn fw-modal-btn fw-modal-btn-confirm ${btnConfirmColor}`}
              disabled={isLoading}
             variant="default">
              {isLoading ? (
                <>
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
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default ModalGenerales;
