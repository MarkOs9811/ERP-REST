import "../css/EstilosHome.css";
import { CabeceraHome } from "../components/componentesHome/CabeceraHome";
import { InformacionRapidaHome } from "../components/componentesHome/InformacionRapidaHome";
import { GraficoIAhome } from "../components/componentesHome/GraficoIAhome";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { UsuariosActivosHome } from "../components/componentesHome/UsuariosActivosHome";
import { PlatoMasVendido } from "../components/componentesHome/PlatosMasVendidos";
import { VentasTipo } from "../components/componentesHome/VentasTipo";
import { Flame, PieChart } from "lucide-react";

export function Home() {
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

  return (
    <div className="dashboard-wrapper animation-fade-in p-2">
      <div className="row g-4 overflow-hidden">
        {/* Top Metrics Row */}
        <div className="col-12">
          <InformacionRapidaHome />
        </div>

        {/* Main Content: Left Main Column (Charts) */}
        <div className="col-lg-8 col-md-12">
          <div className="d-flex flex-column gap-4 h-100">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
               <GraficoIAhome />
            </div>
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden p-0">
               <UsuariosActivosHome />
            </div>
          </div>
        </div>

        {/* Right Side Column (Rankings, summaries) */}
        <div className="col-lg-4 col-md-12">
          <div className="d-flex flex-column gap-4">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden p-3">
               <CabeceraHome
                  ventasList={ventasList}
                  load={loadingVentas}
                  errorLoad={errorVentas}
                />
            </div>
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden p-0">
              <div className="d-flex gap-2 align-middle justify-content-left p-3 border-bottom card-header bg-light">
                <span className="p-2 mb-0 rounded-circle" style={{ backgroundColor: "#fee2e2", color: "#ef4444" }}>
                  <Flame size={25} />
                </span>
                <h6 className="mb-1 d-flex flex-column gap-1 justify-content-center">
                  <span className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>Platos Top</span>
                </h6>
              </div>
              <div className="px-3 pb-3 card-body p-0">
                <PlatoMasVendido />
              </div>
            </div>
            
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden p-0">
              <div className="d-flex gap-2 align-middle justify-content-left p-3 border-bottom card-header bg-light">
                <span className="p-2 mb-0 rounded-circle" style={{ backgroundColor: "#ffedd5", color: "#f97316" }}>
                  <PieChart size={25} />
                </span>
                <h6 className="mb-1 d-flex flex-column gap-1 justify-content-center">
                  <span className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>Tipo de Ventas</span>
                </h6>
              </div>
              <div className="p-3 card-body">
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
    </div>
  );
}
