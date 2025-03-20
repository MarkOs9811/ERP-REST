// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetCompras = async () => {
  const response = await axiosInstance.get("/compras");
  return response.data.data; // Retornar directamente los datos
};
