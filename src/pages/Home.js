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

// Nota: Quité las importaciones de "lucide-react" porque no se estaban utilizando en este archivo.
// Esto ayuda a mantener el código limpio.

export function Home() {
  const {
    data: ventasList = [],
    isLoading: loadingVentas, // Corregido: en React Query suele ser isLoading
    isError: errorVentas, // Corregido: en React Query suele ser isError
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="container-fluid home-shell py-2">
      <div className="home-hero  mb-4">
        <div className="home-hero-content">
          <span className="home-hero-kicker">Panel ejecutivo</span>
          <h1 className="home-hero-title">Dashboard</h1>
          <p className="home-hero-subtitle">Resumen general de tu negocio</p>
        </div>
        <div className="home-hero-glow" aria-hidden="true"></div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="home-section-card home-section-card--metrics">
            <InformacionRapidaHome />
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="row g-3">
            <div className="col-md-12">
              <div className="home-section-card">
                <CabeceraHome
                  ventasList={ventasList}
                  load={loadingVentas}
                  error={errorVentas}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="home-section-card">
                <DashboardMesas />
              </div>
            </div>
            <div className="col-md-12">
              <div className="home-section-card">
                <PlatoMasVendido />
              </div>
            </div>
            <div className="col-md-12">
              <div className="home-section-card">
                <GraficoIAhome />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="row g-3">
            <div className="col-md-12">
              <div className="home-section-card home-section-card--accent">
                <CarouselMarketingHome />
              </div>
            </div>
            <div className="col-12 col-lg-12">
              <div className="home-section-card">
                <VentasTipo
                  ventasList={ventasList}
                  load={loadingVentas}
                  errorLoad={errorVentas}
                />
              </div>
              <div className="col-md-12">
                <div className="home-section-card mt-3">
                  <UsuariosActivosHome />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
