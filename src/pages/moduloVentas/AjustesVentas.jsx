import { useState } from "react";

import MetodoPago from "../../components/componentesVentas/componentesAjustesVentas/MetodoPago";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetMetodosPago } from "../../service/accionesVentas/GetMetodosPago";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export default function AjustesVentas() {
  const queryClient = useQueryClient();

  const {
    data: metodosPago,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["metodosPago"],
    queryFn: GetMetodosPago,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleCambiarEstado = async (id) => {
    try {
      // Petición para cambiar el estado (bandera) del método de pago
      const response = await axiosInstance.put(`/metodos-pagos/${id}`);
      if (response.data.success) {
        ToastAlert("success", "Estado del método de pago actualizado");
        queryClient.invalidateQueries(["metodosPago"]);
      } else {
        ToastAlert("error", "No se pudo actualizar el estado");
      }
      // Refresca la lista de métodos de pago
    } catch (error) {
      ToastAlert("error", "Error al cambiar el estado del método de pago");
      console.error("Error al cambiar el estado del método de pago:", error);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-full">
        <Card className="">
          <CardHeader className="border-0">
            <h4>Ajustes de venta</h4>
          </CardHeader>
          <CardContent className="">
            {isLoading && <p>Cargando métodos de pago...</p>}
            {isError && <p>Error al cargar métodos de pago.</p>}
            {!isLoading && !isError && (
              <MetodoPago
                metodos={metodosPago}
                onToggle={handleCambiarEstado}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
