import "../css/EstilosHome.css";

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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreIcon } from "lucide-react";
import { Button } from "../components/ui/button";
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

  const navigate = useNavigate();
  const caja = useSelector((state) => state.caja.caja);
  const cajaAbierta = caja?.estado === "abierto" && caja?.id;
  const nombreCaja = caja?.nombre || caja?.nombreCaja || "Sin caja";

  return (
    <div className="home-shell mx-auto w-full max-w-[1600px] space-y-4 px-3 py-3 sm:px-4">
      <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <CabeceraHome cajaAbierta={!!cajaAbierta} />
        </div>
        <div className="min-w-0 lg:col-span-4">
          <Card className="home-caja-card relative h-full min-h-55 overflow-hidden rounded-xl border border-border bg-card p-4 text-card-foreground">
            <div className="hero-decoration"></div>
            <div className="relative z-1 flex h-full flex-col">
              <p className="mb-2 flex items-center gap-2 font-medium text-muted-foreground">
                <span
                  className={`status-dot rounded-full ${
                    cajaAbierta ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                ></span>
                {cajaAbierta ? "Caja abierta" : "Caja cerrada"}
              </p>
              <h2 className="mb-2 text-xl font-bold text-foreground">
                {nombreCaja}
              </h2>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">
                {cajaAbierta
                  ? "¡Buen trabajo! Mantén el control de tus ventas."
                  : "Caja cerrada. Abre la caja para comenzar a vender."}
              </p>
              <Button
                className={`btn-principal flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold shadow-sm transition ${
                  cajaAbierta ? "btn-ir-a-caja" : "btn-abrir-caja"
                }`}
                onClick={() =>
                  navigate(cajaAbierta ? "/vender/mesas" : "/abrirCaja")
                }
               variant="default">
                <StoreIcon size={20} />
                <span>{cajaAbierta ? "Ir a Caja" : "Abrir Caja"}</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <section>
        <InformacionRapidaHome />
      </section>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <DashboardMesas />
        </div>
        <div className="min-w-0 xl:col-span-4">
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

      <section>
        <PlatoMasVendido />
      </section>

      <section>
        <GraficoIAhome />
      </section>
    </div>
  );
}
