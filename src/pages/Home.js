import "../css/EstilosHome.css";
import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import { useEffect } from "react";
import { CabeceraHome } from "../components/componentesHome/CabeceraHome";
import { InformacionRapidaHome } from "../components/componentesHome/InformacionRapidaHome";
import { GraficoIAhome } from "../components/componentesHome/GraficoIAhome";
import { AsistenteIaHome } from "../components/componentesHome/AsistenteIaHome";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";

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
      <CabeceraHome
        ventasList={ventasList}
        load={loadingVentas}
        errorLoad={errorVentas}
      />

      <div className="row">
        <div className="col-md-9">
          {/* Sección Media */}
          <GraficoIAhome />
        </div>
        <div className="col-md-3">
          <InformacionRapidaHome />
        </div>
      </div>
    </div>
  );
}
