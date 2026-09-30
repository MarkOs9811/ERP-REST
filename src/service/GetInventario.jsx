import axiosInstance from "../api/AxiosInstance";

export const GetInventario = async () => {
  const response = await axiosInstance.get("/inventario");
  return response.data.data; // Retornar directamente los datos
};
