import axiosInstance from "../../api/AxiosInstance";

export const GetUnidades = async () => {
  const response = await axiosInstance.get("/unidadMedidaAll");
  return response.data.data; // Retornar directamente los datos
};
