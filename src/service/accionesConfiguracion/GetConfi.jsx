import axiosInstance from "../../api/AxiosInstance";

export const GetConfi = async () => {
  const response = await axiosInstance.get("/configuraciones");
  return response.data.data;
};
