import axiosInstance from "../../api/AxiosInstance";

export const GetPedidosCocina = async () => {
  const response = await axiosInstance.get("/getPedidoCocina");
  return response.data.data;
};
