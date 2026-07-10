import { GraficoIngresosEgresos } from "../../graficosChar/GraficoIngresosEgresos";
import { GetInformesFinancieros } from "../../service/serviceFinanzas/GetInformesFinancieros";
import { useQuery } from "@tanstack/react-query";
import { GraficoCuentasPorCobrar } from "../../graficosChar/GraficoCuentasPorCobrar";

import { GraficoPagoEmpleados } from "../../graficosChar/GraficoPagoEmpleados";
import GraficoVentasContado from "../../graficosChar/GraficoVentasContado";
import GraficoEgresosMensuales from "../../graficosChar/GraficoEgresosMensuales";
import { CardIngresoEgresos } from "../../components/componentesFinanzas/CardIngresoEgresos";
import "../../css/EstilosFinanzas.css";

export function InformesFinancieros() {
  const { data: dataInformes = [] } = useQuery({
    queryKey: ["finanzas"],
    queryFn: GetInformesFinancieros,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const datosIngresosEgresos = dataInformes.datosIngresosEgresos || {};
  const ingresos = datosIngresosEgresos.ingresos || [];
  const egresos = datosIngresosEgresos.egresos || [];

  const sumaIngresos = ingresos.reduce(
    (acc, val) => acc + parseFloat(val || 0),
    0,
  );
  const sumaEgresos = egresos.reduce(
    (acc, val) => acc + parseFloat(val || 0),
    0,
  );

  const motoPagadoDeudas = dataInformes.montoPagado || {};
  const totalDeudas = dataInformes.totalPrestamos || {};

  const montoPagado = parseFloat(motoPagadoDeudas) || 0;
  const montoRestante = Math.max(
    parseFloat(totalDeudas) - parseFloat(montoPagado),
    0,
  );

  const formatearMoneda = (monto) =>
    monto.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="finanzas-root container-fluid p-0">
      <div className="row g-3">
        <div className="col-12">
          <CardIngresoEgresos
            sumaIngresos={sumaIngresos}
            sumaEgresos={sumaEgresos}
          />
        </div>

        <div className="col-12 col-lg-8">
          <div className="card p-4 h-100 finanzas-card">
            <div className="card-body p-0">
              <GraficoIngresosEgresos />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card p-4 h-100 finanzas-card">
            <div className="card-body p-0 d-flex flex-column justify-content-center">
              <GraficoCuentasPorCobrar />
              <div className="row g-3 mx-auto justify-content-center align-items-center m-0 w-100 finanzas-kpi-mini-grid">
                <div className="col-6 d-flex justify-content-center align-items-center">
                  <div className="card border w-100 finanzas-mini-card finanzas-mini-card-pagado">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                      <small>Deudas Cobradas</small>
                      <p className="text-center mb-0 h4">
                        S/. {formatearMoneda(montoPagado)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-6 d-flex justify-content-center align-items-center">
                  <div className="card border w-100 finanzas-mini-card finanzas-mini-card-restante">
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                      <small>Saldo Pendiente</small>
                      <p className="text-center mb-0 h4">
                        S/. {formatearMoneda(montoRestante)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card p-4 h-100 finanzas-card">
            <div className="card-body p-0">
              <GraficoVentasContado />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-3">
          <div className="card p-4 h-100 finanzas-card">
            <div className="card-body p-0">
              <GraficoPagoEmpleados />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-3">
          <div className="card p-4 h-100 finanzas-card">
            <div className="card-body p-0">
              <GraficoEgresosMensuales />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
