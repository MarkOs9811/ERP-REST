import axiosInstance from "../api/AxiosInstance"; // Ajusta esta ruta según la ubicación de tu axiosInstance

export const getPreventaMesa = async (idMesa, idCaja) => {
  const response = await axiosInstance.get(
    `/vender/getPreventaMesa/${idMesa}/${idCaja}`
  );
  return response.data.data;
};
