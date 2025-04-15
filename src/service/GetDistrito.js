import axiosInstance from "../api/AxiosInstance";
export const GetDistrito = async (idProvincia) => {
  const response = await axiosInstance.get(`/distrito/${idProvincia}`);
  return response.data.data;
};
