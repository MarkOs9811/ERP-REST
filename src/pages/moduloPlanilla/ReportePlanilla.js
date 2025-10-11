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
  const [loading, setLoading] = useState(false); // Estado de carga
  const [fechas, setFechas] = useState([]);
  const [loadingTipo, setLoadingTipo] = useState(""); // puede ser 'almacen', 'movimiento', 'kardex'
  const [tipoGenerado, setTipoGenerado] = useState("");

  const handleReporte1 = async (data) => {
    setLoadingTipo(data.tipo); // activa el loading solo para ese tipo

    try {
      const response = await axiosInstance.post("/reportes/google-sheet", {
        ...data,
        tipo: data.tipo,
      });

      ToastAlert("success", "Reporte generado con éxito", false);

      if (response.data.success) {
        setSheetUrl(response.data.data);
        setFechas(data);
        setIsModalOpen(true);
        setTipoGenerado(data.tipo);
      } else {
        ToastAlert(
          "error",
          "Error al generar reporte: " + response.data.message,
          false
        );
      }
    } catch (error) {
      ToastAlert("error", "Hubo un error al generar el reporte.", false);
    } finally {
      setLoadingTipo(""); // desactiva el loading
    }
  };

  const {
    data: estadoGoogleConfig,
    isLoading,
    isError,
    error,
  } = EstadoIntegraciones("Google Service");

  if (isLoading) return <p>Cargando estado...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return (
    <ContenedorPrincipal>
      <div className="card shadow-sm border-0  p-3">
        <div className="row g-3 mb-4">
          <div className="col-md-12">
            <h3 className="mb-4">Reportes Planilla </h3>{" "}
          </div>
          <FormularioReporteGeneral
            titulo="Reporte de Planilla"
            onSubmit={handleReporte1}
            isLoading={loadingTipo === "planilla"}
            tipo="planilla"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
          <FormularioReportes
            titulo="Reporte de Asistencias"
            onSubmit={handleReporte1}
            isLoading={loadingTipo === "asistencias"}
            tipo="asistencias"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
          <FormularioReportes
            titulo="Reporte de Horas extras"
            onSubmit={handleReporte1}
            isLoading={loadingTipo === "horasExtras"}
            tipo="horasExtras"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
          <FormularioReportes
            titulo="Reporte de Adelanto Sueldo"
            onSubmit={handleReporte1}
            isLoading={loadingTipo === "adelantoSueldo"}
            tipo="adelantoSueldo"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
          <FormularioReportes
            titulo="Reporte de Vacaciones"
            onSubmit={handleReporte1}
            isLoading={loadingTipo === "vacaciones"}
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
    </ContenedorPrincipal>
  );
}
