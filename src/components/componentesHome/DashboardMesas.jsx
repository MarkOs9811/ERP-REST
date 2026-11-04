import { useQuery } from "@tanstack/react-query";
import { GetMesasVender } from "../../service/accionesVender/GetMesasVender";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

import { Clock, Cookie, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";

const TiempoOcupacion = ({ fechaApertura }) => {
  const [minutos, setMinutos] = useState(0);

  useEffect(() => {
    if (!fechaApertura) return;

    const calcularTiempo = () => {
      const fechaParseada = new Date(fechaApertura);
      const ahora = new Date();
      const diferenciaMs = ahora - fechaParseada;
      const diffMinutos = Math.floor(diferenciaMs / 60000);

      setMinutos(diffMinutos > 0 ? diffMinutos : 0);
    };

    calcularTiempo();
    const intervalo = setInterval(calcularTiempo, 60000);

    return () => clearInterval(intervalo);
  }, [fechaApertura]);

  const esDemorado = minutos >= 60;

  return (
    <span
      className={`flex items-center gap-1 text-xs font-semibold ${
        esDemorado ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      <Clock size={13} /> {minutos} min
    </span>
  );
};
export function DashboardMesas() {
  const {
    data: mesas,
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey: ["mesasVender"],
    queryFn: GetMesasVender,
    refetchOnWindowFocus: true,
  });

  // FIX: Si tu API devuelve { data: [...] } lo extraemos.
  // Si ya es un array, lo tomamos directo. Si llega vacío o undefined, pasamos un [].
  const listaMesas = Array.isArray(mesas) ? mesas : mesas?.data || [];

  return (
    <Card className="salon-container m-0 flex h-full min-h-[300px] flex-col rounded-2xl border-border/70 bg-card p-4 text-card-foreground shadow-none">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "var(--bg-emerald-soft)",
              color: "var(--fw-emerald)",
            }}
          >
            <Cookie size={22} />
          </span>
          <div>
            <h2 className="mb-0 text-base font-semibold">Salón de mesas</h2>
            <p className="mb-0 text-xs text-muted-foreground">
              {listaMesas.length} mesas
            </p>
          </div>
          <Button asChild size="default">
            <Link to="/ventas/mesas">
              <Plus size={16} />{" "}
              {listaMesas.length === 0 ? "Crear mesas" : "Gestionar mesas"}
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="status-badge badge-libre">
            <span className="dot dot-libre"></span> LIBRE (
            {listaMesas.filter((m) => Number(m.estado) === 1).length})
          </span>
          <span className="status-badge badge-ocupado">
            <span className="dot dot-ocupado"></span> OCUPADO (
            {listaMesas.filter((m) => Number(m.estado) === 0).length})
          </span>
          <span className="status-badge badge-reservado">
            <span className="dot dot-reservado"></span> RESERVADO
          </span>
        </div>
      </div>

      {/* --- GRID VISUAL --- */}
      <CondicionCarga isLoading={loading} isError={error} mode="cards">
        <div className="home-salon-grid min-h-0 flex-1">
          {listaMesas.length === 0 && !loading && (
            <div className="rounded-lg border-amber-500/30 bg-amber-500/10 p-4 text-center text-sm text-amber-800 dark:text-amber-300">
              No se encontraron mesas.
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {listaMesas.map((mesa) => {
              const isLibre = Number(mesa.estado) === 1;
              const statusClass = isLibre ? "libre" : "ocupado";

              return (
                <div className="min-w-0" key={mesa.id}>
                  <Card
                    className={`mesa-card-flat flex h-full min-h-32 w-full flex-col rounded-lg p-3 text-left text-foreground ${
                      isLibre
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-rose-500/40 bg-rose-500/5"
                    }`}
                  >
                    <div className="mb-3 flex w-full items-center justify-between">
                      <span className="mesa-capacidad-flat text-xs text-muted-foreground">
                        CAPACIDAD: {mesa.capacidad}p
                      </span>
                      <span className={`dot dot- ${statusClass}`}></span>
                    </div>

                    <h4 className="mesa-numero-flat">Mesa {mesa.numero}</h4>

                    <div className="mesa-footer-flat mt-auto w-full pt-4">
                      {Number(mesa.estado) === 0 && (
                        <div className="mesa-total-preview mt-2 flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="text-xs text-muted-foreground"
                              style={{
                                fontSize: "0.65rem",
                                fontWeight: "700",
                                letterSpacing: "0.5px",
                              }}
                            >
                              TOTAL ACTUAL
                            </span>
                            {mesa.tiempo_apertura && (
                              <TiempoOcupacion
                                fechaApertura={mesa.tiempo_apertura}
                              />
                            )}
                          </div>
                          <span className="text-base font-bold">
                            S/ {Number(mesa.total || 0).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </CondicionCarga>
    </Card>
  );
}
