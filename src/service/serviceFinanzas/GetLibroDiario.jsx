import axiosInstance from "../../api/AxiosInstance";
export const getLibroDiario = async () => {
  const response = await axiosInstance.get("/libroDiario");
  return response.data.data;
};
