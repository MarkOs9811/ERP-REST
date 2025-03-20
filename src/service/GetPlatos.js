// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetPlatos = async () => {
  const response = await axiosInstance.get("/vender/getPlatos");
  return response.data.productos; // Retornar directamente los datos
};
