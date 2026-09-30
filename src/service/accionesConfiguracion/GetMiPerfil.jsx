import axiosInstance from "../../api/AxiosInstance";

export const GetMiPerfil = async () => {
  const response = await axiosInstance.get("/miPerfil");
  return response.data.data;
};
