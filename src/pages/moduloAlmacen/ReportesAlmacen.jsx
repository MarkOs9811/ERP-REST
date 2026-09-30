import FormularioReporte from "../../components/componentesReporte/FormularioReporte";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { useState } from "react";
import ModalReportes from "../../components/componentesReutilizables/ModalReportes";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import { EstadoIntegraciones } from "../../hooks/EstadoIntegraciones";

export function ReportesAlmacen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [fechas, setFechas] = useState([]);
  const [loadingTipo, setLoadingTipo] = useState(""); // Ej: "almacen-google" o "almacen-clasico"
  const [tipoGenerado, setTipoGenerado] = useState("");

  const {
    data: estadoGoogleConfig,
    isLoading,
    isError,
    error,
  } = EstadoIntegraciones("Google Service");

  // --- HANDLER PARA GOOGLE SHEETS ---
  const handleReporteGoogle = async (data) => {
    setLoadingTipo(`${data.tipo}-google`);
    try {
      const response = await axiosInstance.post("/reportes/google-sheet", data);
      if (response.data.success) {
        ToastAlert("success", "Reporte generado en Google Sheets", false);
        setSheetUrl(response.data.data);
        setFechas(data);
        setIsModalOpen(true);
        setTipoGenerado(data.tipo);
      } else {
        ToastAlert(
          "error",
          "Error al generar reporte: " + response.data.message,
          false,
        );
      }
    } catch (error) {
      ToastAlert("error", "Hubo un error al generar el reporte.", false);
    } finally {
      setLoadingTipo("");
    }
  };

  // --- HANDLER PARA EXCEL CLÁSICO ---
  const handleReporteClasico = async (data) => {
    setLoadingTipo(`${data.tipo}-clasico`);
    try {
      const response = await axiosInstance.post("/reportes/clasico", data, {
        responseType: "blob", // La clave mágica para archivos
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Reporte_${data.tipo}_${data.fechaInicio}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      ToastAlert("success", "Excel descargado con éxito", false);
    } catch (error) {
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
        ToastAlert("error", "Hubo un error al descargar el Excel.", false);
      }
    } finally {
      setLoadingTipo("");
    }
  };

  if (isLoading) return <p>Cargando estado...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="card shadow-sm p-3">
        <h3 className="mb-4">Reportes</h3>
        <div className="row g-3 mb-4">
          <FormularioReporte
            titulo="Reporte de Almacen"
            onSubmitGoogle={handleReporteGoogle}
            onSubmitClasico={handleReporteClasico}
            isLoadingGoogle={loadingTipo === "almacen-google"}
            isLoadingClasico={loadingTipo === "almacen-clasico"}
            tipo="almacen"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
          <FormularioReporte
            titulo="Reporte de Movimientos"
            onSubmitGoogle={handleReporteGoogle}
            onSubmitClasico={handleReporteClasico}
            isLoadingGoogle={loadingTipo === "movimiento-google"}
            isLoadingClasico={loadingTipo === "movimiento-clasico"}
            tipo="movimiento"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
          <FormularioReporte
            titulo="Reporte de Kardex"
            onSubmitGoogle={handleReporteGoogle}
            onSubmitClasico={handleReporteClasico}
            isLoadingGoogle={loadingTipo === "kardex-google"}
            isLoadingClasico={loadingTipo === "kardex-clasico"}
            tipo="kardex"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
          <FormularioReporte
            titulo="Reporte de Solcitudes"
            onSubmitGoogle={handleReporteGoogle}
            onSubmitClasico={handleReporteClasico}
            isLoadingGoogle={loadingTipo === "solicitudes-google"}
            isLoadingClasico={loadingTipo === "solicitudes-clasico"}
            tipo="solicitudes"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
        </div>
      </div>

      {loadingTipo && (
        <div className="d-flex justify-content-center">
          <Cargando />
        </div>
      )}

      <ModalReportes
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        sheetUrl={sheetUrl}
        titulo={tipoGenerado}
        fondo="bg-light"
        data={fechas}
        tamaño="modal-xl"
      />
    </div>
  );
}
