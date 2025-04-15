// import axiosInstanceJava from "../api/AxiosInstanceJava";
import axiosInstance from "../api/AxiosInstance";
export const GetPlanillaCargo = async (idCargo) => {
  const response = await axiosInstance.get(`/planilla/${idCargo}`);
  return response.data.data; // Retornar directamente los datos
};
