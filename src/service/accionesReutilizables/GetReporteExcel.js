import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

export const GetReporteExcel = async (endpoint) => {
  try {
    const response = await axiosInstance.get(endpoint, {
      responseType: "blob", // 👈 importante para binarios
    });

    // Fecha y hora local simple (del navegador)
    const now = new Date();
    const fechaHora = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(
      now.getHours()
    ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}`;

    // Nombre dinámico
    const fileName = `${endpoint}_${fechaHora}.xlsx`;

    // Crear un enlace temporal para descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    ToastAlert("success", "Reporte generado con éxito");
  } catch (error) {
    ToastAlert("error", "Error al generar el reporte ");
    throw error;
  }
};
