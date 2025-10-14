import axiosInstance from "../../api/AxiosInstance";

export const GetPresupuestos = async () => {
  const response = await axiosInstance.get("/presupuestos");
  return response.data.data;
};
