import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import axiosInstance from "@/api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { Badge } from "../ui/badge";

export function ModalCargaMasiva({ handleClose, onUpdate }) {
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [reporteResultados, setReporteResultados] = useState(null); // Estado para guardar el JSON del backend

  const handleSubirExcel = async () => {
    if (!archivo) {
      ToastAlert(
        "error",
        "Por favor, selecciona un archivo Excel (.xlsx o .csv)",
      );
      return;
    }

    const formData = new FormData();
    formData.append("archivo_excel", archivo);

    try {
      setCargando(true);
      setReporteResultados(null); // Limpiar resultados anteriores

      const response = await axiosInstance.post(
        "/almacen/importar-masivo",
        formData,
      );

      if (response.data.success === true || response.data.success === "true") {
        ToastAlert("success", response.data.message);

        // Guardamos el desglose en el estado para mostrarlo abajo
        setReporteResultados(response.data.resultados);

        onUpdate(); // Refresca la tabla principal de almacén
      } else {
        ToastAlert(
          "error",
          response.data.message || "Error al procesar el archivo",
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error de conexión.";
      ToastAlert("error", errorMessage);
      console.error("Error Carga Masiva:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex items-start gap-3">
        <AlertCircle className="size-5 shrink-0 mt-0.5" />
        <p className="mb-0">
          <strong>Regla de importación:</strong> Sube un archivo con columnas
          llamadas <b>nombre</b>, <b>laboratorio</b> y <b>precio</b> en la
          primera fila. Los productos repetidos se mostrarán en el reporte
          inferior.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/70 rounded-xl p-6 bg-muted/20">
        <FileSpreadsheet className="size-10 text-muted-foreground mb-2" />
        <input
          type="file"
          id="file-upload"
          accept=".xlsx, .csv, .xls"
          className="hidden"
          onChange={(e) => setArchivo(e.target.files[0])}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2"
        >
          {archivo ? archivo.name : "Seleccionar archivo Excel"}
        </label>
      </div>

      {/* --- SECCIÓN INFERIOR: REPORTE DETALLADO DE ESTADOS --- */}
      {reporteResultados && (
        <div className="flex flex-col gap-3 border rounded-xl p-4 bg-muted/10">
          <h4 className="text-sm font-bold text-foreground mb-1">
            Resumen de importación:
          </h4>

          {/* Lista de Subidos con Éxito */}
          {reporteResultados.subidos.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="size-4" /> Productos nuevos agregados (
                {reporteResultados.subidos.length}):
              </span>
              <div className="max-h-28 overflow-y-auto flex flex-col gap-1 pr-1">
                {reporteResultados.subidos.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-md text-emerald-900"
                  >
                    <span className="font-medium truncate max-w-[200px]">
                      {item.nombre} ({item.laboratorio})
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-emerald-100 border-emerald-300"
                    >
                      {item.codigo}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de No Subidos (Duplicados) */}
          {reporteResultados.no_subidos.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                <XCircle className="size-4" /> Productos omitidos por duplicidad
                ({reporteResultados.no_subidos.length}):
              </span>
              <div className="max-h-28 overflow-y-auto flex flex-col gap-1 pr-1">
                {reporteResultados.no_subidos.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-md text-amber-900"
                  >
                    <span className="font-medium truncate max-w-[200px]">
                      {item.nombre} ({item.laboratorio})
                    </span>
                    <span className="text-[10px] italic text-amber-700">
                      {item.motivo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-2 border-t pt-4">
        <Button variant="outline" onClick={handleClose} disabled={cargando}>
          {reporteResultados ? "Cerrar" : "Cancelar"}
        </Button>
        <Button
          onClick={handleSubirExcel}
          disabled={cargando}
          className="gap-2"
        >
          <UploadCloud size={18} />
          {cargando ? "Importando..." : "Subir e Importar"}
        </Button>
      </div>
    </div>
  );
}
