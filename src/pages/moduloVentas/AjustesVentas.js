import { useState } from "react";
import "../../css/EstilosVentas.css";
import MetodoPago from "../../components/componentesVentas/componentesAjustesVentas/MetodoPago";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetMetodosPago } from "../../service/accionesVentas/GetMetodosPago";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

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
    <ContenedorPrincipal>
      <div className="row">
        <div className="col-lg-12">
          <div className="card p-3 shadow-sm">
            <div className="card-header">
              <h3>Ajustes de venta</h3>
            </div>
            <div className="card-body">
              {isLoading && <p>Cargando métodos de pago...</p>}
              {isError && <p>Error al cargar métodos de pago.</p>}
              {!isLoading && !isError && (
                <MetodoPago
                  metodos={metodosPago}
                  onToggle={handleCambiarEstado}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
