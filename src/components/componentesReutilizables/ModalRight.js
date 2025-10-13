import { useState, useEffect } from "react";
import "../../css/EstiloModalRight.css";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";

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
        className={`modal-right-container p-0 m-0 d-flex flex-column h-100 ${
          isClosing ? "slide-out" : "slide-in"
        }`}
        style={{ width }}
      >
        {/* Header */}
        <div className="modal-right-header p-1 flex-shrink-0">
          <div className="modal-right-header-content d-flex align-items-center p-3">
            <button
              type="button"
              className="btn-close btn-close-auto"
              aria-label="Close"
              onClick={handleClose}
              title="Cerrar Modal"
            ></button>
            <h3 className="modal-right-title ms-3">
              {capitalizeFirstLetter(title)}
            </h3>
            <p className="text-muted-auto">{subtitulo}</p>
          </div>
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
