import axiosInstance from "../../api/AxiosInstance";

export const GetVerificacionCaja = async () => {
  console.log("🟡 INICIO GetVerificacionCaja");

  const response = await axiosInstance.get("/cajas/verificarActiva");

  console.log("🟡 RESPUESTA AXIOS:", response.data);

  const resultado = response.data;

  console.log("🟢 VOY A RETORNAR:", resultado);

  return resultado;
};
