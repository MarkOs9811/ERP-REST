import axiosInstance from "../../api/AxiosInstance";

export const GetVerificacionCaja = async () => {
  const response = await axiosInstance.get("/cajas/verificarActiva");
  return response.data.data; // Retornar directamente los datos
};
