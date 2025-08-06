import axiosInstance from "../../api/AxiosInstance";

export const GetSedes = async () => {
  const response = await axiosInstance.get("/sedesAll");
  return response.data.data;
};
