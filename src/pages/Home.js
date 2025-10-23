import "../css/EstilosHome.css";
import { useEffect } from "react";
import { CabeceraHome } from "../components/componentesHome/CabeceraHome";
import { InformacionRapidaHome } from "../components/componentesHome/InformacionRapidaHome";
import { GraficoIAhome } from "../components/componentesHome/GraficoIAhome";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { UsuariosActivosHome } from "../components/componentesHome/UsuariosActivosHome";
import { PlatoMasVendido } from "../components/componentesHome/PlatosMasVendidos";
import { VentasTipo } from "../components/componentesHome/VentasTipo";

export function Home() {
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

  // Datos de ejemplo ampliados

  return (
    <div>
      <div className="row g-3 overflow-hidden">
        <div className="col-md-12">
          <InformacionRapidaHome />
        </div>
        <div className="col-md-3">
          <div className="row ">
            <div className="col-md-12">
              <CabeceraHome
                ventasList={ventasList}
                load={loadingVentas}
                errorLoad={errorVentas}
              />
            </div>
            <div className="col-md-12">
              <div className="card p-2 shadow-sm h-100">
                <PlatoMasVendido />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="row g-3">
            <div className="col-md-9">
              <div className="row g-3">
                <div className="col-md-12">
                  {/* Sección Media */}
                  <GraficoIAhome />
                </div>
              </div>
              <div className="col-md-12">
                <UsuariosActivosHome />
              </div>
            </div>
            <div className="col-md-3">
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
