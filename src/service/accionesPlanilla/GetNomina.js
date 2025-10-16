import axiosInstance from "../../api/AxiosInstance";

export const GetNomina = async () => {
  const response = await axiosInstance.get("/nomina");
  return response.data.data;
};
