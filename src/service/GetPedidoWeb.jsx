// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetPedidoWeb = async ({ id }) => {
  const response = await axiosInstance.get(`/pedidosWeb/${id}`);
  return response.data.data; // Retornar directamente los datos
};
