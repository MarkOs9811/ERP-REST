import axiosInstance from "../../api/AxiosInstance";

export const GetMesasVender = async () => {
  const response = await axiosInstance.get("/vender/getMesas");
  return response.data.data;
};
