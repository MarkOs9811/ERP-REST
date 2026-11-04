import {
  FileText,
  Loader2,
  PieChart,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  BarChart2,
} from "lucide-react";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";
import { useRef, useState } from "react";
import { useGenerarReporte } from "../../../hooks/GenerarPdfReporte";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../../service/ObtenerVentasDetalle";
import { GetCompras } from "../../../service/GetCompras";
import { GraficoIngresosEgresos } from "../../../graficosChar/GraficoIngresosEgresos";
import { Cargando } from "../../componentesReutilizables/Cargando";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ReporteUtilidadNeta() {
  const reporteRef = useRef();
  const generarReporte = useGenerarReporte("reporte_utilidad_neta.pdf");
  const [loading, setLoading] = useState(false);

  const handleGenerar = async () => {
    setLoading(true);
    await generarReporte(reporteRef);
    setLoading(false);
  };

  // Consultas
  const { data: ventas = [], isLoading: loadingVentas } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: comprasInforme = [], isLoading: loadingCompras } = useQuery({
    queryKey: ["compras"],
    queryFn: GetCompras,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const compras = comprasInforme.compras || [];
  // Cálculos
  const totalVentas = Array.isArray(ventas)
    ? ventas.reduce((acc, v) => acc + parseFloat(v.total || v.monto || 0), 0)
    : 0;
  const totalCompras = Array.isArray(compras)
    ? compras.reduce(
        (acc, c) => acc + parseFloat(c.totalPagado || c.monto || 0),
        0,
      )
    : 0;
  const costosOperativos = 0; // Si tienes este dato, cámbialo aquí
  const utilidadBruta = totalVentas - totalCompras;
  const utilidadNeta = utilidadBruta - costosOperativos;
  const margen =
    totalVentas > 0 ? ((utilidadNeta / totalVentas) * 100).toFixed(2) : "0.00";

  // Agrupa ventas por mes
  const ventasPorMes = {};
  ventas.forEach((venta) => {
    const [anio, mes] = (venta.fechaVenta || venta.fecha || "").split("-");
    if (anio && mes) {
      const key = `${anio}-${mes}`;
      ventasPorMes[key] =
        (ventasPorMes[key] || 0) + parseFloat(venta.total || venta.monto || 0);
    }
  });

  // Agrupa compras por mes
  const comprasPorMes = {};
  compras.forEach((compra) => {
    const [anio, mes] = (compra.fecha_compra || compra.fecha || "").split("-");
    if (anio && mes) {
      const key = `${anio}-${mes}`;
      comprasPorMes[key] =
        (comprasPorMes[key] || 0) +
        parseFloat(compra.totalPagado || compra.monto || 0);
    }
  });

  // Unifica todos los meses presentes en ventas y compras
  const mesesKeys = Array.from(
    new Set([...Object.keys(ventasPorMes), ...Object.keys(comprasPorMes)]),
  ).sort();

  // Meses en español
  const mesesES = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Oct",
    "Nov",
    "Dic",
  ];

  // Arma el arreglo para la tabla
  const comparativaMensual = mesesKeys.map((key) => {
    const [anio, mes] = key.split("-");
    const ventasMes = ventasPorMes[key] || 0;
    const egresosMes = comprasPorMes[key] || 0;
    const utilidadMes = ventasMes - egresosMes;
    const margenMes =
      ventasMes > 0 ? ((utilidadMes / ventasMes) * 100).toFixed(2) : "0.00";
    return {
      mes: `${mesesES[parseInt(mes, 10) - 1]} ${anio}`,
      ventas: ventasMes,
      egresos: egresosMes,
      utilidad: utilidadMes,
      margen: margenMes,
    };
  });

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-3 mb-4">
        {/* Botón de reporte */}
        <div className="col-span-full md:col-span-12 flex justify-between ms-auto">
          <div>
            <h5>Informe</h5>
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
      <div className="grid grid-cols-12 gap-3 mb-3">
        <div className="col-span-full md:col-span-12" ref={reporteRef}>
          {/* Tarjetas resumen */}
          <div className="col-span-full md:col-span-12 mb-2">
            <div className="grid grid-cols-12 gap-3 mb-3">
              <div className="col-span-full md:col-span-3">
                <Card className="rounded-xl p-3 h-full">
                  {loadingVentas ? (
                    <div>
                      <Cargando />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-foreground">
                          Ventas Totales
                        </span>
                      </div>
                      <h4 className="font-bold text-foreground mb-0">
                        S/ {totalVentas.toFixed(2)}
                      </h4>
                    </>
                  )}
                </Card>
              </div>
              <div className="col-span-full md:col-span-3">
                <Card className="rounded-xl p-3 h-full">
                  {loadingCompras ? (
                    <div>
                      <Cargando />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="text-destructive" size={28} />
                        <span className="font-bold text-destructive">
                          Egresos Totales
                        </span>
                      </div>
                      <h4 className="font-bold text-destructive mb-0">
                        S/ {totalCompras.toFixed(2)}
                      </h4>
                    </>
                  )}
                </Card>
              </div>
              <div className="col-span-full md:col-span-3">
                <Card className="rounded-xl p-3 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-foreground" size={28} />
                    <span className="font-bold text-foreground">
                      Utilidad Neta
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground mb-0">
                    S/ {utilidadNeta.toFixed(2)}
                  </h4>
                </Card>
              </div>
              <div className="col-span-full md:col-span-3">
                <Card className="rounded-xl p-3 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="text-foreground" size={28} />
                    <span className="font-bold text-foreground">
                      Margen de Ganancia
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground mb-0">{margen}%</h4>
                </Card>
              </div>
            </div>
          </div>

          {/* Desglose financiero */}
          <div className="col-span-full md:col-span-12 mb-2">
            <Card className="rounded-xl p-3">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="text-foreground" size={22} />
                <span className="font-bold text-foreground">
                  Desglose Financiero
                </span>
              </div>
              <div className="grid grid-cols-12 gap-4text-center">
                <div className="col-span-full md:col-span-4">
                  <span className="text-muted-foreground">
                    Ventas Totales del Periodo
                  </span>
                  <h5 className="font-bold text-foreground">
                    S/ {totalVentas.toFixed(2)}
                  </h5>
                </div>
                <div className="col-span-full md:col-span-4">
                  <span className="text-muted-foreground">
                    Compras Totales del Periodo
                  </span>
                  <h5 className="font-bold text-destructive">
                    S/ {totalCompras.toFixed(2)}
                  </h5>
                </div>
                <div className="col-span-full md:col-span-4">
                  <span className="text-muted-foreground">
                    Costos Operativos
                  </span>
                  <h5 className="font-bold text-foreground">
                    S/ {costosOperativos.toFixed(2)}
                  </h5>
                </div>
              </div>
              <hr />
              <div className="grid grid-cols-12 gap-4text-center">
                <div className="col-span-full md:col-span-6">
                  <span className="text-muted-foreground">Utilidad Bruta</span>
                  <h5 className="font-bold text-foreground">
                    S/ {utilidadBruta.toFixed(2)}
                  </h5>
                </div>
                <div className="col-span-full md:col-span-6">
                  <span className="text-muted-foreground">Utilidad Neta</span>
                  <h5 className="font-bold text-foreground">
                    S/ {utilidadNeta.toFixed(2)}
                  </h5>
                </div>
              </div>
            </Card>
          </div>

          {/* Comparativa mensual */}
          <div className="col-span-full md:col-span-12 mb-2">
            <Card className="rounded-xl p-3">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="text-foreground" size={22} />
                <span className="font-bold text-foreground">
                  Comparativa Mensual
                </span>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full caption-bottom text-sm border-border [&_th]:border [&_td]:border [&_th]:border-border [&_td]:border-border align-middle mb-0">
                  <thead className="bg-muted">
                    <tr>
                      <th>Mes</th>
                      <th>Ventas</th>
                      <th>Egresos</th>
                      <th>Utilidad</th>
                      <th>Margen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparativaMensual.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center text-muted-foreground"
                        >
                          No hay datos disponibles
                        </td>
                      </tr>
                    ) : (
                      comparativaMensual.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.mes}</td>
                          <td>S/ {row.ventas.toFixed(2)}</td>
                          <td>S/ {row.egresos.toFixed(2)}</td>
                          <td>S/ {row.utilidad.toFixed(2)}</td>
                          <td>{row.margen}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Gráfico */}
          <div className="col-span-full md:col-span-12 gap-3">
            <Card className="p-3">
              <CardHeader className="flex gap-2 align-middle justify-start p-3">
                <span className="relative w-full rounded-lg text-sm border-primary/30 bg-primary/10 text-primary p-2 mb-0">
                  <PieChart size={25} />
                </span>
                <h6 className="mb-1 flex flex-col gap-1">
                  <span className="font-bold">
                    Gráfico de ingresos y egresos
                  </span>
                  <p className="text-muted-foreground text-sm mb-0">Cada mes</p>
                </h6>
              </CardHeader>
              <CardContent className="">
                <GraficoIngresosEgresos />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
