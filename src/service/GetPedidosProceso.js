import axiosInstance from "../api/AxiosInstance";

export const getPedidosEnProceso = async () => {
  const response = await axiosInstance.get("/pedidosEnProceso");
  return response.data.data; // Retornar directamente los datos
};
