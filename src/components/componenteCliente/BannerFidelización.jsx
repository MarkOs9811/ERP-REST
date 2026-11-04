import { ArrowRight, Sparkles, StarHalfIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function BannerFidelizacion({
  botonAction,
  modalAddCampaña = false,
  setModalAddCampaña = null,
}) {
  return (
    <div className="relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-xl border border-violet-200/70 bg-gradient-to-br from-violet-50 via-background to-fuchsia-50 p-5 text-foreground dark:border-violet-400/15 dark:from-violet-950/35 dark:via-card dark:to-fuchsia-950/25 sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-14 size-44 rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-500/15"
      />
      <div className="relative flex h-full flex-col">
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-white/70 px-2.5 py-1 text-xs font-medium text-violet-700 dark:border-violet-300/15 dark:bg-violet-400/10 dark:text-violet-300">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Fidelización
          </span>
        </div>

        <h2 className="mb-1.5 text-lg font-semibold tracking-tight text-foreground">
          Programa de beneficios
        </h2>
        <p className="mb-5 max-w-sm text-sm leading-5 text-muted-foreground">
          Premia a tus clientes más leales con campañas exclusivas y puntos por
          cada compra.
        </p>

        {botonAction === "crear" ? (
          <Button
            className="mt-auto h-9 w-fit gap-2 rounded-lg"
            onClick={() => setModalAddCampaña?.(true)}
          >
            Crear campaña
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            asChild
            className="mt-auto h-9 w-fit gap-2 rounded-lg"
            variant="outline"
          >
            <Link to="/clientes/fidelizacion">
              Ver campañas
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
