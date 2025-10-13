import { useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Hook para generar reportes en PDF desde un elemento HTML.
 * @param {string} nombreSalida - Nombre por defecto del archivo PDF.
 * @returns {Function} generarReporte
 */
export const useGenerarReporte = (nombreSalida = "reporte.pdf") => {
  const generarReporte = useCallback(
    async (elementRef, nombreArchivo) => {
      if (!elementRef?.current) {
        console.error("Referencia inválida: el elemento no existe");
        return;
      }

      const elemento = elementRef.current;
      const canvas = await html2canvas(elemento, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let position = 0;

      if (pdfHeight > pageHeight) {
        // dividir contenido largo en varias páginas
        let y = 0;
        while (y < pdfHeight) {
          pdf.addImage(imgData, "PNG", 0, -y, pdfWidth, pdfHeight);
          y += pageHeight;
          if (y < pdfHeight) pdf.addPage();
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      }

      // si no se pasa nombreArchivo, usa nombreSalida
      pdf.save(nombreArchivo || nombreSalida);
    },
    [nombreSalida]
  );

  return generarReporte;
};
