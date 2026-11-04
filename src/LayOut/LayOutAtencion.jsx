import { useEffect } from "react";
import { CabeceraHome } from "../components/componentesHome/CabeceraHome";
import { InformacionRapidaHome } from "../components/componentesHome/InformacionRapidaHome";
import { PlatoMasVendido } from "../components/componentesHome/PlatosMasVendidos";
import { UsuariosActivosHome } from "../components/componentesHome/UsuariosActivosHome";
import { VentasTipo } from "../components/componentesHome/VentasTipo";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { DashboardMesas } from "../components/componentesHome/DashboardMesas";
import { RocketIcon, StoreIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export function LayOutAtencion() {
  useEffect(() => {
    const shapes = [
      "shape-circle",
      "shape-square",
      "shape-diamond",
      "shape-blob",
    ];
    document.querySelectorAll(".dashboard-card").forEach((card) => {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      card.classList.add(randomShape);
    });
  }, []);

  const {
    data: ventasList = [],
    onLoading: loadingVentas,
    onError: errorVentas,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const navigate = useNavigate();
  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      {/* CABECERA HERO MEJORADA */}
      <div className="home-hero mb-4 p-4 bg-background rounded-lg flex items-center justify-between relative overflow-hidden">
        {/* Decoración de fondo opcional para darle un toque premium */}
        <div className="hero-decoration"></div>

        <div className="home-hero-content relative z-1">
          <span className="border py-0.5 text-xs transition-colors bg-primary/10 text-light rounded-full px-3 font-semibold inline-flex items-center gap-2">
            <RocketIcon />
            Panel ejecutivo
          </span>
          <h1 className="home-hero-title font-bold text-foreground mb-1">
            Dashboard
          </h1>
          <p className="home-hero-subtitle text-muted-foreground mb-0">
            Resumen general y métricas en tiempo real de tu negocio.
          </p>
        </div>

        <div className="text-right relative z-1 flex flex-col items-end">
          <p className="mb-2 font-medium text-muted-foreground flex items-center gap-2">
            <span className="status-dot bg-emerald-600 rounded-full"></span>
            ¿Listo para empezar el turno?
          </p>
          <Button
            className="btn-principal justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 font-bold shadow-sm flex items-center gap-2 btn-abrir-caja"
            onClick={() => navigate("/abrirCaja")}
            variant="default"
          >
            <StoreIcon size={20} />
            <span>Abrir Caja</span>
          </Button>
        </div>
      </div>
      {/* FIN CABECERA HERO */}
      <div className="grid grid-cols-12 gap-3 overflow-hidden">
        <div className="col-span-full md:col-span-12">
          <InformacionRapidaHome />
        </div>
        <div className="col-span-full md:col-span-10">
          <div className="grid grid-cols-12 gap-4gap-3">
            <div className="col-span-full md:col-span-12">
              <CabeceraHome
                ventasList={ventasList}
                load={loadingVentas}
                errorLoad={errorVentas}
              />
            </div>
            <div className="col-span-full md:col-span-12">
              <DashboardMesas />
            </div>
            <div className="col-span-full md:col-span-12">
              <PlatoMasVendido />
            </div>
          </div>
        </div>
        <div className="col-span-full md:col-span-2">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-full md:col-span-12">
              <VentasTipo
                ventasList={ventasList}
                load={loadingVentas}
                errorLoad={errorVentas}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
