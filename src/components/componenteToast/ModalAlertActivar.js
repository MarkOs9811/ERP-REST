import "react-toastify/dist/ReactToastify.css";
import "../../css/ModalAlertActivar.css"; // Importar CSS correctamente
import { useQueryClient } from "@tanstack/react-query";

function ModalAlertActivar({
  show,
  idActivar,
  nombre,
  handleActivar,
  handleCloseModal,
  tipo,
  loading = false,
}) {
  const queryClient = useQueryClient();
  const isLoading = Boolean(loading);

  const handleConfirm = async () => {
    try {
      // Ejecutar la función de activación pasando el ID
      const success = await handleActivar(idActivar);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        handleCloseModal();
      } else {
        handleCloseModal();
      }
    } catch (error) {
      handleCloseModal();
    }
  };

  return (
    show && (
      <div className={`modal-overlay my-0 ${show ? "show" : ""}`}>
        <div className="contenido-model bg-white">
          <p className="h5">¿Estás seguro de Activar este {tipo}?</p>
          <h4 className="modal-name-activar">
            {nombre || "Nombre no disponible"}
          </h4>
          <div>
            <button
              onClick={handleConfirm}
              className="btn-activarUsuario mx-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Activando...
                </>
              ) : (
                "Confirmar"
              )}
            </button>
            <button
              onClick={handleCloseModal}
              className="btn-cancelar"
              disabled={isLoading}
            >
              {isLoading ? "Espere..." : "Cancelar"}
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ModalAlertActivar;
