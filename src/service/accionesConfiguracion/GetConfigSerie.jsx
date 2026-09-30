import axiosInstance from "../../api/AxiosInstance";

export const GetConfiSerie = async () => {
  const response = await axiosInstance.get("/configuraciones/serieCorrelativo");
  return response.data.data;
};
