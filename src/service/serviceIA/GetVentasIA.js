import axiosInstance from "../../api/AxiosInstance";

export const GetVentasIA = async () => {
  const response = await axiosInstance.get("/ventasIA");
  return response.data.data;
};
