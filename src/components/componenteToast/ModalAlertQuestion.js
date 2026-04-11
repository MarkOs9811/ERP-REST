import "react-toastify/dist/ReactToastify.css";
import "../../css/ModalAlertQuestion.css"; // Importar CSS correctamente
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
  loading = false, // <-- 1. Agregado el prop loading
}) {
  const queryClient = useQueryClient();
  const isLoading = Boolean(loading); // <-- 2. Constante booleana

  const handleConfirm = async () => {
    try {
      // Ejecutar la función de eliminación pasando el ID
      const success = await handleEliminar(idEliminar);
      if (success) {
        // Si necesitas invalidar la caché como en activar, descomenta la siguiente línea:
        // queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        handleCloseModal();
      } else {
        handleCloseModal();
      }
    } catch (error) {
      handleCloseModal();
    }
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className={`modal-overlay my-0 ${show ? "show" : ""}`}>
      <div className="contenido-model bg-white">
        <p className="h5">
          {pregunta} {tipo}?
        </p>
        <h4 className="modal-name-delete">
          {nombre || "Nombre no disponible"}
        </h4>

        <div>
          {/* Botón Confirmar con estado de carga (Spinner) */}
          <button
            onClick={handleConfirm}
            className="btn-eliminarToast mx-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Eliminando...
              </>
            ) : (
              "Confirmar"
            )}
          </button>
          {/* Botón Cancelar */}
          <button
            onClick={handleCloseModal}
            className="btn-cancelar"
            disabled={isLoading}
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
