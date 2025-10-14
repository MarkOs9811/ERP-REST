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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useGenerarReporte } from "../../../hooks/GenerarPdfReporte";

export function ReporteIngresoVentas() {
  const navigate = useNavigate();
  const reporteRef = useRef();
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

  const generarReporte = useGenerarReporte("reporte_ventas.pdf");
  const [loading, setLoading] = useState(false);
  const handleGenerar = async () => {
    setLoading(true);
    await generarReporte(reporteRef); // espera a que termine el proceso
    setLoading(false);
  };
  return (
    <div className="p-0 m-0">
      <div className="container-fluid bg-light p-4">
        <div className="row g-3">
          <div className="col-md-12 d-flex justify-content-auto ms-auto">
            <div className="">
              <h5>Reporte</h5>
            </div>
            <div className="d-flex ms-auto gap-3">
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
        <div ref={reporteRef} id="reporte-ingresos-ventas" className="row g-3">
          <div className="col-md-12 d-flex gap-3">
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-header my-2 d-flex gap-2 align-middle justify-content-left">
                  <span className="alert border-0 alert-success text-success p-2 mb-0">
                    <TrendingUp size={25} />
                  </span>
                  <h6 className="mb-1 d-flex flex-column gap-1">
                    <span className="fw-bold">Total de ingresos</span>
                    <p className="text-muted small mb-0"></p>
                  </h6>
                </div>
                <div className="card-body p-2">
                  <p className="h1 text-center">
                    S/. {sumaIngresos.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm ">
                <div className="card-header my-2 d-flex gap-2 align-middle justify-content-left">
                  <span className="alert border-0 alert-danger text-danger p-2 mb-0">
                    <TrendingDown size={25} />
                  </span>
                  <h6 className="mb-1 d-flex flex-column gap-1">
                    <span className="fw-bold">Total de egresos</span>
                    <p className="text-muted small mb-0"></p>
                  </h6>
                </div>
                <div className="card-body p-2">
                  <p className="h1 text-center">S/. {sumaEgresos.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="card shadow-sm h-100 rounded">
                  <GraficoCuentasPorCobrar />

                  <div
                    className="row w-100 g-3 mx-auto justify-content-center align-items-center m-0"
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
              <div className="col-md-4">
                <div className="card shadow-sm  h-100 rounded">
                  <GraficoMetodoPago />
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm  h-100 rounded">
                  <PlatoMasVendido />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
