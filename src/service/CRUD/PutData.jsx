import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

// Asignamos valores por defecto: id=null, data={}
export const PutData = async (tabla, id = null, data = {}) => {
  try {
    const url = id ? `/${tabla}/${id}` : `/${tabla}`;
    const response = await axiosInstance.put(url, data);

    if (response.data.success) {
      const message = response.data.message || "Se actualizó correctamente";
      ToastAlert("success", message);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error en PutData:", error);
    const errorMessage = error.response?.data?.message || error.message;
    ToastAlert("error", errorMessage);
    return false;
  }
};
