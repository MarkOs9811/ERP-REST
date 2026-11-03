import Categorias from "../../components/componenteAlmacen/componentesAjustesAlmacen/Categorias";
import UnidadMedida from "../../components/componenteAlmacen/componentesAjustesAlmacen/UnidadMedida";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { GetUnidades } from "../../service/serviceAlmacen/GetUnidades";
import { GetCategoria } from "../../service/serviceAlmacen/GetCategoria";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


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
    <div>
      <Card className="py-2">
        <CardHeader className="border-bottom-0 flex flex-col flex-md-row justify-between items-center gap-2 p-3">
          <div className="d-flex align-items-center">
            <CardTitle asChild><h4 className="mb-0 titulo-card-especial">
              Configuración de Almacén
            </h4></CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
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
        </CardContent>
      </Card>
    </div>
  );
}
