import { useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { FormularioReporteClasico } from "../../components/componentesReporte/FormularioReporteClasico";

export function ReporteDelivery() {
  const [fechas, setFechas] = useState([]);
  const [loadingTipo, setLoadingTipo] = useState("");
  const [tipoGenerado, setTipoGenerado] = useState("");

  const handleReporte1 = async (data) => {
    // data YA CONTIENE: { fechaInicio, fechaFin, tipo }
    setLoadingTipo(data.tipo);

    try {
      // 1. Añadimos { responseType: 'blob' } para decirle a Axios que recibiremos un archivo
      const response = await axiosInstance.post("/reportes/clasico", data, {
        responseType: "blob",
      });

      // 2. Creamos una URL temporal en la memoria del navegador para el archivo Excel
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // 3. Creamos un enlace <a> invisible, le ponemos la URL y forzamos el clic para descargar
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Reporte_${data.tipo}_${data.fechaInicio}.xlsx`,
      );

      document.body.appendChild(link);
      link.click(); // Forzamos la descarga

      // 4. Limpiamos la memoria
      link.remove();
      window.URL.revokeObjectURL(url);

      ToastAlert("success", "Reporte descargado con éxito", false);
      setFechas([data.fechaInicio, data.fechaFin]);
      setTipoGenerado(data.tipo);
    } catch (error) {
      // 5. Manejo de errores especial:
      // Como pedimos un "blob", si el backend manda un error JSON (ej. 404 No hay datos),
      // viene envuelto en formato Blob. Debemos leerlo para sacar el mensaje.
      if (
        error.response &&
        error.response.data instanceof Blob &&
        error.response.data.type === "application/json"
      ) {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        ToastAlert(
          "error",
          errorJson.message || "Error al generar reporte",
          false,
        );
      } else {
        ToastAlert(
          "error",
          "Hubo un error al conectar con el servidor.",
          false,
        );
      }
    } finally {
      setLoadingTipo(""); // desactiva el loading
    }
  };

  return (
    <div className="container-fluid ">
      <div className="card">
        <div className="card-header">
          <h3>Reporte de Delivery</h3>
        </div>
        <div className="card-body">
          <FormularioReporteClasico
            titulo="Reporte de Delivery"
            onSubmit={handleReporte1}
            tipo="pedidosWebRegistros"
            isLoading={loadingTipo === "pedidosWebRegistros"}
          />
        </div>
      </div>
    </div>
  );
}
