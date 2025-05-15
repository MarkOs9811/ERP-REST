import axiosInstance from "../../api/AxiosInstance";

export const GetRecomendaciones = async () => {
  // Enviar los datos normalizados al backend
  const response = await axiosInstance.post("/recomendaciones");
  return response.data.data; // Devolver solo las recomendaciones
};
