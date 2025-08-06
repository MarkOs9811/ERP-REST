import axiosInstance from "../api/AxiosInstance";

export const RealizarVenta = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/vender/preventa/realizarVenta",
      data
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
    console.error("Error al realizar la venta", error);
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Error en el proceso",
      errorDetails: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      },
    };
  }
};
