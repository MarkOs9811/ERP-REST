import axiosInstance from "../../api/AxiosInstance";

export const GetEmpleadoId = async (id) => {
  const response = await axiosInstance.get(`/nominaEmpleado/${id}`);
  return response.data.data;
};
