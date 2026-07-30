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
    <div className="container">
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
      <div className="row g-3 overflow-hidden">
        <div className="col-md-12">
          <InformacionRapidaHome />
        </div>
        <div className="col-md-10">
          <div className="row gap-3">
            <div className="col-md-12">
              <CabeceraHome
                ventasList={ventasList}
                load={loadingVentas}
                errorLoad={errorVentas}
              />
            </div>
            <div className="col-md-12">
              <DashboardMesas />
            </div>
            <div className="col-md-12">
              <PlatoMasVendido />
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="row g-3">
            <div className="col-md-12">
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
