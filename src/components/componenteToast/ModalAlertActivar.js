import React from 'react';
import "react-toastify/dist/ReactToastify.css";
import '../../css/ModalAlertActivar.css'; // Importar CSS correctamente

function ModalAlertActivar({ show, idActivar,nombre, handleActivar, handleCloseModal,tipo}) {
    
    const handleConfirm = async () => {
        try {
            // Ejecutar la función de eliminación pasando el ID
            const success = await handleActivar(idActivar);
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
      <div className={`modal-overlay ${show ? 'show' : ''}`}> {/* Agregar clase show */}
        <div className="contenido-model bg-white">
          <h3>¿Estás seguro de Activar este {tipo}?</h3>
          <h4 className="modal-name-activar">{nombre || 'Nombre no disponible'}</h4>
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
