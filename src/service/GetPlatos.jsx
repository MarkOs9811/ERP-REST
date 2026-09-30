// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetPlatos = async () => {
  const response = await axiosInstance.get("/gestionPlatos/getPlatos");
  return response.data.data; // Retornar directamente los datos
};
