import "../../css/EstilosModalReportes.css";

export default function ModalReportes({
  isOpen,
  setIsOpen,
  sheetUrl,
  data = {},
  titulo = "Reporte",
  fondo = "bg-light", // Cambiado a fondo claro por defecto
  tamaño = "modal-xl",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fw-reportes-overlay"
      tabIndex="-1"
      aria-labelledby="myExtraLargeModalLabel"
      role="dialog"
      aria-hidden="false"
    >
      <div
        className={`modal-dialog ${tamaño} modal-dialog-centered`}
        style={{ maxWidth: "90vw", width: "90vw" }}
      >
        <div className={`modal-content ${fondo} fw-reportes-content`}>
          <div className="modal-header fw-reportes-header">
            <div className="d-flex flex-column">
              <p className="modal-title mb-0 h5 fw-reportes-title">
                Reporte de {titulo}
              </p>
              <small className="fw-reportes-meta">
                De <span className="fw-semibold">{data.fechaInicio}</span> hasta{" "}
                <span className="fw-semibold">{data.fechaFin}</span>
              </small>
            </div>

            <button
              type="button"
              className="btn-close ms-3"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
          <div className="modal-body p-0">
            {sheetUrl && (
              <iframe
                src={sheetUrl}
                className="w-100 border-0"
                style={{ height: "82vh" }}
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
