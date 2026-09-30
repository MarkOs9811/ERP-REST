// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const getVentas = async () => {
  const response = await axiosInstance.get("/ventas");
  return response.data.data; // Retornar directamente los datos
};
