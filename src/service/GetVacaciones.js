import axiosInstance from "../api/AxiosInstance";

export const GetVacaciones = async () => {
  const response = await axiosInstance.get("/vacaciones");
  return response.data.data;
};
