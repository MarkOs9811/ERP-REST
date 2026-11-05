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
import { GetConfi } from "../service/accionesConfiguracion/GetConfi";
import { isRestaurantBusiness } from "../utils/modulePermissions";

export function Home() {
  const {
    data: configuraciones = [],
    isLoading: loadingConfiguracion,
    isError: errorConfiguracion,
  } = useQuery({
    queryKey: ["confiEmpresa"],
    queryFn: GetConfi,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const esRestaurante = isRestaurantBusiness(configuraciones);

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
  const rutaVenta = esRestaurante ? "/vender/mesas" : "/vender/ventasLlevar";

  if (loadingConfiguracion) {
    return (
      <main className="mx-auto flex min-h-64 w-full max-w-[1600px] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground" role="status">
          Cargando el panel de tu negocio...
        </p>
      </main>
    );
  }

  if (errorConfiguracion) {
    return (
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6">
        <Card
          role="alert"
          className="border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          No se pudo cargar el tipo de venta de la empresa. Recarga la página
          para volver a intentar.
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-0 py-4 sm:py-5">
      <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <CabeceraHome
            cajaAbierta={!!cajaAbierta}
            esRestaurante={esRestaurante}
          />
        </div>
        <div className="min-w-0 lg:col-span-4">
          <Card className="flex h-full min-h-55 flex-col justify-between gap-5 rounded-2xl border-border/70 bg-card p-5 text-card-foreground shadow-none sm:p-6">
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
              <Link to={cajaAbierta ? rutaVenta : "/abrirCaja"}>
                <StoreIcon className="size-4" />
                <span>{cajaAbierta ? "Ir a caja" : "Abrir caja"}</span>
                <ArrowUpRight className="ml-auto size-4 sm:ml-0" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>

      <section aria-labelledby="home-summary-title" className="space-y-3">
        <div>
          <h2
            id="home-summary-title"
            className="mb-0 text-sm font-semibold tracking-tight text-foreground"
          >
            Resumen del día
          </h2>
          <p className="mb-0 text-xs text-muted-foreground">
            {esRestaurante
              ? "Ventas, ocupación del salón y pedidos"
              : "Ventas e inventario de productos"}
          </p>
        </div>
        <div className="w-full m-auto">
          <InformacionRapidaHome esRestaurante={esRestaurante} />
        </div>
      </section>

      <section
        aria-label={
          esRestaurante
            ? "Actividad del restaurante"
            : "Actividad de ventas e inventario"
        }
      >
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
          {esRestaurante && (
            <div className="col-span-full min-w-0 xl:col-span-8">
              <DashboardMesas />
            </div>
          )}
          <div
            className={`col-span-full min-w-0 ${esRestaurante ? "xl:col-span-4" : "xl:col-span-12"}`}
          >
            <div
              className={`grid h-full gap-3 ${esRestaurante ? "lg:grid-cols-1" : "lg:grid-cols-2"}`}
            >
              <CarouselMarketingHome />
              <VentasTipo
                ventasList={ventasList}
                load={loadingVentas}
                errorLoad={errorVentas}
                esRestaurante={esRestaurante}
              />
              <div className={esRestaurante ? "flex-1" : "lg:col-span-2"}>
                <UsuariosActivosHome />
              </div>
            </div>
          </div>
        </div>
      </section>

      {esRestaurante && (
        <section aria-label="Platos más vendidos">
          <PlatoMasVendido />
        </section>
      )}

      <section aria-label="Análisis de ventas">
        <GraficoIAhome />
      </section>
    </main>
  );
}
