import { useQuery } from "@tanstack/react-query";
import { GetRegistrosCajas } from "../../../service/accionesVentas/GetRegistrosCajas";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";
import {
  ChartColumnBig,
  FileText,
  Loader2,
  User,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { useGenerarReporte } from "../../../hooks/GenerarPdfReporte";
import { GraficoRegistrosCajas } from "../../../graficosChar/GraficoRegistrosCajas";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ReporteCaja() {
  const { data: registrosCajasData = [] } = useQuery({
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
    0,
  );
  const totalSalidas = registros.reduce(
    (acc, r) => acc + parseFloat(r.montoInicial || 0),
    0,
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
    <div className="p-4">
      <div className="grid grid-cols-12 gap-3 mb-3">
        {/* Botón de reporte */}
        <div className="col-span-full md:col-span-12 flex justify-between ms-auto">
          <div>
            <h5>Reporte de Caja</h5>
            <span className="text-muted-foreground text-sm">
              Revisa los movimientos de caja, ingresos y salidas por turno o
              usuario responsable.
            </span>
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
              disabled={loading}
              onClick={handleGenerar}
            />
          </div>
        </div>
      </div>
      <div ref={reporteRef}>
        {/* Resumen general */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          <div className="col-span-full md:col-span-4">
            <Card className="rounded-xl p-3 h-full">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpCircle className="" size={28} />
                <span className="font-bold">Ingresos Totales</span>
              </div>
              <h4 className="font-bold mb-0">S/ {totalIngresos.toFixed(2)}</h4>
            </Card>
          </div>
          <div className="col-span-full md:col-span-4">
            <Card className="rounded-xl p-3 h-full">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownCircle className="" size={28} />
                <span className="font-bold">Salidas Totales</span>
              </div>
              <h4 className="font-bold mb-0">S/ {totalSalidas.toFixed(2)}</h4>
            </Card>
          </div>
          <div className="col-span-full md:col-span-4">
            <Card className="rounded-xl p-3 h-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">S/.</span>
                <span className="font-bold">Neto Vendido</span>
              </div>
              <h4 className="font-bold mb-0">S/ {totalNeto.toFixed(2)}</h4>
            </Card>
          </div>
        </div>

        {/* Gráfico de ventas por caja */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-full md:col-span-12">
            <Card className="p-3 shadow-sm">
              <CardHeader className="flex gap-2 align-middle justify-start p-3">
                <span className="relative w-full rounded-lg text-sm border-0 border-primary/30 bg-primary/10 text-destructive p-2 mb-0">
                  <ChartColumnBig size={25} />
                </span>
                <h6 className="mb-1 flex flex-col gap-1">
                  <span className="font-bold">Gráfico de ventas por cajas</span>
                  <p className="text-muted-foreground text-sm mb-0">Total</p>
                </h6>
              </CardHeader>
              <CardContent className="">
                <GraficoRegistrosCajas />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Desglose por usuario responsable */}
        <div className="grid grid-cols-12 gap-3 mt-3">
          <div className="col-span-full md:col-span-12">
            <Card className="p-3 shadow-sm">
              <CardHeader className="flex gap-2 align-middle justify-start p-3">
                <User size={22} className="text-foreground" />
                <span className="font-bold text-foreground">
                  Desglose por Usuario Responsable
                </span>
              </CardHeader>
              <div className="w-full overflow-x-auto">
                <table className="w-full caption-bottom text-sm border-border [&_th]:border [&_td]:border [&_th]:border-border [&_td]:border-border align-middle mb-0">
                  <thead className="bg-muted">
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
                        <td
                          colSpan={5}
                          className="text-center text-muted-foreground"
                        >
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
