import { useQuery } from "@tanstack/react-query";
import { GetRegistrosCajas } from "../../../service/accionesVentas/GetRegistrosCajas";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";
import {
  ChartColumnBig,
  FileText,
  Loader2,
  User,
  Clock,
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
} from "lucide-react";
import { useRef, useState } from "react";
import { useGenerarReporte } from "../../../hooks/GenerarPdfReporte";
import { GraficoRegistrosCajas } from "../../../graficosChar/GraficoRegistrosCajas";

export function ReporteCaja() {
  const {
    data: registrosCajasData = [],
    isLoading: loadingRegistrosCajas,
    error: errorRegistrosCajas,
  } = useQuery({
    queryKey: ["registrosCajas"],
    queryFn: GetRegistrosCajas,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const reporteRef = useRef();
  const generarReporte = useGenerarReporte("reporte_caja.pdf");
  const [loading, setLoading] = useState(false);

  const handleGenerar = async () => {
    setLoading(true);
    await generarReporte(reporteRef);
    setLoading(false);
  };

  // Procesa los registros para resumen
  const registros = Array.isArray(registrosCajasData)
    ? registrosCajasData
    : registrosCajasData.registros || [];

  // Resumen general
  const totalIngresos = registros.reduce(
    (acc, r) => acc + parseFloat(r.montoFinal || 0),
    0
  );
  const totalSalidas = registros.reduce(
    (acc, r) => acc + parseFloat(r.montoInicial || 0),
    0
  );
  const totalNeto = totalIngresos - totalSalidas;

  // Agrupa por usuario responsable
  const usuarios = {};
  registros.forEach((r) => {
    const nombreUsuario =
      r.usuario?.empleado?.persona?.nombre +
        " " +
        (r.usuario?.empleado?.persona?.apellidos || "") || "Sin usuario";
    if (!usuarios[nombreUsuario]) {
      usuarios[nombreUsuario] = {
        ingresos: 0,
        salidas: 0,
        neto: 0,
        turnos: [],
      };
    }
    usuarios[nombreUsuario].ingresos += parseFloat(r.montoFinal || 0);
    usuarios[nombreUsuario].salidas += parseFloat(r.montoInicial || 0);
    usuarios[nombreUsuario].neto +=
      parseFloat(r.montoFinal || 0) - parseFloat(r.montoInicial || 0);
    usuarios[nombreUsuario].turnos.push(r.turno || "Sin turno");
  });

  return (
    <div className="bg-light p-4">
      <div className="row g-3 mb-3">
        {/* Botón de reporte */}
        <div className="col-md-12 d-flex justify-content-auto ms-auto">
          <div>
            <h5>Reporte de Caja</h5>
            <span className="text-muted small">
              Revisa los movimientos de caja, ingresos y salidas por turno o
              usuario responsable.
            </span>
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
              disabled={loading}
              onClick={handleGenerar}
            />
          </div>
        </div>
      </div>
      <div ref={reporteRef}>
        {/* Resumen general */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ArrowUpCircle className="text-success" size={28} />
                <span className="fw-bold text-success">Ingresos Totales</span>
              </div>
              <h4 className="fw-bold text-success mb-0">
                S/ {totalIngresos.toFixed(2)}
              </h4>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ArrowDownCircle className="text-danger" size={28} />
                <span className="fw-bold text-danger">Salidas Totales</span>
              </div>
              <h4 className="fw-bold text-danger mb-0">
                S/ {totalSalidas.toFixed(2)}
              </h4>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <DollarSign className="text-primary" size={28} />
                <span className="fw-bold text-primary">Neto Vendido</span>
              </div>
              <h4 className="fw-bold text-primary mb-0">
                S/ {totalNeto.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>

        {/* Gráfico de ventas por caja */}
        <div className="row g-3">
          <div className="col-md-12">
            <div className="card p-3 shadow-sm">
              <div className="card-header d-flex gap-2 align-middle justify-content-left p-3">
                <span className="alert border-0 alert-primary text-primary p-2 mb-0">
                  <ChartColumnBig size={25} />
                </span>
                <h6 className="mb-1 d-flex flex-column gap-1">
                  <span className="fw-bold">Gráfico de ventas por cajas</span>
                  <p className="text-muted small mb-0">Total</p>
                </h6>
              </div>
              <div className="card-body">
                <GraficoRegistrosCajas />
              </div>
            </div>
          </div>
        </div>

        {/* Desglose por usuario responsable */}
        <div className="row g-3 mt-3">
          <div className="col-md-12">
            <div className="card p-3 shadow-sm">
              <div className="card-header d-flex gap-2 align-middle justify-content-left p-3">
                <User size={22} className="text-dark" />
                <span className="fw-bold text-dark">
                  Desglose por Usuario Responsable
                </span>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Usuario</th>
                      <th>Turnos</th>
                      <th>Ingresos</th>
                      <th>Salidas</th>
                      <th>Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(usuarios).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No hay datos disponibles
                        </td>
                      </tr>
                    ) : (
                      Object.entries(usuarios).map(([usuario, info], idx) => (
                        <tr key={idx}>
                          <td>{usuario}</td>
                          <td>{[...new Set(info.turnos)].join(", ")}</td>
                          <td>S/ {info.ingresos.toFixed(2)}</td>
                          <td>S/ {info.salidas.toFixed(2)}</td>
                          <td>S/ {info.neto.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
