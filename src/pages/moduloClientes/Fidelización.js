import { StarHalfIcon } from "lucide-react";
import "../../css/estilosClientes/EstiloFidelizacion.css";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useState } from "react";
import { FormAddPromo } from "../../components/componenteCliente/FormAddPromo";
import { ListaCampañas } from "../../components/componenteCliente/ListaCampañas";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";
import { BannerFidelizacion } from "../../components/componenteCliente/BannerFidelización";

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
        <BannerFidelizacion
          botonAction={"crear"}
          modalAddCampaña={modalAddCampaña}
          setModalAddCampaña={setModalAddCampaña}
        />
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
