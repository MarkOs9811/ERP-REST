// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetCargos = async () => {
  const response = await axiosInstance.get("/cargosAll");
  return response.data.data; // Retornar directamente los datos
};
