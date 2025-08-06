import axiosInstance from "../../api/AxiosInstance";

export const GetCategoriaPlatos = async () => {
  const response = await axiosInstance.get("/gestionPlatos/getCategoria");

  return response.data.data;
};
