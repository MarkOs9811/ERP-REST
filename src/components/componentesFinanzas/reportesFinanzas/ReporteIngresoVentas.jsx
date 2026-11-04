import { useQuery } from "@tanstack/react-query";
import { GraficoCuentasPorCobrar } from "../../../graficosChar/GraficoCuentasPorCobrar";
import GraficoMetodoPago from "../../../graficosChar/GraficoMetodoPago";
import { GetInformesFinancieros } from "../../../service/serviceFinanzas/GetInformesFinancieros";
import { PlatoMasVendido } from "../../componentesHome/PlatosMasVendidos";
import {
  FileCog,
  FileText,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useGenerarReporte } from "../../../hooks/GenerarPdfReporte";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export function ReporteIngresoVentas() {
  const navigate = useNavigate();
  const reporteRef = useRef();
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

  const generarReporte = useGenerarReporte("reporte_ventas.pdf");
  const [loading, setLoading] = useState(false);
  const handleGenerar = async () => {
    setLoading(true);
    await generarReporte(reporteRef); // espera a que termine el proceso
    setLoading(false);
  };
  return (
    <div className="p-0 m-0">
      <div className="w-full bg-muted p-4">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-full md:col-span-12 flex justify-between ms-auto">
            <div className="">
              <h5>Reporte</h5>
            </div>
            <div className="flex ms-auto gap-3">
              <BotonMotionGeneral
                text={loading ? "Generando..." : "Generar Reporte"}
                icon={
                  loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <FileText size={18} />
                  )
                }
                color1="#ffffff"
                color2="#ffffffff"
                disabled={loading} // 👈 evita múltiples clics
                onClick={handleGenerar}
              />
              <BotonMotionGeneral
                text="Otras Opciones"
                icon={<FileCog size={18} />}
                color1="#ffffffff"
                color2="#ffffffff"
                onClick={() => navigate("/ventas/reportes")}
              />
            </div>
          </div>
        </div>
        <div
          ref={reporteRef}
          id="reporte-ingresos-ventas"
          className="grid grid-cols-12 gap-3"
        >
          <div className="col-span-full md:col-span-12 flex gap-3">
            <div className="col-span-full md:col-span-3">
              <Card className="h-full">
                <CardHeader className="my-2 flex gap-2 align-middle justify-start">
                  <span className="relative w-full rounded-lg text-sm border-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-2 mb-0">
                    <TrendingUp size={25} />
                  </span>
                  <h6 className="mb-1 flex flex-col gap-1">
                    <span className="font-bold">Total de ingresos</span>
                    <p className="text-muted-foreground text-sm mb-0"></p>
                  </h6>
                </CardHeader>
                <CardContent className="p-2">
                  <p className="h1 text-center">
                    S/. {sumaIngresos.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-full md:col-span-3">
              <Card className="">
                <CardHeader className="my-2 flex gap-2 align-middle justify-start">
                  <span className="relative w-full rounded-lg text-sm border-0 border-destructive/30 bg-destructive/10 text-destructive p-2 mb-0">
                    <TrendingDown size={25} />
                  </span>
                  <h6 className="mb-1 flex flex-col gap-1">
                    <span className="font-bold">Total de egresos</span>
                    <p className="text-muted-foreground text-sm mb-0"></p>
                  </h6>
                </CardHeader>
                <CardContent className="p-2">
                  <p className="h1 text-center">S/. {sumaEgresos.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="col-span-full md:col-span-12">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-full md:col-span-4">
                <Card className="h-full rounded">
                  <GraficoCuentasPorCobrar />

                  <div
                    className="grid grid-cols-12 w-full gap-3 justify-center items-center m-0"
                    style={{ minHeight: "120px" }}
                  >
                    <div className="col-span-full md:col-span-6 flex justify-center items-center">
                      <Card className="border w-full">
                        <CardContent
                          className="flex flex-col justify-center items-center"
                          style={{ minHeight: "80px" }}
                        >
                          <small>Deudas Cobrados</small>
                          <p className="text-center mb-0 text-primary h4">
                            S/. {montoPagado.toFixed(2)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="col-span-full md:col-span-6 flex justify-center items-center">
                      <Card className="border w-full">
                        <CardContent
                          className="flex flex-col justify-center items-center"
                          style={{ minHeight: "80px" }}
                        >
                          <small>Total Prestamos</small>
                          <p className="text-center mb-0 text-foreground h4">
                            S/. {montoRestante.toFixed(2)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="col-span-full md:col-span-4">
                <Card className="h-full rounded">
                  <GraficoMetodoPago />
                </Card>
              </div>
              <div className="col-span-full md:col-span-4">
                <Card className="h-full rounded p-3">
                  <PlatoMasVendido />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
