import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { GraficoIngresosEgresos } from "../../graficosChar/GraficoIngresosEgresos";
import { GetInformesFinancieros } from "../../service/serviceFinanzas/GetInformesFinancieros";
import { useQuery } from "@tanstack/react-query";
import { GraficoCuentasPorCobrar } from "../../graficosChar/GraficoCuentasPorCobrar";

import { GraficoPagoEmpleados } from "../../graficosChar/GraficoPagoEmpleados";
import GraficoVentasContado from "../../graficosChar/GraficoVentasContado";
import GraficoEgresosMensuales from "../../graficosChar/GraficoEgresosMensuales";
import {
  ChartColumnBig,
  ChartColumnBigIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { CardIngresoEgresos } from "../../components/componentesFinanzas/CardIngresoEgresos";

export function InformesFinancieros() {
  const {
    data: dataInformes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
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
    0
  );
  const sumaEgresos = egresos.reduce(
    (acc, val) => acc + parseFloat(val || 0),
    0
  );

  const motoPagadoDeudas = dataInformes.montoPagado || {};
  const totalDeudas = dataInformes.totalPrestamos || {};

  const montoPagado = parseFloat(motoPagadoDeudas) || 0;
  const montoRestante = Math.max(
    parseFloat(totalDeudas) - parseFloat(montoPagado),
    0
  );

  return (
    <div>
      <div className="row g-3">
        <div className="col-md-8">
          <div className="row g-3">
            <div className="col-md-12">
              <div className="card shadow-sm ">
                <div className="card-header d-flex gap-2 align-middle justify-content-left">
                  <span className="alert border-0 alert-danger text-danger p-2 mb-0">
                    <ChartColumnBigIcon size={25} />
                  </span>
                  <h6 className="mb-1 d-flex flex-column gap-1">
                    <span className="fw-bold">Ingresos y Egresos</span>
                    <p className="text-muted small mb-0">Este año</p>
                  </h6>
                </div>
                <div className="card-body px-4">
                  <GraficoIngresosEgresos />
                </div>
              </div>
            </div>
            <div className="col-md-12 d-flex  gap-3">
              <div className="card shadow-sm py-2 w-50">
                <div className="card-header p-3">
                  <p className="h4 card-title">Pagos Empleados</p>
                </div>
                <div className="card-body ">
                  <GraficoPagoEmpleados />
                </div>
              </div>
              <div className="card shadow-sm py-2 w-50">
                <div className="card-header p-3">
                  <p className="h4 card-title">Ventas al Contado</p>
                </div>
                <div className="card-body ">
                  <GraficoVentasContado />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 ">
          <div className="row g-3 ">
            <div className="col-md-12">
              <CardIngresoEgresos
                sumaIngresos={sumaIngresos}
                sumaEgresos={sumaEgresos}
              />
            </div>

            <div className="col-md-12 ">
              <div className="card shadow-sm py-2 ">
                <div className="card-body p-3 justify-content-center">
                  <GraficoCuentasPorCobrar />
                  <div
                    className="row g-3 mx-auto justify-content-center align-items-center m-0"
                    style={{ minHeight: "120px" }}
                  >
                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                      <div className="card border w-100">
                        <div
                          className="card-body d-flex flex-column justify-content-center align-items-center"
                          style={{ minHeight: "80px" }}
                        >
                          <small>Deudas Cobrados</small>
                          <p className="text-center mb-0 text-primary  h4">
                            S/. {montoPagado.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                      <div className="card border w-100">
                        <div
                          className="card-body d-flex flex-column justify-content-center align-items-center"
                          style={{ minHeight: "80px" }}
                        >
                          <small>Total Prestamos</small>
                          <p className="text-center mb-0 text-dark h4">
                            S/. {montoRestante.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="card shadow-sm py-2">
            <div className="card-header p-3">
              <p className="h4 card-title">Egresos mensuales</p>
            </div>
            <div className="card-body p-5">
              <GraficoEgresosMensuales />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
