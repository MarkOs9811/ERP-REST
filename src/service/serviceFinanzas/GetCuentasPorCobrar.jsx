import axiosInstance from "../../api/AxiosInstance";
export const GetCuentasPorCobrar = async () => {
  const response = await axiosInstance.get("/cuentasPorCobrar");
  return response.data.data;
};
