import axiosInstance from "../api/AxiosInstance";

export const GetAsistencia = async () => {
  const response = await axiosInstance.get("/asistencia");
  return response.data.data; // Retornar directamente los datos
};
