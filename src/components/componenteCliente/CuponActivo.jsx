import { Tag, AlertCircle, ArrowRight, TicketCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { GetCampañaPromos } from "../../service/accionesClientes/GetCampañaPromos";
import { Button } from "../ui/button";

export function CuponActivoHome() {
  const {
    data: listaCampañas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["campanasPromos"],
    queryFn: GetCampañaPromos,
    refetchOnWindowFocus: false,
  });

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Sin fecha";
    return new Date(fechaString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading || isError) {
    return (
      <div className="relative flex h-full min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-background to-teal-50 p-5 text-center dark:border-emerald-400/15 dark:from-emerald-950/35 dark:via-card dark:to-teal-950/25 sm:p-6">
        {isLoading ? (
          <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <div
              className="size-5 animate-spin rounded-full border-2 border-emerald-600/20 border-t-emerald-600"
              role="status"
              aria-label="Cargando campañas"
            />
          </div>
        ) : (
          <AlertCircle className="mb-3 size-8 text-destructive" />
        )}
        <span className="text-sm text-muted-foreground">
          {isLoading ? "Cargando..." : "Error de conexión"}
        </span>
      </div>
    );
  }

  const campanaActiva = listaCampañas.length > 0 ? listaCampañas[0] : null;

  if (!campanaActiva) {
    return (
      <div className="relative flex h-full min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-background to-teal-50 p-5 text-center dark:border-emerald-400/15 dark:from-emerald-950/35 dark:via-card dark:to-teal-950/25 sm:p-6">
        <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          <Tag className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mb-1.5 text-lg font-semibold tracking-tight text-foreground">
          Sin campañas activas
        </h2>
        <p className="mb-4 max-w-xs text-sm leading-5 text-muted-foreground">
          Crea una promoción para premiar a tus clientes.
        </p>
        <Button
          asChild
          className="mt-auto h-9 gap-2 rounded-lg"
          variant="default"
        >
          <Link to="/clientes/fidelizacion">
            Nueva campaña
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-background to-teal-50 p-5 text-foreground dark:border-emerald-400/15 dark:from-emerald-950/35 dark:via-card dark:to-teal-950/25 sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-14 size-44 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/15"
      />
      <div className="relative flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between gap-2 pr-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-white/70 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-300/15 dark:bg-emerald-400/10 dark:text-emerald-300">
            <TicketCheck className="size-3.5" aria-hidden="true" />
            Promoción activa
          </span>
          <span className="text-xs text-muted-foreground">
            {listaCampañas.length} disponibles
          </span>
        </div>

        <h2 className="mb-1.5 line-clamp-1 text-lg font-semibold tracking-tight text-foreground">
          {campanaActiva.nombre || "Promoción especial"}
        </h2>
        <p className="mb-3 text-sm leading-5 text-muted-foreground">
          {campanaActiva.descuento
            ? `${campanaActiva.descuento}% de descuento aplicado`
            : "Beneficio especial activo"}
        </p>

        <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-emerald-200/70 bg-white/60 px-3 py-2 dark:border-emerald-300/10 dark:bg-black/10">
          <span className="text-xs font-medium text-muted-foreground">
            Código de cupón
          </span>
          <span className="truncate font-mono text-sm font-semibold tracking-wide text-foreground">
            {campanaActiva.codigo_cupon || "CUPON"}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-emerald-200/70 pt-3 dark:border-emerald-300/15">
          <div>
            <span className="mb-0.5 block text-xs text-muted-foreground">
              Válido hasta
            </span>
            <span className="text-sm font-medium text-foreground">
              {formatearFecha(campanaActiva.fecha_fin)}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            Activo
          </span>
        </div>
      </div>
    </div>
  );
}
