
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
}) {
  const queryClient = useQueryClient();
  const handleConfirm = async () => {
    try {
      // Ejecutar la función de eliminación pasando el ID
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
        {" "}
        {/* Agregar clase show */}
        <div className="contenido-model bg-white">
          <p className="h5">¿Estás seguro de Activar este {tipo}?</p>
          <h4 className="modal-name-activar">
            {nombre || "Nombre no disponible"}
          </h4>
          <div>
            <button onClick={handleConfirm} className="btn-activarUsuario mx-2">
              Confirmar
            </button>
            <button onClick={handleCloseModal} className="btn-cancelar">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ModalAlertActivar;
