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
  onSubmit,
  cancelText = "Cancelar",
  onCancel,
  icono = null,
  width = "500px",
  hideFooter = false,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  return createPortal(
    <div className="modal-right-overlay m-0 p-0">
      <div className="modal-right-backdrop" onClick={handleClose} />

      <div
        className={`modal-right-container custom-width-mobile p-0 m-0 d-flex flex-column h-100 overflow-hidden ${
          isClosing ? "slide-out" : "slide-in"
        }`}
        style={{ width }}
      >
        {/* Header fijo */}
        <div className="modal-right-header-content d-flex align-items-center justify-content-between p-3 w-100 border-bottom flex-shrink-0">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn-close-auto fw-bold shadow-sm d-flex align-items-center justify-content-center"
              aria-label="Close"
              onClick={handleClose}
              title="Cerrar Modal"
            >
              <X size={20} />
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

        {/* ============================================================ */}
        {/* CUERPO DEL MODAL (Aquí está la corrección del Scroll)        */}
        {/* Usamos overflow-y-auto para permitir deslizar verticalmente  */}
        {/* ============================================================ */}
        <div
          className={`modal-right-body m-0 p-0 overflow-y-auto flex-grow-1 ${
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
              className="btn-cerrar-modal ms-2"
              onClick={onCancel || handleClose}
            >
              {cancelText}
            </button>
            <button className="btn-guardar ms-2" onClick={onSubmit}>
              {submitText}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ModalRight;
