import axiosInstance from "../api/AxiosInstance";

export const GetMisSolicitudes = async () => {
  const response = await axiosInstance.get("/misSolicitudes");
  return response.data.data;
};
