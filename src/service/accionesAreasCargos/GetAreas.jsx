import axiosInstance from "../../api/AxiosInstance";

export const GetAreas = async () => {
  const response = await axiosInstance.get("/areasAll");
  return response.data.data;
};
