// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetHorarios = async () => {
  const response = await axiosInstance.get("/horarios");
  return response.data; // Retornar directamente los datos
};
