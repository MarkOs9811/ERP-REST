// DeleteData.js
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

export const DeleteData = async (tabla, id) => {
  try {
    const response = await axiosInstance.delete(`/${tabla}/${id}`);
    if (response.data.success) {
      ToastAlert("success", "Se eliminó correctamente");
      return true;
    }
    return false;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    ToastAlert("error", errorMessage);
    return false;
  }
};
