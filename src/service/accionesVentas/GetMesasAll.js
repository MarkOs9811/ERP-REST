import axiosInstance from "../../api/AxiosInstance";

export const GetMesasAll = async () => {
  const response = await axiosInstance.get("/mesasAll");
  return response.data.data;
};
