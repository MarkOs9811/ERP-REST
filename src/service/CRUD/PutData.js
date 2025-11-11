import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

export const PutData = async (tabla, id, data) => {
  try {
    const response = await axiosInstance.put(`/${tabla}/${id}`, data);

    if (response.data.success) {
      const message = response.data.message || "Se actualizó correctamente";
      ToastAlert("success", message);
      return true;
    }
    return false;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    ToastAlert("error", errorMessage);
    return false;
  }
};
