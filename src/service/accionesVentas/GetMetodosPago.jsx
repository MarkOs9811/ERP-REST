import axiosInstance from "../../api/AxiosInstance";

export const GetMetodosPago = async () => {
  const response = await axiosInstance.get("/metodos-pagos");
  return response.data.data;
};
