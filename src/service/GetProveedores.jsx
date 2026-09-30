import axiosInstance from "../api/AxiosInstance";

export const GetProveedores = async () => {
  const response = await axiosInstance.get("/proveedores/getProveedores");
  return response.data.data;
};
