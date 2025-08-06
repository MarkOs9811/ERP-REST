import axiosInstance from "../api/AxiosInstance";

export const getPedidosListos = async () => {
  const response = await axiosInstance.get("/pedidosListos");
  return response.data.data; // Retornar directamente los datos
};
