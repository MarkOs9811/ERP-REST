import { useQuery } from "@tanstack/react-query";
import { GetCompras } from "../../../service/GetCompras";
import { Cargando } from "../../componentesReutilizables/Cargando";
import {
  BanknoteArrowUp,
  CalendarDays,
  FileText,
  Loader2,
  PlusIcon,
  ShoppingCart,
  Trophy,
} from "lucide-react";
import { GraficoEgresoTodo } from "../../../graficosChar/GraficoEgresosTodo";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";
import { useGenerarReporte } from "../../../hooks/GenerarPdfReporte";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";


export function ReporteEgresoCompras() {
  const {
    data: dataCompras,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["compras"],
    queryFn: GetCompras,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const compras = dataCompras?.compras || [];
  const totalCompras = compras.length;

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth() + 1; // 1-12
  const anioActual = fechaActual.getFullYear();

  const comprasDelMes = compras.filter((compra) => {
    const [anio, mes] = compra.fecha_compra.split("-"); // "2025-10-01" => ["2025", "10", "01"]
    return parseInt(mes) === mesActual && parseInt(anio) === anioActual;
  }).length;

  const totalMontoComprasDelMes = compras
    .filter((compra) => {
      const [anio, mes] = compra.fecha_compra.split("-");
      return parseInt(mes) === mesActual && parseInt(anio) === anioActual;
    })
    .reduce((total, compra) => total + parseFloat(compra.totalPagado || 0), 0);

  const proveedorRecurrente = compras.reduce((acc, compra) => {
    const nombreProveedor = compra.proveedor?.nombre;
    if (nombreProveedor) {
      acc[nombreProveedor] = (acc[nombreProveedor] || 0) + 1;
    }
    return acc;
  }, {});
  const proveedorTop = Object.entries(proveedorRecurrente).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["", 0],
  )[0];

  const reporteRef = useRef();
  const generarReporte = useGenerarReporte("reporte_compras.pdf");
  const [loading, setLoading] = useState(false);
  const handleGenerar = async () => {
    setLoading(true);
    await generarReporte(reporteRef); // espera a que termine el proceso
    setLoading(false);
  };

  if (isLoading)
    return (
      <p>
        <Cargando />
      </p>
    );
  if (isError) return <p>Error al obtener las compras</p>;
  return (
    <div className="p-4 bg-muted">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full md:col-span-12 flex justify-between ms-auto">
          <div className="">
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
              disabled={loading} // 👈 evita múltiples clics
              onClick={handleGenerar}
            />
          </div>
        </div>
        <div
          ref={reporteRef}
          id="reporte-ingresos-ventas"
          className="grid grid-cols-12 gap-3"
        >
          <div className="md:col-span-3 col-span-full">
            <Card className="p-3 flex flex-row items-center h-full">
              <ShoppingCart
                color="var(--fw-saffron)"
                width="63px"
                height="63px"
              />
              <div className="ms-auto text-right">
                <h5 className="font-light">Compras</h5>
                <h3 className="font-bold mb-0">{totalCompras}</h3>
              </div>
            </Card>
          </div>

          <div className="md:col-span-3 col-span-full">
            <Card className="p-3 flex flex-row items-center h-full">
              <CalendarDays
                color="var(--fw-emerald)"
                width="63px"
                height="63px"
              />
              <div className="ms-auto text-right">
                <h5 className="font-light">Compras del Mes</h5>
                <h3 className="font-bold mb-0">{comprasDelMes}</h3>
              </div>
            </Card>
          </div>

          <div className="md:col-span-3 col-span-full">
            <Card className="p-3 flex flex-row items-center h-full">
              <BanknoteArrowUp
                color="var(--fw-strawberry)"
                width="63px"
                height="63px"
              />
              <div className="ms-auto text-right">
                <h5 className="font-light">Egresos del Mes</h5>
                <h3 className="font-bold mb-0">S/. {totalMontoComprasDelMes}</h3>
              </div>
            </Card>
          </div>

          <div className="md:col-span-3 col-span-full">
            <Card className="p-3 flex flex-row items-center h-full">
              <Trophy color="var(--fw-saffron)" width="63px" height="63px" />
              <div className="ms-auto text-right">
                <h5 className="font-light">Proveedor TOP</h5>
                <h3 className="font-bold mb-0">{proveedorTop}</h3>
              </div>
            </Card>
          </div>
          <div className="col-span-full md:col-span-12">
            <Card className="p-3">
              <GraficoEgresoTodo />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
