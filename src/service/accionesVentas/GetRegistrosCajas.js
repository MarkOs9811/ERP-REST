import axiosInstance from "../../api/AxiosInstance";

export const GetRegistrosCajas = async () => {
  const response = await axiosInstance.get("/registrosCajas");
  return response.data.data;
};
