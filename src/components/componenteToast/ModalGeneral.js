import "../../css/ModalAlertQuestion.css"; // Importar CSS correctamente

function ModalGeneral({
  show,
  idProceso,
  handleAccion,
  handleCloseModal,
  mensaje,
  cuerpo, // Nuevo prop opcional para el contenido adicional
}) {
  const handleConfirm = async () => {
    try {
      // Ejecutar la función de acción pasando el ID
      const success = await handleAccion(idProceso);
      if (success) {
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
        <div className="contenido-model bg-white">
          <h3>{mensaje}</h3>
          {cuerpo && <div className="modal-body">{cuerpo}</div>}{" "}
          {/* Renderizar el cuerpo si se proporciona */}
          <div>
            <button onClick={handleConfirm} className="btn btn-danger mx-2">
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

export default ModalGeneral;
