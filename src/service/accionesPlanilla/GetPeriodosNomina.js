import axiosInstance from "../../api/AxiosInstance";

export const GetPeriodosNomina = async () => {
  const response = await axiosInstance.get("/periodoNomina");
  return response.data.data;
};
