import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

export const PostData = async (tabla, data) => {
  try {
    const response = await axiosInstance.post(`/${tabla}`, data);

    if (response.data.success) {
      const message = response.data.message || "Se registró correctamente";
      ToastAlert("success", message);
      return true; // Éxito
    }
    return false;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    ToastAlert("error", errorMessage);
    return false;
  }
};
