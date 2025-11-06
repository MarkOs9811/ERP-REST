import { useState, useEffect } from "react";
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
    }, 300); // 300ms = duración animación
  };

  if (!shouldRender) return null;

  return (
    <div className="modal-right-overlay m-0 p-0">
      <div className="modal-right-backdrop" onClick={handleClose} />
      <div
        className={`modal-right-container p-0 m-0 d-flex flex-column h-100 overflow-visible ${
          isClosing ? "slide-out" : "slide-in"
        }`}
        style={{ width }}
      >
        <button
          type="button"
          className="btn-close-auto fw-bold border rounded-pill p-1 position-absolute shadow-sm "
          aria-label="Close"
          onClick={handleClose}
          title="Cerrar Modal"
        >
          <X />
        </button>
        {/* Header */}
        <div className="modal-right-header-content d-flex align-items-center justify-content-between p-3 w-100">
          <div className="ms-3 d-flex flex-column">
            <h3 className="modal-right-title">
              {capitalizeFirstLetter(title)}
            </h3>
            <p className="text-muted">{subtitulo}</p>
          </div>
          <span className="ms-auto me-3 ">{icono}</span>
        </div>

        <div
          className={`modal-right-body m-0 p-0 overflow-auto ${
            hideFooter ? "full-height" : "with-footer"
          }`}
        >
          {typeof children === "function"
            ? children({ handleClose })
            : children}
        </div>

        {/* Footer opcional */}
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
    </div>
  );
};

export default ModalRight;
