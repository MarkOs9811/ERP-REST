import { useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import FormularioReporteGeneral from "../../components/componentesReporte/FormularioReporteGeneral";
import FormularioReportes from "../../components/componentesReporte/FormularioReporte";
import ModalReportes from "../../components/componentesReutilizables/ModalReportes";
import { EstadoIntegraciones } from "../../hooks/EstadoIntegraciones";

export function ReportePlanilla() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [loading, setLoading] = useState(false); // Si lo usas para el modal
  const [fechas, setFechas] = useState([]);
  const [loadingTipo, setLoadingTipo] = useState(""); // Ej: 'planilla-google', 'asistencias-clasico'
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
        responseType: "blob", // Para manejar el archivo binario (Excel)
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
      <div className="card shadow-sm border-0 p-3">
        <div className="row g-3 mb-4">
          <div className="col-md-12">
            <h3 className="mb-4">Reportes Planilla</h3>
          </div>

          <FormularioReportes
            titulo="Reporte de Planilla"
            onSubmitGoogle={handleReporteGoogle}
            onSubmitClasico={handleReporteClasico}
            isLoadingGoogle={loadingTipo === "planilla-google"}
            isLoadingClasico={loadingTipo === "planilla-clasico"}
            tipo="planilla"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />

          <FormularioReportes
            titulo="Reporte de Asistencias"
            onSubmitGoogle={handleReporteGoogle}
            onSubmitClasico={handleReporteClasico}
            isLoadingGoogle={loadingTipo === "asistencias-google"}
            isLoadingClasico={loadingTipo === "asistencias-clasico"}
            tipo="asistencias"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />

          <FormularioReportes
            titulo="Reporte de Horas extras"
            onSubmitGoogle={handleReporteGoogle}
            onSubmitClasico={handleReporteClasico}
            isLoadingGoogle={loadingTipo === "horasExtras-google"}
            isLoadingClasico={loadingTipo === "horasExtras-clasico"}
            tipo="horasExtras"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />

          <FormularioReportes
            titulo="Reporte de Adelanto Sueldo"
            onSubmitGoogle={handleReporteGoogle}
            onSubmitClasico={handleReporteClasico}
            isLoadingGoogle={loadingTipo === "adelantoSueldo-google"}
            isLoadingClasico={loadingTipo === "adelantoSueldo-clasico"}
            tipo="adelantoSueldo"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />

          <FormularioReportes
            titulo="Reporte de Vacaciones"
            onSubmitGoogle={handleReporteGoogle}
            onSubmitClasico={handleReporteClasico}
            isLoadingGoogle={loadingTipo === "vacaciones-google"}
            isLoadingClasico={loadingTipo === "vacaciones-clasico"}
            tipo="vacaciones"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
        </div>
      </div>

      {isModalOpen && (
        <ModalReportes
          isOpen={isModalOpen}
          setIsOpen={() => setIsModalOpen(false)}
          sheetUrl={sheetUrl}
          data={fechas}
          fechas={fechas}
          titulo={tipoGenerado}
          loading={loading}
          tipoGenerado={tipoGenerado}
        />
      )}
    </div>
  );
}
