
import "react-toastify/dist/ReactToastify.css";
import "../../css/ModalAlertQuestion.css"; // Importar CSS correctamente
import { useQueryClient } from "@tanstack/react-query";

function ModalAlertQuestion({
  show,
  idEliminar,
  nombre,
  handleEliminar,
  handleCloseModal,
  tipo,
}) {
  const queryClient = useQueryClient();
  const handleConfirm = async () => {
    try {
      // Ejecutar la función de eliminación pasando el ID
      const success = await handleEliminar(idEliminar);
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
      <div className={`modal-overlay ${show ? "show" : ""} m-0 p-0`}>
        {" "}
        {/* Agregar clase show */}
        <div className="contenido-model bg-white">
          <p className="h5">¿Estás seguro de eliminar este {tipo}?</p>
          <h4 className="modal-name-delete">
            {nombre || "Nombre no disponible"}
          </h4>
          <div>
            <button onClick={handleConfirm} className="btn btn-danger  mx-2">
              Confirmar
            </button>
            <button onClick={handleCloseModal} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ModalAlertQuestion;
