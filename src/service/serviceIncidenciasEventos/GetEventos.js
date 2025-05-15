import axiosInstance from "../../api/AxiosInstance";

export const GetEventos = async () => {
  const response = await axiosInstance.get("eventos");
  return response.data.data;
};
