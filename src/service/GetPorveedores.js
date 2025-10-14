import axiosInstance from "../api/AxiosInstance";

export const GetPorveedores = async () => {
  const response = await axiosInstance.get("/proveedores/getProveedores");
  return response.data.data;
};
