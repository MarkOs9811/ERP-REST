import axiosInstance from "../api/AxiosInstance"; // Ajusta esta ruta según la ubicación de tu axiosInstance

export const getPreventaMesa = async (idMesa, idCaja) => {
  try {
    const response = await axiosInstance.get(
      `/vender/getPreventaMesa/${idMesa}/${idCaja}`
    );
    if (response.data.success) {
      return {
        success: true,
        preventas: response.data.preVenta,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error desconocido",
      };
    }
  } catch (error) {
    console.error("Error al obtener preventa de la mesa", error);
    return {
      success: false,
      message: "Error en la solicitud",
    };
  }
};
