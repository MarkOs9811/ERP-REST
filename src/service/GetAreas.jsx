import axiosInstance from "../api/AxiosInstance";

export const GetAreas = async () => {
  const response = await axiosInstance.get("/areas");
  return response.data.data;
};
