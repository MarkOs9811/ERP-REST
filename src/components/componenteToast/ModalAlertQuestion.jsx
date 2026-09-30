import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "../../css/ModalAlertQuestion.css";
import { useQueryClient } from "@tanstack/react-query";
import ReactDOM from "react-dom";

function ModalAlertQuestion({
  show,
  idEliminar,
  nombre,
  handleEliminar,
  handleCloseModal,
  tipo,
  pregunta = "¿Estás seguro de eliminar este",
  loading = false,
}) {
  const queryClient = useQueryClient();
  // 1. Estado local para manejar la carga asíncrona internamente
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. Combinamos el loading externo (si existe) con el interno
  const isLoading = Boolean(loading) || isProcessing;

  const handleConfirm = async () => {
    // Bloqueo JS: Si ya está cargando, ignoramos clics extra
    if (isLoading) return;

    setIsProcessing(true); // Encendemos el loader
    try {
      // Esperamos a que termine la función del padre
      const success = await handleEliminar(idEliminar);
      if (success) {
        handleCloseModal();
      } else {
        handleCloseModal();
      }
    } catch (error) {
      handleCloseModal();
    } finally {
      setIsProcessing(false); // Apagamos el loader pase lo que pase
    }
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className={`modal-overlay my-0 ${show ? "show" : ""}`}>
      <div className="contenido-model ">
        <p className="h5">
          {pregunta} {tipo}?
        </p>
        <h4 className="modal-name-delete">
          {nombre || "Nombre no disponible"}
        </h4>

        <div className="d-flex justify-content-center mt-4">
          {/* Botón Confirmar */}
          <button
            onClick={handleConfirm}
            className="btn-eliminar mx-2"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? (
              <div className="d-flex align-items-center gap-2">
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Procesando...</span>
              </div>
            ) : (
              "Confirmar"
            )}
          </button>

          {/* Botón Cancelar */}
          <button
            onClick={handleCloseModal}
            className="btn-cancelar mx-2"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Espere..." : "Cancelar"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ModalAlertQuestion;
