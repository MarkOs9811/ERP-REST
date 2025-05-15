import axiosInstance from "../api/AxiosInstance";

export const GetMesas = async () => {
  const response = await axiosInstance.get("/vender/getMesas");
  return response.data;
};
