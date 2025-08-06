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
    }, 300); // 300ms coincide con la duración de la animación
  };

  if (!shouldRender) return null;

  return (
    <div className="modal-right-overlay m-0 p-0">
      <div className="modal-right-backdrop" onClick={handleClose} />

      <div
        className={`modal-right-container p-0 m-0  ${
          isClosing ? "slide-out" : "slide-in"
        }`}
        style={{ width }}
      >
        {/* Resto del código del modal permanece igual */}
        <div className="modal-right-header ">
          <div>
            <h3 className="modal-right-title">
              {capitalizeFirstLetter(title)}
            </h3>
            <p className="text-muted-auto">{subtitulo}</p>
          </div>
          <button
            type="button"
            class="btn-close btn-close-auto"
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </div>

        <div className="modal-right-body  p-4">{children}</div>

        {!hideFooter && (
          <div className="modal-right-footer">
            <button className="btn-cerrar-modal ms-2" onClick={handleClose}>
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
