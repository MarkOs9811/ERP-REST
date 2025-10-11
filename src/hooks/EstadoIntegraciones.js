// hooks/useEstadoIntegraciones.js
// hooks/useEstadoIntegraciones.js
import { useQuery } from "@tanstack/react-query";
import { GetEstadoConfig } from "../service/accionesGenerales/GetEstadoConfig";

export const EstadoIntegraciones = (nombreConfig) => {
  return useQuery({
    queryKey: ["estadoIntegraciones", nombreConfig], // cache distinto por config
    queryFn: GetEstadoConfig,
    staleTime: 1000 * 60 * 5,
    enabled: !!nombreConfig, // evita ejecutar si no se pasa nombre
  });
};
