import axiosInstance from "../../api/AxiosInstance";

// Petición para la TABLA (Paginada)
export const GetClientesLista = async (page = 1) => {
  const response = await axiosInstance.get(`/clientes?page=${page}`);
  return response.data; // Devuelves todo para tener 'data' y 'meta' (paginación)
};

// Petición exclusiva para el DASHBOARD (Métricas pre-calculadas)
export const GetClientesDashboard = async () => {
  const response = await axiosInstance.get("/clientes/metricas-dashboard");
  return response.data.data;
};
