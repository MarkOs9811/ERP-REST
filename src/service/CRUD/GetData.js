// DeleteData.js
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

export const GetData = async (tabla) => {
  try {
    const response = await axiosInstance.get(`/${tabla}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Error al obtener los datos");
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    ToastAlert("error", errorMessage);
    return false;
  }
};
