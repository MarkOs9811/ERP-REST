import axiosInstance from "../../api/AxiosInstance";

export const GetPresupuestos = async (context) => {
  // 1. React Query inyecta automáticamente la queryKey en el contexto
  const [, mes] = context.queryKey;

  // 2. Construimos la URL. Si viene un mes (ej: "2026-06"), mapea el parámetro, si no, va limpio.
  const url = mes ? `/presupuestos?mes=${mes}` : "/presupuestos";

  // 3. Petición directa a tu endpoint de Laravel
  const response = await axiosInstance.get(url);

  // Retornamos los datos limpios que espera el componente
  return response.data.data;
};
