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
import { RocketIcon, StoreIcon } from "lucide-react";

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

  const navigate = useNavigate();

  return (
    <div className="container-fluid home-shell py-2">
      {/* CABECERA HERO MEJORADA */}
      <div className="home-hero mb-4 p-4 bg-white rounded-4 border d-flex align-items-center justify-content-between position-relative overflow-hidden">
        {/* Decoración de fondo opcional para darle un toque premium */}
        <div className="hero-decoration"></div>

        <div className="home-hero-content position-relative z-1">
          <span className="badge bg-primary text-light bg-opacity-10 rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-2">
            <RocketIcon />
            Panel ejecutivo
          </span>
          <h1 className="home-hero-title fw-bold text-dark mb-1">Dashboard</h1>
          <p className="home-hero-subtitle text-secondary mb-0">
            Resumen general y métricas en tiempo real de tu negocio.
          </p>
        </div>

        <div className="text-end position-relative z-1 d-flex flex-column align-items-end">
          <p className="mb-2 fw-medium text-muted d-flex align-items-center gap-2">
            <span className="status-dot bg-success rounded-circle"></span>
            ¿Listo para empezar el turno?
          </p>
          <button
            className="btn-principal btn-lg px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2 btn-abrir-caja"
            onClick={() => navigate("/abrirCaja")}
          >
            <StoreIcon size={20} />
            <span>Abrir Caja</span>
          </button>
        </div>
      </div>
      {/* FIN CABECERA HERO */}

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
