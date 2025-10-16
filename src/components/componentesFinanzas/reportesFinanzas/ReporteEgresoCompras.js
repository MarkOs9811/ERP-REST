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
    ["", 0]
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
    <div className="p-4 bg-light">
      <div className="row g-3">
        <div className="col-md-12 d-flex justify-content-auto ms-auto">
          <div className="">
            <h5>Informe</h5>
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
          </div>
        </div>
        <div ref={reporteRef} id="reporte-ingresos-ventas" className="row g-3">
          <div className="col-md-3 col-sm-12">
            <div className="card shadow-sm p-3 d-flex flex-row align-items-center h-100">
              <ShoppingCart color="#f4a261" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Compras</h5>
                <h3 className="fw-bold mb-0">{totalCompras}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-12">
            <div className="card shadow-sm p-3 d-flex flex-row align-items-center h-100">
              <CalendarDays color="#2a9d8f" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Compras del Mes</h5>
                <h3 className="fw-bold mb-0">{comprasDelMes}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-12">
            <div className="card shadow-sm p-3 d-flex flex-row align-items-center h-100">
              <BanknoteArrowUp color="#e76f51" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Egresos del Mes</h5>
                <h3 className="fw-bold mb-0">S/. {totalMontoComprasDelMes}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-12">
            <div className="card shadow-sm p-3 d-flex flex-row align-items-center h-100">
              <Trophy color="#f4a261" width="63px" height="63px" />
              <div className="ms-auto text-end">
                <h5 className="fw-light ">Proveedor TOP</h5>
                <h3 className="fw-bold mb-0">{proveedorTop}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="card shadow-sm p-3">
              <GraficoEgresoTodo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
