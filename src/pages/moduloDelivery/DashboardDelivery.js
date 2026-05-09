import { useQuery } from "@tanstack/react-query";
import { VentasTipo } from "../../components/componentesHome/VentasTipo";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GraficoVentasDelivery } from "../../components/componenteDelivery/GraficoVentaDelivery";

export function DashboardDelivery() {
  const {
    data: ventasList = [],
    isLoading: loadingVentas, // Corregido: en React Query suele ser isLoading
    isError: errorVentas, // Corregido: en React Query suele ser isError
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  return (
    <div className="card">
      <GraficoVentasDelivery
        ventasList={ventasList}
        load={loadingVentas}
        errorLoad={errorVentas}
      />
    </div>
  );
}
