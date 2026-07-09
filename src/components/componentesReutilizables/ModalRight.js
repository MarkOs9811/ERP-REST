import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../../css/EstiloModalRight.css";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { X } from "lucide-react";

const ModalRight = ({
  isOpen,
  onClose,
  title,
  subtitulo = "",
  children,
  submitText = "Guardar",
  submitIcon = null,
  onSubmit,
  cancelText = "Cancelar",
  onCancel,
  icono = null,
  width = "500px",
  hideFooter = false,
  isLoading = false,
  isSubmitDisabled = false,
  showSubmit = true,
  submitButtonClassName = "",
  cancelButtonClassName = "",
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else if (shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  const handleClose = () => {
    // Si está cargando, bloqueamos que el usuario pueda cerrar el modal accidentalmente
    if (isLoading) return;

    // Delegamos el cierre al padre para mantener sincronizada la animación con isOpen
    onClose();
  };

  if (!shouldRender) return null;

  return createPortal(
    <div className="modal-right-overlay m-0 p-0">
      <div className="modal-right-backdrop" onClick={handleClose} />

      <div
        className={`modal-right-container custom-width-mobile p-0 m-0 d-flex flex-column h-100 overflow-hidden ${
          isOpen ? "slide-in" : "slide-out"
        }`}
        style={{ width }}
      >
        {/* Header fijo */}
        <div className="modal-right-header-content d-flex align-items-center justify-content-between p-3 w-100 border-bottom flex-shrink-0">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn-cerrar fw-bold shadow-sm d-flex align-items-center justify-content-center"
              aria-label="Close"
              onClick={handleClose}
              title="Cerrar Modal"
              disabled={isLoading} // 🔥 Bloqueamos la X si está cargando
            >
              <X />
            </button>

            <div className="d-flex flex-column modal-title-wrapper">
              <h3 className="modal-right-title mb-0">
                {capitalizeFirstLetter(title)}
              </h3>
              {subtitulo && (
                <p className="text-muted mb-0 small">{subtitulo}</p>
              )}
            </div>
          </div>

          <span className="ms-auto me-1">{icono}</span>
        </div>

        {/* CUERPO DEL MODAL */}
        <div
          className={`modal-right-body m-0 bg-white p-0 overflow-y-auto flex-grow-1 ${
            hideFooter ? "full-height" : "with-footer"
          }`}
        >
          {typeof children === "function"
            ? children({ handleClose })
            : children}
        </div>

        {/* Footer fijo (opcional) */}
        {!hideFooter && (
          <div className="modal-right-footer flex-shrink-0">
            <button
              type="button"
              className={`btn-cerrar-modal ms-2 ${cancelButtonClassName}`.trim()}
              onClick={onCancel || handleClose}
              disabled={isLoading} // 🔥 Bloqueamos botón Cancelar
            >
              {cancelText}
            </button>
            {showSubmit && (
              <button
                type="button"
                className={`btn-guardar ms-2 ${submitButtonClassName}`.trim()}
                onClick={onSubmit}
                disabled={isLoading || isSubmitDisabled} // 🔥 Bloqueamos botón principal
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    {submitIcon}
                    {submitText}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default ModalRight;
