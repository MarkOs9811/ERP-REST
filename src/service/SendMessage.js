import axiosInstance from "../api/AxiosInstance";

export const sendMessage = async ({ idPedido, mensaje }) => {
  try {
    const response = await axiosInstance.post("/chat", { idPedido, mensaje });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    throw error;
  }
};
