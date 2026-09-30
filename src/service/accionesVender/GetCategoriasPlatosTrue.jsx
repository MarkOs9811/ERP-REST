import axiosInstance from "../../api/AxiosInstance";

export const GetCategoriasPlatosTrue = async () => {
  const response = await axiosInstance.get("/gestionPlatos/getCategoriaTrue");
  return response.data.data;
};
