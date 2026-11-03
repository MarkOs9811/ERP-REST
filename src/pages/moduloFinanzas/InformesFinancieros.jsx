import { GraficoIngresosEgresos } from "../../graficosChar/GraficoIngresosEgresos";
import { GetInformesFinancieros } from "../../service/serviceFinanzas/GetInformesFinancieros";
import { useQuery } from "@tanstack/react-query";
import { GraficoCuentasPorCobrar } from "../../graficosChar/GraficoCuentasPorCobrar";

import { GraficoPagoEmpleados } from "../../graficosChar/GraficoPagoEmpleados";
import GraficoVentasContado from "../../graficosChar/GraficoVentasContado";
import GraficoEgresosMensuales from "../../graficosChar/GraficoEgresosMensuales";
import { CardIngresoEgresos } from "../../components/componentesFinanzas/CardIngresoEgresos";
import "../../css/EstilosFinanzas.css";

// 🔥 IMPORTAMOS EL HELPER DE MONEDA GLOBAL
import { formatMoneda } from "../../utils/currency";
import { Card, CardContent } from "@/components/ui/card";


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

  return (
    <div className="finanzas-root container-fluid p-0">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="col-12">
          <CardIngresoEgresos
            sumaIngresos={sumaIngresos}
            sumaEgresos={sumaEgresos}
          />
        </div>

        <div className="col-12 col-lg-8">
          <Card className="p-4 h-full finanzas-card">
            <CardContent className="p-0">
              <GraficoIngresosEgresos />
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-4">
          <Card className="p-4 h-full finanzas-card">
            <CardContent className="p-0 flex flex-col justify-center">
              <GraficoCuentasPorCobrar />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mx-auto justify-content-center align-items-center m-0 w-100 finanzas-kpi-mini-grid">
                <div className="col-6 d-flex justify-content-center align-items-center">
                  <Card className="border w-full finanzas-mini-card finanzas-mini-card-pagado">
                    <CardContent className="flex flex-col justify-center items-center">
                      <small>Deudas Cobradas</small>
                      <p className="text-center mb-0 h4">
                        {/*  USO DEL HELPER */}
                        {formatMoneda(montoPagado)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-6 d-flex justify-content-center align-items-center">
                  <Card className="border w-full finanzas-mini-card finanzas-mini-card-restante">
                    <CardContent className="flex flex-col justify-center items-center">
                      <small>Saldo Pendiente</small>
                      <p className="text-center mb-0 h4">
                        {/*  USO DEL HELPER */}
                        {formatMoneda(montoRestante)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-6">
          <Card className="p-4 h-full finanzas-card">
            <CardContent className="p-0">
              <GraficoVentasContado />
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-3">
          <Card className="p-4 h-full finanzas-card">
            <CardContent className="p-0">
              <GraficoPagoEmpleados />
            </CardContent>
          </Card>
        </div>

        <div className="col-12 col-lg-3">
          <Card className="p-4 h-full finanzas-card">
            <CardContent className="p-0">
              <GraficoEgresosMensuales />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
