import { useQuery } from "@tanstack/react-query";
import { ListaFeedBacks } from "../../components/componenteCliente/ListaFeedBacks";
import { GetFeedBackIndicadores } from "../../service/accionesClientes/GetFeedBacks";
import { formatearNumeroCompacto } from "../../utils/formatearNumeroCompacto";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


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
    <Card className="">
      <CardHeader className="">
        <div>
          <h4 className="fw-bold text-fw-main mb-1">FeedBacks</h4>
          <p className="text-fw-muted mb-0">
            Aquí puedes ver los comentarios de tus clientes.
          </p>
        </div>
      </CardHeader>

      <CardContent className="">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
            {/* Tarjeta 1: Promedio */}
            <div className="md:col-span-4">
              <Card className="flex flex-row items-center gap-3 p-3 h-full">
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
              </Card>
            </div>

            {/* Tarjeta 2: Total de Feedbacks */}
            <div className="md:col-span-4">
              <Card className="flex flex-row items-center gap-3 p-3 h-full">
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
              </Card>
            </div>

            {/* Tarjeta para la palabra que más se repite */}
            <div className="md:col-span-4">
              <Card className="flex flex-row items-center gap-3 p-3 h-full">
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
              </Card>
            </div>
          </div>
        </CondicionCarga>

        <div className="row">
          <div className="md:col-span-12">
            <Card className="flex flex-col gap-3 p-3">
              <ListaFeedBacks />
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
