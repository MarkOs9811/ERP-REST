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
    /* Cambiamos a container-fluid si prefieres que el dashboard ocupe todo el ancho, 
       o déjalo en 'container' si prefieres márgenes laterales fijos. El 'py-4' da un respiro visual. */
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="texto-principal fw-bold mb-1">Dashboard</h1>
          <p className="text-muted">Resumen general de tu negocio</p>
        </div>
      </div>

      {/* 
        Usamos una sola fila (row) principal con 'g-4' (gap) para que todos los elementos 
        tengan la misma separación exacta de forma automática, sin necesidad de anidar más rows.
      */}
      <div className="row g-4">
        {/* Métricas Rápidas: Ocupan el 100% del ancho siempre */}
        <div className="col-12">
          <InformacionRapidaHome />
        </div>

        <div className="col-12 col-lg-8">
          <div className="row gap-3 ">
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
            <div className="col-md-12">
              <GraficoIAhome />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="row gap-3">
            <div className="col-md-12">
              <CarouselMarketingHome />
            </div>
            <div className="col-12 col-lg-12">
              <VentasTipo
                ventasList={ventasList}
                load={loadingVentas}
                errorLoad={errorVentas}
              />
              <div className="col-md-12">
                <UsuariosActivosHome />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8"></div>
      </div>
    </div>
  );
}
