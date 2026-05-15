import { StarHalfIcon } from "lucide-react";
import "../../css/estilosClientes/EstiloFidelizacion.css";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useState } from "react";
import { FormAddPromo } from "../../components/componenteCliente/FormAddPromo";
import { ListaCampañas } from "../../components/componenteCliente/ListaCampañas";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";

export function Fidelizacion() {
  const [modalAddCampaña, setModalAddCampaña] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient(); // Para refrescar la lista después de agregar una campaña
  const ID_FORMULARIO = "form-crear-campana";

  // Función asíncrona conectada al endpoint
  // Función asíncrona conectada al endpoint usando tu axiosInstance
  const handleSaveCampana = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/campanasPromos", data);

      ToastAlert("success", "Campaña creada exitosamente");
      queryClient.invalidateQueries(["campanasPromos"]); // Refresca la lista de campañas
      setModalAddCampaña(false); // Cerramos el modal
    } catch (error) {
      ToastAlert("error", error.response?.data?.message || error.message);
      console.error("Error al guardar la campaña:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card border-0">
      <div className="card-header">
        <div className="bannerFidelizacion w-100 rounded-4 p-4">
          <div className="bg-white rounded-pill opacity-75 d-inline-block px-2 me-2 mb-3 text-dark">
            <StarHalfIcon />
            Fidelización
          </div>
          <h2 className="fw-bold text-white mb-1">
            Programa de beneficios para clientes fieles
          </h2>
          <p className="text-white mb-0 ">
            Crea un programa de fidelización para premiar a tus clientes más
            leales.
          </p>
          <button
            onClick={() => setModalAddCampaña(true)}
            className="btn btn-outline-dark mt-5 text-danger fw-bold fs-6"
          >
            Crear Programa
          </button>
        </div>
      </div>
      <div className="card-body">
        <ListaCampañas />
      </div>

      <ModalRight
        isOpen={modalAddCampaña}
        onClose={() => setModalAddCampaña(false)}
        title="Crear Programa de Fidelización"
        submitText={isLoading ? "Guardando..." : "Guardar"}
        onSubmit={() => {
          document
            .getElementById(ID_FORMULARIO)
            .dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
        }}
        cancelText="Cancelar"
        onCancel={() => setModalAddCampaña(false)}
        icono={<StarHalfIcon size={20} />}
        width="500px"
        hideFooter={false}
      >
        <div className="p-3">
          {/* Inyectamos el formulario dentro del body del modal */}
          <FormAddPromo
            formId={ID_FORMULARIO}
            onSubmitHandler={handleSaveCampana}
          />
        </div>
      </ModalRight>
    </div>
  );
}
