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
    <div className="container-fluid home-shell py-3">
      <div className="row g-3 mb-3 align-items-stretch">
        <div className="col-12 col-lg-8">
          <CabeceraHome cajaAbierta={!!cajaAbierta} />
        </div>
        <div className="col-12 col-lg-4">
          <div className="card h-100 overflow-hidden p-4 home-caja-card position-relative">
            <div className="hero-decoration"></div>
            <div className="position-relative z-1 d-flex flex-column h-100">
              <p className="mb-2 fw-medium text-muted d-flex align-items-center gap-2">
                <span
                  className={`status-dot rounded-circle ${
                    cajaAbierta ? "bg-success" : "bg-secondary"
                  }`}
                ></span>
                {cajaAbierta ? "Caja abierta" : "Caja cerrada"}
              </p>
              <h5 className="fw-bold mb-2" style={{ color: "var(--text-main)" }}>
                {nombreCaja}
              </h5>
              <p className="mb-4 text-muted flex-grow-1">
                {cajaAbierta
                  ? "¡Buen trabajo! Mantén el control de tus ventas."
                  : "Caja cerrada. Abre la caja para comenzar a vender."}
              </p>
              <button
                className={`btn-principal btn-lg px-4 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 w-100 ${
                  cajaAbierta ? "btn-ir-a-caja" : "btn-abrir-caja"
                }`}
                onClick={() =>
                  navigate(cajaAbierta ? "/vender/mesas" : "/abrirCaja")
                }
              >
                <StoreIcon size={20} />
                <span>{cajaAbierta ? "Ir a Caja" : "Abrir Caja"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-3">
        <InformacionRapidaHome />
      </section>

      <div className="row g-3 mb-3">
        <div className="col-12 col-xl-8">
          <DashboardMesas />
        </div>
        <div className="col-12 col-xl-4">
          <div className="d-flex flex-column gap-3 h-100">
            <CarouselMarketingHome />
            <VentasTipo
              ventasList={ventasList}
              load={loadingVentas}
              errorLoad={errorVentas}
            />
            <div className="flex-grow-1">
              <UsuariosActivosHome />
            </div>
          </div>
        </div>
      </div>

      <section className="mb-3">
        <PlatoMasVendido />
      </section>

      <section>
        <GraficoIAhome />
      </section>
    </div>
  );
}
