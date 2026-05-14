import { useQuery } from "@tanstack/react-query";
import { ListaFeedBacks } from "../../components/componenteCliente/ListaFeedBacks";
import { GetFeedBackIndicadores } from "../../service/accionesClientes/GetFeedBacks";
import { formatearNumeroCompacto } from "../../utils/formatearNumeroCompacto";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";

export function FeedBack() {
  const {
    data: respuestaIndicadores = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["indicadoresFeedBack"],
    queryFn: () => GetFeedBackIndicadores(),
    keepPreviousData: true,
  });

  const indicadores = respuestaIndicadores.data || {};

  return (
    <div className="card border-0">
      <div className="card-header">
        <div>
          <h4 className="fw-bold text-fw-main mb-1">FeedBacks</h4>
          <p className="text-fw-muted mb-0">
            Aquí puedes ver los comentarios de tus clientes.
          </p>
        </div>
      </div>

      <div className="card-body">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <div className="row g-3 mb-4">
            {/* Tarjeta 1: Promedio */}
            <div className="col-md-4">
              <div className="card d-flex flex-row align-items-center gap-3 p-3 h-100">
                <div className="leftDetalle">
                  <p
                    className="fw-bold mb-0"
                    style={{ fontSize: "2.5rem", color: "var(--fw-emerald)" }}
                  >
                    {indicadores.promedio_calificacion || "0.0"}
                  </p>
                </div>
                <div className="detalle d-flex flex-column justify-content-center align-items-start gap-1">
                  <h4 className="fw-bold m-0 text-secondary">Score General</h4>
                  <span className="small m-0 text-muted">
                    Promedio de estrellas
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Total de Feedbacks */}
            <div className="col-md-4">
              <div className="card d-flex flex-row align-items-center gap-3 p-3 h-100">
                <div className="leftDetalle">
                  <p
                    className="fw-bold mb-0"
                    style={{
                      fontSize: "2.5rem",
                      color: "var(--fw-strawberry)",
                    }}
                  >
                    {/* APLICAMOS EL FORMATO AQUÍ */}
                    {formatearNumeroCompacto(indicadores.total_feedbacks)}
                  </p>
                </div>
                <div className="detalle d-flex flex-column justify-content-center align-items-start gap-1">
                  <h4 className="fw-bold m-0 text-secondary">Comentarios</h4>
                  <span className="small m-0 text-muted">Total de reseñas</span>
                </div>
              </div>
            </div>

            {/* Tarjeta para la palabra que más se repite */}
            <div className="col-md-4">
              <div className="card d-flex flex-row align-items-center gap-3 p-3 h-100">
                <div className="leftDetalle">
                  <p
                    className="fw-bold mb-0 text-truncate"
                    style={{
                      fontSize: "2rem",
                      color: "var(--fw-emerald)",
                      maxWidth: "120px",
                    }}
                  >
                    {/* Cambiamos el "0" por un texto acorde */}
                    {indicadores.palabra_mas_repetida || "N/A"}
                  </p>
                </div>
                <div className="detalle d-flex flex-column justify-content-center align-items-start gap-1">
                  <h4 className="fw-bold m-0 text-secondary">Tendencia</h4>
                  <span className="small m-0 text-muted">
                    Palabra más usada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CondicionCarga>

        <div className="row">
          <div className="col-md-12">
            <div className="card d-flex flex-column gap-3 p-3">
              <ListaFeedBacks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
