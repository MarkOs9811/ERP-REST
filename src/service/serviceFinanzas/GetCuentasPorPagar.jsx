import axiosInstance from "../../api/AxiosInstance";
export const GetCuentasPorPagar = async () => {
  const response = await axiosInstance.get("/cuentasPorPagar");
  return response.data.data;
};
