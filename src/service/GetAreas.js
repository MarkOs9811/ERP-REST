import axiosInstance from "../api/AxiosInstance";

export const GetAreas = async () => {
  try {
    const response = await axiosInstance.get("/areas");

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
      message: "Ocurrió un error al obtener las Áreas.",
    };
  }
};
