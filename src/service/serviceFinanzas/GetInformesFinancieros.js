import axiosInstance from "../../api/AxiosInstance";

export const GetInformesFinancieros = async () => {
  const response = await axiosInstance.get("/finazas/getInformes");
  return response.data.data;
};
