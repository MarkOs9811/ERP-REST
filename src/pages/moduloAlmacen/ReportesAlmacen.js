import FormularioReporte from "../../components/componentesReporte/FormularioReporte";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import axiosInstance from "../../api/AxiosInstance";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { useState } from "react";
import ModalReportes from "../../components/componentesReutilizables/ModalReportes";
import { Cargando } from "../../components/componentesReutilizables/Cargando";
import { EstadoIntegraciones } from "../../hooks/EstadoIntegraciones";

export function ReportesAlmacen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga
  const [fechas, setFechas] = useState([]);
  const [loadingTipo, setLoadingTipo] = useState(""); // puede ser 'almacen', 'movimiento', 'kardex'
  const [tipoGenerado, setTipoGenerado] = useState("");

  const handleReporte1 = async (data) => {
    setLoadingTipo(data.tipo); // activa el loading solo para ese tipo
    console.log("tipo movimiento:", data.tipo);
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
    <div>
      <div className="card shadow-sm p-3">
        <h3 className="mb-4">Reportes</h3>
        <div className="row g-3 mb-4">
          <FormularioReporte
            titulo="Reporte de Almacen"
            onSubmit={handleReporte1}
            isLoading={loadingTipo === "almacen"}
            tipo="almacen"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
          <FormularioReporte
            titulo="Reporte de Movimientos"
            onSubmit={handleReporte1}
            isLoading={loadingTipo === "movimiento"}
            tipo="movimiento"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
          <FormularioReporte
            titulo="Reporte de Kardex"
            onSubmit={handleReporte1}
            isLoading={loadingTipo === "kardex"}
            tipo="kardex"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
          <FormularioReporte
            titulo="Reporte de Solcitudes"
            onSubmit={handleReporte1}
            isLoading={loadingTipo === "solicitudes"}
            tipo="solicitudes"
            estadoIntegracionGoogle={estadoGoogleConfig}
          />
        </div>
      </div>

      {/* Mostrar gif de carga mientras se genera el reporte */}
      {loading && (
        <div className="d-flex justify-content-center">
          <Cargando />{" "}
        </div>
      )}

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
