import axiosInstance from "../../api/AxiosInstance";

export const GetRegistroAsistencias = async () => {
  const response = await axiosInstance.get("/asistenciaList");
  return response.data.data; // Retornar directamente los datos
};
