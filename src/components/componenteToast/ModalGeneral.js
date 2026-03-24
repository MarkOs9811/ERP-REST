import "../../css/ModalAlertQuestion.css";
import ReactDOM from "react-dom";

function ModalGeneral({
  show,
  idProceso = null,
  handleAccion,
  handleCloseModal,
  mensaje,
  cuerpo, // opcional, puedes dejarlo si lo usas en otros lugares
  children, // <-- agrega esto
}) {
  const handleConfirm = async () => {
    try {
      const success = idProceso
        ? await handleAccion(idProceso)
        : await handleAccion();

      handleCloseModal();
    } catch (error) {
      handleCloseModal();
    }
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${show ? "show" : ""} m-0 p-0`}>
        <div className="contenido-model bg-white">
          <h3>{mensaje}</h3>
          {/* Renderiza children si existen */}
          {children && <div className="modal-body">{children}</div>}
          {/* Si usas cuerpo como prop en otros lugares, puedes dejar esto */}
          {cuerpo && (
            <div className="modal-body">
              {typeof cuerpo === "function"
                ? cuerpo({ handleCloseModal })
                : cuerpo}
            </div>
          )}
          <div>
            <button onClick={handleConfirm} className="btn btn-danger mx-2">
              Confirmar
            </button>
            <button onClick={handleCloseModal} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      </div>,
    document.body
  );
}

export default ModalGeneral;
