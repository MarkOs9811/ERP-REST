import axiosInstance from "../../api/AxiosInstance";

export const GetAjustePlanilla = async () => {
  const response = await axiosInstance.get("/ajustesPlanilla");
  return response.data.data;
};
