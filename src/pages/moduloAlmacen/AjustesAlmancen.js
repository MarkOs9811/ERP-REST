import Categorias from "../../components/componenteAlmacen/componentesAjustesAlmacen/Categorias";
import UnidadMedida from "../../components/componenteAlmacen/componentesAjustesAlmacen/UnidadMedida";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { GetUnidades } from "../../service/serviceAlmacen/GetUnidades";
import { GetCategoria } from "../../service/serviceAlmacen/GetCategoria";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

export function AjustesAlmacen() {
  const queryClient = useQueryClient();

  const { data: categorias = [] } = useQuery({
    queryKey: ["categoriasAlmacen"],
    queryFn: GetCategoria,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: unidades = [] } = useQuery({
    queryKey: ["unidadesMedidas"],
    queryFn: GetUnidades,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleCambiarEstadoCategoria = async (id) => {
    try {
      // Petición para cambiar el estado (bandera) del cat3egoria
      const response = await axiosInstance.put(`/categorias-estado/${id}`);
      if (response.data.success) {
        ToastAlert("success", "Estado del categoria  actualizado");
        queryClient.invalidateQueries(["metodosPago"]);
      } else {
        ToastAlert("error", "No se pudo actualizar el estado");
      }
      // Refresca la lista de categorias
    } catch (error) {
      ToastAlert("error", "Error al cambiar el estado del categoria ");
      console.error("Error al cambiar el estado del categoria :", error);
    }
  };

  const handleCambiarEstadoUnidades = async (id) => {
    try {
      // Petición para cambiar el estado (bandera) del cat3egoria
      const response = await axiosInstance.put(`/unidadMedida-estado/${id}`);
      if (response.data.success) {
        ToastAlert("success", "Estado del unidadMedida  actualizado");
        queryClient.invalidateQueries(["metodosPago"]);
      } else {
        ToastAlert("error", "No se pudo actualizar el estado");
      }
      // Refresca la lista de unidadMedidas
    } catch (error) {
      ToastAlert("error", "Error al cambiar el estado del unidadMedida ");
      console.error("Error al cambiar el estado del unidadMedida :", error);
    }
  };

  return (
    <ContenedorPrincipal>
      <div className="card shadow-sm ">
        <div className="card-header border-bottom">
          <h4>Configuración de Almacén</h4>
        </div>
        <div className="card-body mb-4">
          <div className="row g-3">
            <div className="col-lg-6">
              <Categorias
                categorias={categorias}
                onToggle={handleCambiarEstadoCategoria}
              />
            </div>
            <div className="col-lg-6">
              <UnidadMedida
                unidades={unidades}
                onToggle={handleCambiarEstadoUnidades}
              />
            </div>
          </div>
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
