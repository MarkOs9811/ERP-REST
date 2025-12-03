import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";

// Aceptamos fechaInicio y fechaFin como opcionales (por defecto null)
export const GetReporteExcel = async (
  endpoint,
  fechaInicio = null,
  fechaFin = null
) => {
  try {
    // Axios se encarga de armar la URL (ej: endpoint?fecha_inicio=2023-01-01&fecha_fin=...)
    const response = await axiosInstance.get(endpoint, {
      responseType: "blob",
      params: {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      },
    });

    const now = new Date();
    const fechaHora = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(
      now.getHours()
    ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}`;

    // Nombre dinámico
    const fileName = `Reporte_${fechaHora}.xlsx`;

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // Limpieza
    link.remove();
    window.URL.revokeObjectURL(url);

    ToastAlert("success", "Reporte generado con éxito");
  } catch (error) {
    console.error(error);
    ToastAlert("error", "Error al generar el reporte");
    throw error;
  }
};
