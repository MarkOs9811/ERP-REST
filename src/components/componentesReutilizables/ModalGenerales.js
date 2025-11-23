import React from "react";
import "../../css/ModalAlertQuestion.css";

function ModalGenerales({
  show,
  idProceso = null,
  handleAccion,
  handleCloseModal,
  mensaje,
  cuerpo,
  children,

  width = "500px", // Ancho por defecto
  height = "auto", // Alto por defecto
  showButtons = true, // Mostrar botones por defecto
  textConfirm = "Confirmar", // Texto botón aceptar
  textCancel = "Cancelar", // Texto botón cancelar
  btnConfirmColor = "btn-danger", // Color botón confirmar (opcional)
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

  return (
    <div className={`modal-overlay ${show ? "show" : ""} m-0 p-0`}>
      <div
        className="contenido-model bg-white m-0 p-0"
        // Aquí aplicamos los estilos dinámicos pasados por props
        style={{
          width: width,
          height: height,
          maxWidth: "95vw",
          maxHeight: "95vh",
          overflowY: "auto",
        }}
      >
        {/* Título */}
        {mensaje && <h3 className="p-3">{mensaje}</h3>}

        {/* Contenido (Children tiene prioridad) */}
        <div className="modal-body p-0">
          {children
            ? children
            : cuerpo &&
              (typeof cuerpo === "function"
                ? cuerpo({ handleCloseModal })
                : cuerpo)}
        </div>

        {/* Botones de Acción (Renderizado condicional) */}
        {showButtons && (
          <div className="modal-footer p-3 text-end">
            <button
              onClick={handleConfirm}
              className={`btn ${btnConfirmColor} mx-2`}
            >
              {textConfirm}
            </button>
            <button onClick={handleCloseModal} className="btn btn-secondary">
              {textCancel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalGenerales;
