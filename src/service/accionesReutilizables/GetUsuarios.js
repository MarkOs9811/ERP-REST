import axiosInstance from "../../api/AxiosInstance";

export const GetUsuarios = async () => {
  const response = await axiosInstance.get("/usuarios");
  return response.data.data; // Retornar directamente los datos
};
