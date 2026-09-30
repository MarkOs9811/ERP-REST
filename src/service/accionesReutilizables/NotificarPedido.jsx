import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

export const NotificarPedido = async (pedido) => {
  try {
    const response = await axiosInstance.post(
      "/pedidosWeb/notificarCliente",
      pedido
    );

    if (response.data.success) {
      ToastAlert("success", "Notificación enviada al cliente");
    } else {
      ToastAlert("warning", "El servidor respondió pero con fallo");
    }
  } catch (e) {
    ToastAlert("error", "Error al enviar la notificación");
    console.error(e);
  }
};
