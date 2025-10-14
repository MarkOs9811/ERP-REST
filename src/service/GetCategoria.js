import axiosInstance from "../api/AxiosInstance";

export const GetCategoria = async () => {
  try {
    const response = await axiosInstance.get("/categorias");

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Ocurrió un error al obtener las categoria.",
    };
  }
};
