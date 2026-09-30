import axiosInstance from "../api/AxiosInstance";

export const GetPedidosEnCamino = async () => {
  const response = await axiosInstance.get("/pedidosEnCamino");
  return response.data.data; // Retornar directamente los datos
};
