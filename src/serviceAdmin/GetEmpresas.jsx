import axiosInstance from "../api/AxiosInstance";

export const GetEmpresas = async () => {
  const response = await axiosInstance.get("/superadmin/empresas");
  return response.data.data;
};
