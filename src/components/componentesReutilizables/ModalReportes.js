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
      className={`modal fade show bd-example-modal-xl`}
      tabIndex="-1"
      aria-labelledby="myExtraLargeModalLabel"
      role="dialog"
      style={{
        display: "block",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo más claro (0.5 de opacidad)
      }}
      aria-hidden="false"
    >
      <div
        className={`modal-dialog ${tamaño} modal-dialog-centered`}
        style={{ maxWidth: "90vw", width: "90vw" }}
      >
        <div className={`modal-content ${fondo} border-0 shadow-lg`}>
          {" "}
          {/* Añadido sombra y sin borde */}
          <div className="modal-header bg-light p-3 d-flex justify-content-between align-items-center">
            {/* Contenedor del título y descripción (alineados verticalmente) */}
            <div className="d-flex flex-column">
              <p className="modal-title text-dark mb-0 h5">
                Reporte de {titulo}
              </p>
              <small className="text-muted">
                De{" "}
                <span className="fw-semibold text-dark">
                  {data.fechaInicio}
                </span>{" "}
                hasta{" "}
                <span className="fw-semibold text-dark">{data.fechaFin}</span>
              </small>
            </div>

            {/* Botón de cierre alineado al centro verticalmente */}
            <button
              type="button"
              className="btn-close ms-3 "
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
          <div className="modal-body p-0">
            {" "}
            {/* Sin padding para que el iframe ocupe todo */}
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
