import axiosInstance from "../api/AxiosInstance";

export const GetMisSolicitudes = async () => {
  try {
    const response = await axiosInstance.get("/misSolicitudes");
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data, // Asume que los datos están en `response.data.data`
      };
    } else {
      console.error("Error en la respuesta:", response.data.message);
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    console.error("Error al obtener las Solicitudes:", error);
    return {
      success: false,
      message: "Ocurrió un error al obtener las Solicitudes.",
    };
  }
};
