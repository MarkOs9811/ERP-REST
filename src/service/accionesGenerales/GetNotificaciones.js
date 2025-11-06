import axiosInstance from "../../api/AxiosInstance";

export const GetNotificaciones = async () => {
  const response = await axiosInstance.get("/notificaciones");

  return response.data.data;
};
