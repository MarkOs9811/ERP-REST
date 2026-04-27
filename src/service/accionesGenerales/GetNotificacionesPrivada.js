import axiosInstance from "../../api/AxiosInstance";

export const GetNotificacionesPrivadas = async () => {
  const response = await axiosInstance.get("/notificacionesPrivadas");

  return response.data.data;
};
