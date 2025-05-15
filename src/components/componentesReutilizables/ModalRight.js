import React, { useState, useEffect } from "react";
import { Close } from "react-ionicons";
import "../../css/EstiloModalRight.css";

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
    <div className="modal-right-overlay">
      <div className="modal-right-backdrop" onClick={handleClose} />

      <div
        className={`modal-right-container ${
          isClosing ? "slide-out" : "slide-in"
        }`}
        style={{ width }}
      >
        {/* Resto del código del modal permanece igual */}
        <div className="modal-right-header ">
          <div>
            <h3 className="modal-right-title">{title}</h3>
            <p className="text-muted">{subtitulo}</p>
          </div>
          <button className="modal-right-close-btn" onClick={handleClose}>
            <Close color={"#000"} />
          </button>
        </div>

        <div className="modal-right-body  p-0">{children}</div>

        {!hideFooter && (
          <div className="modal-right-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={onCancel || handleClose}
            >
              {cancelText}
            </button>
            <button className="btn btn-primary ms-2" onClick={onSubmit}>
              {submitText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalRight;
