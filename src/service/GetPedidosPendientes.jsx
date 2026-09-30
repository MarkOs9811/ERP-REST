import axiosInstance from "../api/AxiosInstance";

export const getPedidosPendientes = async () => {
  const response = await axiosInstance.get("/pedidosPendientes");
  return response.data.data; // Retornar directamente los datos
};
