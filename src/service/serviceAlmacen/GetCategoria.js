import axiosInstance from "../../api/AxiosInstance";

export const GetCategoria = async () => {
  const response = await axiosInstance.get("/categoriasAlmacen");
  return response.data.data; // Retornar directamente los datos
};
