import { CabeceraHome } from "../components/componentesHome/CabeceraHome";
import { InformacionRapidaHome } from "../components/componentesHome/InformacionRapidaHome";
import { GraficoIAhome } from "../components/componentesHome/GraficoIAhome";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { UsuariosActivosHome } from "../components/componentesHome/UsuariosActivosHome";
import { PlatoMasVendido } from "../components/componentesHome/PlatosMasVendidos";
import { VentasTipo } from "../components/componentesHome/VentasTipo";
import { CarouselMarketingHome } from "../components/componentesHome/CarouselMarketingHome";
import { DashboardMesas } from "../components/componentesHome/DashboardMesas";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowUpRight, StoreIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "@/components/ui/card";

export function Home() {
  const {
    data: ventasList = [],
    isLoading: loadingVentas,
    isError: errorVentas,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const caja = useSelector((state) => state.caja.caja);
  const cajaAbierta = caja?.estado === "abierto" && caja?.id;
  const nombreCaja = caja?.nombre || caja?.nombreCaja || "Sin caja";

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:px-5 lg:px-6">
      <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <CabeceraHome cajaAbierta={!!cajaAbierta} />
        </div>
        <div className="min-w-0 lg:col-span-4">
          <Card className="flex h-full min-h-[220px] flex-col justify-between gap-5 rounded-2xl border-border/70 bg-card p-5 text-card-foreground shadow-none sm:p-6">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className={
                  cajaAbierta
                    ? "gap-1.5 border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "gap-1.5 border-muted-foreground/20 bg-muted text-muted-foreground"
                }
              >
                <span
                  className={`size-1.5 rounded-full ${
                    cajaAbierta ? "bg-emerald-600" : "bg-muted-foreground"
                  }`}
                />
                {cajaAbierta ? "Caja abierta" : "Caja cerrada"}
              </Badge>
              <div className="space-y-1.5">
                <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">
                  {nombreCaja}
                </h2>
                <p className="mb-0 text-sm leading-5 text-muted-foreground">
                  {cajaAbierta
                    ? "Tu turno está activo. Continúa con las ventas."
                    : "Abre una caja para iniciar tu jornada de ventas."}
                </p>
              </div>
            </div>
            <Button
              asChild
              className="h-10 w-full gap-2 rounded-lg sm:w-auto"
              variant="default"
            >
              <Link to={cajaAbierta ? "/vender/mesas" : "/abrirCaja"}>
                <StoreIcon className="size-4" />
                <span>{cajaAbierta ? "Ir a caja" : "Abrir caja"}</span>
                <ArrowUpRight className="ml-auto size-4 sm:ml-0" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>

      <section
        aria-labelledby="home-summary-title"
        className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-3 sm:p-4"
      >
        <div>
          <h2
            id="home-summary-title"
            className="mb-0 text-sm font-semibold tracking-tight text-foreground"
          >
            Resumen del día
          </h2>
          <p className="mb-0 text-xs text-muted-foreground">
            Ventas, mesas, pedidos y almacén
          </p>
        </div>
        <InformacionRapidaHome />
      </section>

      <section
        aria-label="Actividad del salón y ventas"
        className="rounded-2xl border border-border/60 bg-muted/20 p-3 sm:p-4"
      >
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
          <div className="col-span-full min-w-0 xl:col-span-8">
            <DashboardMesas />
          </div>
          <div className="col-span-full min-w-0 xl:col-span-4">
            <div className="flex h-full flex-col gap-3">
              <CarouselMarketingHome />
              <VentasTipo
                ventasList={ventasList}
                load={loadingVentas}
                errorLoad={errorVentas}
              />
              <div className="flex-1">
                <UsuariosActivosHome />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Productos más vendidos">
        <PlatoMasVendido />
      </section>

      <section aria-label="Análisis de ventas">
        <GraficoIAhome />
      </section>
    </main>
  );
}
