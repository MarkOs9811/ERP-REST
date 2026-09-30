import axiosInstance from "../api/AxiosInstance";
export const GetBonificacion = async () => {
  const response = await axiosInstance.get("/bonificaciones");
  return response.data.data; // Retornar directamente los datos
};
