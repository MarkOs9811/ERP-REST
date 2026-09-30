import axiosInstance from "../../api/AxiosInstance";

export const GetPedidosAsignadosRider = async () => {
  const response = await axiosInstance.get("/delivery/pedidos-asignados");
  return response.data.data;
};
