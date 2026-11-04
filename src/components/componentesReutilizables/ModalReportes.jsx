
import { X } from "lucide-react";
import { Button } from "../ui/button";

export default function ModalReportes({
  isOpen,
  setIsOpen,
  sheetUrl,
  data = {},
  titulo = "Reporte",
  fondo = "bg-background",
  tamaño = "max-w-7xl",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fw-reportes-overlay"
      tabIndex="-1"
      aria-labelledby="report-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <div className={`mx-auto flex max-h-[92vh] w-[90vw] ${tamaño}`}>
        <div
          className={`overflow-hidden rounded-xl ${fondo} fw-reportes-content`}
        >
          <div className="flex items-center justify-between border-b p-4 fw-reportes-header">
            <div className="flex flex-col">
              <p
                id="report-modal-title"
                className="mb-0 text-lg font-semibold leading-none tracking-tight fw-reportes-title"
              >
                Reporte de {titulo}
              </p>
              <small className="fw-reportes-meta">
                De <span className="font-semibold">{data.fechaInicio}</span>{" "}
                hasta <span className="font-semibold">{data.fechaFin}</span>
              </small>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Cerrar reporte"
              onClick={() => setIsOpen(false)}
            >
              <X />
            </Button>
          </div>
          <div className="p-0">
            {sheetUrl && (
              <iframe
                src={sheetUrl}
                className="h-[82vh] w-full border-0"
                title={titulo}
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
