// serviceAlmacen/GetAlmacen.js
import axiosInstance from "../../api/AxiosInstance";

export const GetAlmacen = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(`/almacen?page=${pageParam}`);

  return {
    data: response.data.data, // Usa el mismo nombre que el backend
    meta: response.data.meta,
  };
};
