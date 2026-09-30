import axiosInstance from "../api/AxiosInstance";

export const GetPedidosAsignados = async () => {
  const response = await axiosInstance.get("/pedidosAsignados");
  return response.data.data; // Retornar directamente los datos
};
