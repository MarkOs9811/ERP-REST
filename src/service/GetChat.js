// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetChat = async ({ idPedido }) => {
  const response = await axiosInstance.get(`/chat/${idPedido}`);
  return response.data.data; // Retornar directamente los datos
};
