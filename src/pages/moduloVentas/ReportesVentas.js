import { useState } from "react";
import FormularioReporte from "../../components/componentesReporte/FormularioReporte";
import ModalReportes from "../../components/componentesReutilizables/ModalReportes";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { EstadoIntegraciones } from "../../hooks/EstadoIntegraciones";

export function ReportesVentas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [fechas, setFechas] = useState([]);
  const [loadingTipo, setLoadingTipo] = useState(""); // Ej: 'ventas-google', 'ventas-clasico'
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
      setLoadingTipo(""); // desactiva el loading
    }
  };

  // --- HANDLER PARA EXCEL CLÁSICO ---
  const handleReporteClasico = async (data) => {
    setLoadingTipo(`${data.tipo}-clasico`);
    try {
      const response = await axiosInstance.post("/reportes/clasico", data, {
        responseType: "blob", // Para descargar el archivo binario
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
    <div className="card shadow-sm border-0 p-3">
      <div className="row g-3 mb-4">
        <div className="col-md-12">
          <h3 className="mb-4">Reportes</h3>
        </div>

        <FormularioReporte
          titulo="Reporte de Ventas"
          onSubmitGoogle={handleReporteGoogle}
          onSubmitClasico={handleReporteClasico}
          isLoadingGoogle={loadingTipo === "ventas-google"}
          isLoadingClasico={loadingTipo === "ventas-clasico"}
          tipo="ventas"
          estadoIntegracionGoogle={estadoGoogleConfig}
        />

        <FormularioReporte
          titulo="Reporte de Cajas"
          onSubmitGoogle={handleReporteGoogle}
          onSubmitClasico={handleReporteClasico}
          isLoadingGoogle={loadingTipo === "cajas-google"}
          isLoadingClasico={loadingTipo === "cajas-clasico"}
          tipo={"cajas"}
          estadoIntegracionGoogle={estadoGoogleConfig}
        />

        <FormularioReporte
          titulo="Reporte de Inventario"
          onSubmitGoogle={handleReporteGoogle}
          onSubmitClasico={handleReporteClasico}
          isLoadingGoogle={loadingTipo === "inventario-google"}
          isLoadingClasico={loadingTipo === "inventario-clasico"}
          tipo={"inventario"}
          estadoIntegracionGoogle={estadoGoogleConfig}
        />

        <FormularioReporte
          titulo="Reporte de Compras"
          onSubmitGoogle={handleReporteGoogle}
          onSubmitClasico={handleReporteClasico}
          isLoadingGoogle={loadingTipo === "compras-google"}
          isLoadingClasico={loadingTipo === "compras-clasico"}
          tipo="compras"
          estadoIntegracionGoogle={estadoGoogleConfig}
        />
      </div>

      {/* Modal para mostrar la hoja de cálculo */}
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
