// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetPedidosWsp = async () => {
  const response = await axiosInstance.get("/pedidosWsp");
  return response.data.data; // Retornar directamente los datos
};
