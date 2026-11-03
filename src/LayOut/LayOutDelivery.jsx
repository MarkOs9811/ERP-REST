import { useEffect } from "react";
import { CabeceraHome } from "../components/componentesHome/CabeceraHome";
import { InformacionRapidaHome } from "../components/componentesHome/InformacionRapidaHome";
import { PlatoMasVendido } from "../components/componentesHome/PlatosMasVendidos";
import { VentasTipo } from "../components/componentesHome/VentasTipo";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";
import { Card } from "@/components/ui/card";


export function LayOutDelivery() {
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
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 overflow-hidden">
        <div className="md:col-span-12">
          <InformacionRapidaHome />
        </div>
        <div className="md:col-span-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-12">
              <Card className="p-2 shadow-sm h-full">
                <PlatoMasVendido />
              </Card>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-12">
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
