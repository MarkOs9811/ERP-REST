import React, { useState } from "react";
import axiosInstance from "@/api/AxiosInstance";
import { Button } from "../ui/button";
import { FileDownIcon, FileTextIcon, Loader2Icon } from "lucide-react";

const BotonReportePdf = ({
  reporteEspecifico,
  titulo = "Descargar Reporte",
}) => {
  console.log(reporteEspecifico, "reporteEspecifico");
  const [cargando, setCargando] = useState(false);

  const descargarPdf = async () => {
    try {
      setCargando(true);

      // 1. Petición a la API pasando el tipo de reporte en la URL
      const response = await axiosInstance.get(
        `/${reporteEspecifico}/reporte-pdf`,
        {
          responseType: "blob", // Notifica a Axios que devuelva datos binarios
        },
      );

      // 2. En Axios, el binario ya viene en response.data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const urlLocal = window.URL.createObjectURL(blob);

      // 3. Crear el enlace temporal para la descarga
      const enlace = document.createElement("a");
      enlace.href = urlLocal;
      enlace.setAttribute(
        "download",
        `Reporte_${reporteEspecifico}_${Date.now()}.pdf`,
      );

      // 4. Disparar clic y limpiar la memoria
      document.body.appendChild(enlace);
      enlace.click();
      enlace.parentNode.removeChild(enlace);
      window.URL.revokeObjectURL(urlLocal);
    } catch (error) {
      if (error.response && error.response.data instanceof Blob) {
        const errorText = await error.response.data.text();
        try {
          const jsonError = JSON.parse(errorText);
          console.error("Error exacto de Laravel:", jsonError.message);
        } catch {
          console.error("Error raw de Laravel:", errorText);
        }
      } else {
        console.error("Error al generar el reporte:", error.message);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <Button
      variant="ghostOutline"
      onClick={descargarPdf}
      disabled={cargando}
      className={` ${cargando ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {/* Spinner animado si está cargando, ícono de descarga si está libre */}
      {cargando ? (
        <Loader2Icon className="w-4 h-4 animate-spin" />
      ) : (
        <FileDownIcon className="w-4 h-4" />
      )}
      {cargando ? "Generando PDF..." : titulo}
    </Button>
  );
};

export default BotonReportePdf;
