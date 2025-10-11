// services/accionesGenerales/GetEstadoConfig.js
import axiosInstance from "../../api/AxiosInstance";

export const GetEstadoConfig = async ({ queryKey }) => {
  // queryKey = ["estadoIntegraciones", nombreConfig]
  const [, nombreConfig] = queryKey;
  const response = await axiosInstance.get(`/getEstadoConfig/${nombreConfig}`);
  return response.data.data;
};
