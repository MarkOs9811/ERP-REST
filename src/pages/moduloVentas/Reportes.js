import { useState } from "react";
import FormularioReporte from "../../components/componentesReporte/FormularioReporte";
import ModalReportes from "../../components/componentesReutilizables/ModalReportes";
import axiosInstance from "../../api/AxiosInstance";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import { EstadoIntegraciones } from "../../hooks/EstadoIntegraciones";

export function Reportes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
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
    <div className="card shadow-sm border-0  p-3">
      <div className="row g-3 mb-4">
        <div className="col-md-12">
          <h3 className="mb-4">Reportes</h3>{" "}
        </div>
        <FormularioReporte
          titulo="Reporte de Ventas"
          onSubmit={handleReporte1}
          isLoading={loadingTipo === "ventas"}
          tipo="ventas"
          estadoIntegracionGoogle={estadoGoogleConfig}
        />
        <FormularioReporte
          titulo="Reporte de Cajas"
          onSubmit={handleReporte1}
          isLoading={loadingTipo === "cajas"}
          tipo={"cajas"}
          estadoIntegracionGoogle={estadoGoogleConfig}
        />
        <FormularioReporte
          titulo="Reporte de Inventario"
          onSubmit={handleReporte1}
          isLoading={loadingTipo === "inventario"}
          tipo={"inventario"}
          estadoIntegracionGoogle={estadoGoogleConfig}
        />
        <FormularioReporte
          titulo="Reporte de Compras"
          onSubmit={handleReporte1}
          isLoading={loadingTipo === "compras"}
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
