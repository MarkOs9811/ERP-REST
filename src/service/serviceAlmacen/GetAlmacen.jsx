// serviceAlmacen/GetAlmacen.js
import axiosInstance from "../../api/AxiosInstance";

export const GetAlmacen = async () => {
  const response = await axiosInstance.get(`/almacen`);
  return response.data.data;
};
