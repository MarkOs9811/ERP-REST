// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetTipoContrato = async () => {
  const response = await axiosInstance.get("/contrato");
  return response.data.data; // Retornar directamente los datos
};
