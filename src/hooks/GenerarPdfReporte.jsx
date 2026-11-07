import { useCallback } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export const useGenerarReporte = (nombreSalida = "reporte.pdf") => {
  const generarReporte = useCallback(
    async (elementRef, nombreArchivo) => {
      const elemento = elementRef?.current;

      if (!elemento) {
        console.error("Referencia inválida: el elemento no existe");
        return;
      }

      try {
        const canvas = await html2canvas(elemento, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: document.documentElement.clientWidth,
          windowHeight: document.documentElement.clientHeight,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);

        const pdfWidth = pageWidth;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);

        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();

          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);

          heightLeft -= pageHeight;
        }

        pdf.save(nombreArchivo || nombreSalida);
      } catch (error) {
        console.error("Error al generar el PDF:", error);
      }
    },
    [nombreSalida],
  );

  return generarReporte;
};
