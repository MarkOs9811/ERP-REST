import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe, Store } from "lucide-react";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GraficoVentasDelivery } from "../../components/componenteDelivery/GraficoVentaDelivery";
import "../../css/estilosDelivery/EstilosDeliveryHome.css";
export function DashboardDelivery() {
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

  // Calculamos los totales generales para los KPIs
  const { totalWeb, totalLocal } = useMemo(() => {
    if (!ventasList || ventasList.length === 0)
      return { totalWeb: 0, totalLocal: 0 };

    let web = 0;
    let local = 0;

    ventasList.forEach((venta) => {
      if (venta.idPedidoWeb !== null && venta.idPedidoWeb !== undefined) {
        web += 1;
      } else {
        local += 1;
      }
    });

    return { totalWeb: web, totalLocal: local };
  }, [ventasList]);

  return (
    <div className="d-flex flex-column gap-4 w-100">
      {/* =========================================
          SECCIÓN DE KPIs (TARJETAS AURA)
          ========================================= */}
      <div className="row g-4">
        {/* KPI Delivery (Web) */}
        <div className="col-12 col-md-6">
          <div className="fw-kpi-card kpi-web-aura border">
            <div className="kpi-icon-wrapper bg-saffron-soft">
              <Globe size={28} className="text-saffron" />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Ventas Delivery (Web)</span>
              <h3 className="kpi-value">{loadingVentas ? "-" : totalWeb}</h3>
            </div>
          </div>
        </div>

        {/* KPI Local (Mesa/Llevar) */}
        <div className="col-12 col-md-6">
          <div className="fw-kpi-card kpi-local-aura border">
            <div className="kpi-icon-wrapper bg-emerald-soft">
              <Store size={28} className="text-emerald" />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Ventas Local (Mesa/Llevar)</span>
              <h3 className="kpi-value">{loadingVentas ? "-" : totalLocal}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          SECCIÓN DEL GRÁFICO
          ========================================= */}
      <div className="w-100">
        <GraficoVentasDelivery
          ventasList={ventasList}
          load={loadingVentas}
          errorLoad={errorVentas}
        />
      </div>
    </div>
  );
}
