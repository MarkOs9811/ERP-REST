import axiosInstance from "../../../api/AxiosInstance";

export const GetGoogle = async () => {
  const response = await axiosInstance.get("/getGoogleConfig");
  return response.data.data;
};
