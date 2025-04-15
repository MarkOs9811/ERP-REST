import axiosInstance from "../api/AxiosInstance";
export const GetDepartamento = async () => {
  const response = await axiosInstance.get("/departamento");
  return response.data.data; // Retornar directamente los datos
};
