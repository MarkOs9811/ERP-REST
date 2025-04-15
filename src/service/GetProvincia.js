import axiosInstance from "../api/AxiosInstance";
export const GetProvincia = async (idDepartamento) => {
  const response = await axiosInstance.get(`/provincia/${idDepartamento}`);
  return response.data.data;
};
