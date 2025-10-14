import axiosInstance from "../../api/AxiosInstance";
export const GetLibroMayor = async () => {
  const response = await axiosInstance.get("/libroMayor");
  return response.data.data;
};
