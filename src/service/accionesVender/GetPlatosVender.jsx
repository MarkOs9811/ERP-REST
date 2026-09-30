import axiosInstance from "../../api/AxiosInstance";

export const GetPlatosVender = async () => {
  const response = await axiosInstance.get("/vender/getPlatos");
  return response.data.data; // Retornar directamente los datos
};
