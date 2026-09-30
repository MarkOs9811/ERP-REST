import axiosInstance from "../api/AxiosInstance";

export const GetAdelantoSueldo = async () => {
  const response = await axiosInstance.get("/adelantoSueldo");
  return response.data.data;
};
