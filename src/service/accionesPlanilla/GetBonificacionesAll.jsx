import axiosInstance from "../../api/AxiosInstance";

export const GetBonificacionAll = async () => {
  const response = await axiosInstance.get("/bonificacionesAll");
  return response.data.data; // Retornar directamente los datos
};
