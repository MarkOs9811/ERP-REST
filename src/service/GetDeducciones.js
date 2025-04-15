// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetDeducciones = async () => {
  const response = await axiosInstance.get("/deducciones");
  return response.data.data; // Retornar directamente los datos
};
