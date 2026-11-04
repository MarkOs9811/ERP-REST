import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetFeedBacks } from "../../service/accionesClientes/GetFeedBacks";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import { obtenerTiempoRelativo } from "../../utils/formatoFechas";

import { Star } from "lucide-react";
import { Button } from "../ui/button";

// Componente de Ítem Individual para mantenibilidad
const FeedbackItem = ({ row }) => {
  const iniciales = row.nombre
    ? row.nombre.substring(0, 2).toUpperCase()
    : "FW";

  return (
    <div className="relative block border-b bg-background text-foreground fw-feedback-item py-3 px-4">
      <div className="flex justify-between items-start">
        {/* Lado Izquierdo: Avatar e Info */}
        <div className="flex items-center">
          <div className="fw-avatar me-3 rounded-full flex justify-center items-center">
            {row.foto ? <img src={row.foto} alt="Avatar" /> : iniciales}
          </div>

          <div className="flex flex-col">
            <span className="fw-nombre-texto">
              {row.nombre} {row.apellidos}
            </span>

            {/* Contenedor de Estrellas Lucide */}
            <div className="flex gap-1 mt-1">
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
        <div className="text-right ms-auto">
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
      <div className="flex flex-col divide-y-0">
        {feedbacks.length > 0 ? (
          feedbacks.map((item) => <FeedbackItem key={item.id} row={item} />)
        ) : (
          <div className="p-5 text-center text-muted-foreground">
            No hay comentarios aún.
          </div>
        )}
      </div>

      {/* Paginación Manual (Mantiene los 15 por página del API) */}
      {meta.last_page > 1 && (
        <div className="overflow-hidden justify-center py-4 border-t">
          <nav>
            <div className="flex items-center justify-center gap-2">
              <Button
                className="border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual((p) => p - 1)}
               variant="default">
                Anterior
              </Button>
              <span className="self-center mx-2 text-sm text-muted-foreground">
                Página {paginaActual} de {meta.last_page}
              </span>
              <Button
                className="border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs"
                disabled={paginaActual === meta.last_page}
                onClick={() => setPaginaActual((p) => p + 1)}
               variant="default">
                Siguiente
              </Button>
            </div>
          </nav>
        </div>
      )}
    </CondicionCarga>
  );
}
