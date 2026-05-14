import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetFeedBacks } from "../../service/accionesClientes/GetFeedBacks";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { obtenerTiempoRelativo } from "../../utils/formatoFechas";
import "../../css/estilosClientes/EstilosFeedBack.css";
import { Star } from "lucide-react";

// Componente de Ítem Individual para mantenibilidad
const FeedbackItem = ({ row }) => {
  const iniciales = row.nombre
    ? row.nombre.substring(0, 2).toUpperCase()
    : "FW";

  return (
    <div className="list-group-item fw-feedback-item py-3 px-4">
      <div className="d-flex justify-content-between align-items-start">
        {/* Lado Izquierdo: Avatar e Info */}
        <div className="d-flex align-items-center">
          <div className="fw-avatar me-3 rounded-circle d-flex justify-content-center align-items-center">
            {row.foto ? <img src={row.foto} alt="Avatar" /> : iniciales}
          </div>

          <div className="d-flex flex-column">
            <span className="fw-nombre-texto">
              {row.nombre} {row.apellidos}
            </span>

            {/* Contenedor de Estrellas Lucide */}
            <div className="d-flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => {
                const isActive = i < row.calificacion;
                return (
                  <Star
                    key={i}
                    size={16} // Tamaño ajustado al diseño minimalista
                    className={isActive ? "fw-star-active" : "fw-star-inactive"}
                    fill={isActive ? "currentColor" : "none"} // Relleno si está activa, outline si no
                    strokeWidth={2.5}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Fecha */}
        <div className="text-end ms-auto">
          <span className="fw-fecha-texto">
            {obtenerTiempoRelativo(row.created_at, "Sin fecha")}
          </span>
        </div>
      </div>

      {/* Cuerpo: Comentario */}
      <div className="ps-5 ms-2 mt-2">
        <p
          className={
            row.comentario
              ? "fw-comentario-texto mb-0"
              : "fw-sin-comentario mb-0"
          }
        >
          {row.comentario ? `"${row.comentario}"` : "Sin comentario"}
        </p>
      </div>
    </div>
  );
};

export function ListaFeedBacks() {
  const [paginaActual, setPaginaActual] = useState(1);

  const {
    data: respuestaPaginada = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["feedBacks", paginaActual],
    queryFn: () => GetFeedBacks(paginaActual),
    keepPreviousData: true,
  });

  const feedbacks = respuestaPaginada.data || [];
  const meta = respuestaPaginada.meta || {};

  return (
    <CondicionCarga isLoading={isLoading} isError={isError}>
      {/* Lista Group de Bootstrap 5 */}
      <div className="list-group list-group-flush">
        {feedbacks.length > 0 ? (
          feedbacks.map((item) => <FeedbackItem key={item.id} row={item} />)
        ) : (
          <div className="p-5 text-center text-muted">
            No hay comentarios aún.
          </div>
        )}
      </div>

      {/* Paginación Manual (Mantiene los 15 por página del API) */}
      {meta.last_page > 1 && (
        <div className="overflow-hidden justify-content-center py-4 border-top">
          <nav>
            <ul className="pagination mb-0 gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual((p) => p - 1)}
              >
                Anterior
              </button>
              <span className="align-self-center mx-2 small text-muted">
                Página {paginaActual} de {meta.last_page}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={paginaActual === meta.last_page}
                onClick={() => setPaginaActual((p) => p + 1)}
              >
                Siguiente
              </button>
            </ul>
          </nav>
        </div>
      )}
    </CondicionCarga>
  );
}
