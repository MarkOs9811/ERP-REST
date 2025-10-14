import axiosInstance from "../api/AxiosInstance";

export const GetHorasExtras = async () => {
  const response = await axiosInstance.get("/horasExtras");
  return response.data.data; // Retornar directamente los datos
};
