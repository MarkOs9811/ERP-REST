import "../css/EstilosHome.css";

import { CabeceraHome } from "../components/componentesHome/CabeceraHome";
import { InformacionRapidaHome } from "../components/componentesHome/InformacionRapidaHome";
import { GraficoIAhome } from "../components/componentesHome/GraficoIAhome";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { UsuariosActivosHome } from "../components/componentesHome/UsuariosActivosHome";
import { PlatoMasVendido } from "../components/componentesHome/PlatosMasVendidos";
import { VentasTipo } from "../components/componentesHome/VentasTipo";
import { Flame, PieChart, TrendingUp } from "lucide-react";

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
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Resumen general de tu negocio</p>
      </div>

      {/* Métricas Rápidas */}
      <div className="dashboard-grid">
        <InformacionRapidaHome />
      </div>

      {/* Grid Principal */}
      <div className="dashboard-grid grid-2col">
        {/* Gráfico Principal - Toma 2 columnas en desktop */}
        <div style={{ gridColumn: "span 2" }} className="dashboard-card">
          <div className="card-header-modern">
            <div className="card-header-icon">
              <TrendingUp size={20} color="#5a5a5a" />
            </div>
            <div className="card-header-title">
              <h3>Tendencias</h3>
              <p>Análisis de comportamiento</p>
            </div>
          </div>
          <div className="card-body-modern">
            <GraficoIAhome />
          </div>
        </div>

        {/* Resumen de Ventas */}
        <div className="dashboard-card">
          <div className="card-body-modern">
            <CabeceraHome
              ventasList={ventasList}
              load={loadingVentas}
              errorLoad={errorVentas}
            />
          </div>
        </div>

        {/* Usuarios Activos */}
        <div className="dashboard-card">
          <div className="card-header-modern">
            <div className="card-header-icon">
              <Flame size={20} color="#5a5a5a" />
            </div>
            <div className="card-header-title">
              <h3>Actividad</h3>
              <p>Usuarios conectados</p>
            </div>
          </div>
          <div className="card-body-modern">
            <UsuariosActivosHome />
          </div>
        </div>

        {/* Platos Top */}
        <div className="dashboard-card">
          <div className="card-header-modern">
            <div className="card-header-icon">
              <Flame size={20} color="#5a5a5a" />
            </div>
            <div className="card-header-title">
              <h3>Platos Top</h3>
              <p>Más vendidos</p>
            </div>
          </div>
          <div className="card-body-modern">
            <PlatoMasVendido />
          </div>
        </div>

        {/* Tipo de Ventas */}
        <div className="dashboard-card">
          <div className="card-header-modern">
            <div className="card-header-icon">
              <PieChart size={20} color="#5a5a5a" />
            </div>
            <div className="card-header-title">
              <h3>Métodos de Venta</h3>
              <p>Distribución</p>
            </div>
          </div>
          <div className="card-body-modern">
            <VentasTipo
              ventasList={ventasList}
              load={loadingVentas}
              errorLoad={errorVentas}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
