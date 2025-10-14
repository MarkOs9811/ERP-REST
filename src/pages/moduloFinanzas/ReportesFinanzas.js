import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import {
  FileBarChart,
  DollarSign,
  Wallet,
  Users,
  Calculator,
  TrendingUp,
  ChartNoAxesCombined,
} from "lucide-react";
import { motion } from "framer-motion";
import "../../css/EstilosFinanzas.css";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { useState } from "react";
import { ReporteIngresoVentas } from "../../components/componentesFinanzas/reportesFinanzas/ReporteIngresoVentas";
import { ReporteEgresoCompras } from "../../components/componentesFinanzas/reportesFinanzas/ReporteEgresoCompras";
import { ReporteUtilidadNeta } from "../../components/componentesFinanzas/reportesFinanzas/ReporteUtilidadNeta";
import { ReportePagosPlanilla } from "../../components/componentesFinanzas/reportesFinanzas/ReportePagosPlanilla";
import { ReporteCaja } from "../../components/componentesFinanzas/reportesFinanzas/ReporteCaja";
import { ReporteGeneralFinanzas } from "../../components/componentesFinanzas/reportesFinanzas/ReporteGeneralFinanzas";

export function ReportesFinanzas() {
  const [reporteModal, setReporteModal] = useState("");
  const [modalReporte, setModalReporte] = useState(false);
  const [tituloReporte, setTituloReporte] = useState("");

  const reportes = [
    {
      titulo: "Ingresos y Ventas",
      dataModal: "ingresoVentas",
      descripcion:
        "Visualiza los ingresos generados por día, semana o mes, con detalle por método de pago y documento.",
      icono: <FileBarChart className="icon icon-blue" />,
    },
    {
      titulo: "Egresos y Compras",
      dataModal: "egresoCompras",
      descripcion:
        "Consulta los gastos por proveedor, categoría y documentos de compra asociados.",
      icono: <Wallet className="icon icon-red" />,
    },
    {
      titulo: "Utilidad Neta",
      dataModal: "utilidadNeta",
      descripcion:
        "Analiza el balance entre ingresos, egresos y costos operativos para conocer tu utilidad real.",
      icono: <TrendingUp className="icon icon-green" />,
    },
    {
      titulo: "Reporte de Caja",
      dataModal: "reporteCaja",
      descripcion:
        "Revisa los movimientos de caja, ingresos y salidas por turno o usuario responsable.",
      icono: <DollarSign className="icon icon-emerald" />,
    },
    {
      titulo: "Pagos y Planilla",
      dataModal: "pagosPlanilla",
      descripcion:
        "Consulta los sueldos, bonos, descuentos y horas extras del personal.",
      icono: <Users className="icon icon-indigo" />,
    },
    {
      titulo: "Balance General",
      dataModal: "reporteGeneral",
      descripcion:
        "Obtén un resumen financiero general con activos, pasivos y patrimonio actualizado.",
      icono: <Calculator className="icon icon-orange" />,
    },
  ];

  return (
    <ContenedorPrincipal>
      <div className="row gap-3">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="text-left">
                <ChartNoAxesCombined
                  color={"#ea4f4f"}
                  className="text-auto"
                  size={"30px"}
                />{" "}
                Reportes Financieros
              </h1>
              <p>
                Analiza y controla el estado financiero general del restaurante
                con reportes dinámicos y gráficos.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-12 ">
          <div className="reportes-grid">
            {reportes.map((reporte, index) => (
              <motion.div
                key={index}
                className="reporte-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="reporte-icon">{reporte.icono}</div>
                <h2 className="text-muted text-auto fw-bold">
                  {reporte.titulo}
                </h2>
                <p>{reporte.descripcion}</p>
                <button
                  className="btn-guardar"
                  onClick={() => {
                    setReporteModal(reporte.dataModal);
                    setModalReporte(true);
                    setTituloReporte(reporte.titulo);
                  }}
                >
                  Ver detalles
                </button>
              </motion.div>
            ))}
          </div>
        </div>
        <ModalRight
          isOpen={modalReporte}
          onClose={() => {
            setModalReporte(false);
            setReporteModal("");
          }}
          title={tituloReporte}
          width={"70%"}
          hideFooter={true}
        >
          {reporteModal === "ingresoVentas" ? <ReporteIngresoVentas /> : ""}
          {reporteModal === "egresoCompras" ? <ReporteEgresoCompras /> : ""}
          {reporteModal === "utilidadNeta" ? <ReporteUtilidadNeta /> : ""}
          {reporteModal === "reporteCaja" ? <ReporteCaja /> : ""}
          {reporteModal === "pagosPlanilla" ? <ReportePagosPlanilla /> : ""}
          {reporteModal === "reporteGeneral" ? <ReporteGeneralFinanzas /> : ""}
        </ModalRight>
      </div>
    </ContenedorPrincipal>
  );
}
