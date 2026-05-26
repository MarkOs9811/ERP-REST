import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarFold,
  FileText,
  TrendingDown,
  TrendingUp,
  Store,
} from "lucide-react";

// Servicios y Componentes
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { PlatoMasVendido } from "../../components/componentesHome/PlatosMasVendidos";

// Gráficos
import GraficoBarVentas from "../../graficosChar/GraficoBarVentas";
import GraficoLineaEjemplo from "../../graficosChar/GraficoLineVentas";
import GraficoLineaDayVentas from "../../graficosChar/GraficoLineDayVentas";
import GraficoMetodoPago from "../../graficosChar/GraficoMetodoPago";

// Estilos
import "../../css/EstilosVentas.css";

/* =================================================================================
   1. SUB-COMPONENTE REUTILIZABLE: Tarjeta KPI (Evita repetir código HTML)
================================================================================= */
const KpiCard = ({
  titulo,
  monto,
  porcentaje,
  icono: Icon,
  colorClass,
  esPositivo,
}) => {
  return (
    <div
      className="card p-3 d-flex flex-column justify-content-between h-100"
      style={{ backgroundColor: "var(--bg-card)", minHeight: "140px" }}
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        {/* Ícono Circular */}
        <span
          className="rounded-circle p-3"
          style={{
            backgroundColor: `var(--bg-${colorClass}-soft)`,
            color: `var(--fw-${colorClass})`,
          }}
        >
          <Icon size={24} />
        </span>

        {/* Porcentaje */}
        <span
          className="ms-auto fw-bold d-flex align-items-center gap-1"
          style={{ fontSize: "0.9rem", color: `var(--fw-${colorClass})` }}
        >
          {esPositivo ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {esPositivo ? "+" : ""}
          {porcentaje}%
        </span>
      </div>

      {/* Textos */}
      <div>
        <span
          className="text-muted fw-bold"
          style={{ fontSize: "0.85rem", display: "block", marginBottom: "4px" }}
        >
          {titulo}
        </span>
        <h3
          className="fw-bold mb-0"
          style={{
            fontSize: "1.3rem",
            color:
              colorClass === "emerald" || colorClass === "strawberry"
                ? `var(--fw-${colorClass})`
                : "var(--text-main)",
          }}
        >
          S/ {monto}
        </h3>
      </div>
    </div>
  );
};

/* =================================================================================
   2. COMPONENTE PRINCIPAL: Vista de Ventas
================================================================================= */
export function Ventas() {
  // --- A. FETCH DE DATOS ---
  const {
    data: ventasData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // --- B. PROCESAMIENTO MATEMÁTICO (Optimizado con useMemo) ---
  const metricas = useMemo(() => {
    const ventas = Array.isArray(ventasData) ? ventasData : [];
    const now = new Date();

    // Fechas clave
    const hoy = {
      dia: now.getDate(),
      mes: now.getMonth(),
      anio: now.getFullYear(),
    };
    const mesActual = now.getMonth() + 1;
    const anioActual = now.getFullYear();
    const mesPasado = mesActual === 1 ? 12 : mesActual - 1;
    const anioMesPasado = mesActual === 1 ? anioActual - 1 : anioActual;

    let totalMesActual = 0;
    let totalMesPasado = 0;
    let totalHoy = 0;

    ventas.forEach((venta) => {
      const fecha = new Date(venta.created_at);
      const monto = parseFloat(venta.total || 0);

      // Sumar Mes Actual
      if (
        fecha.getMonth() + 1 === mesActual &&
        fecha.getFullYear() === anioActual
      ) {
        totalMesActual += monto;
      }
      // Sumar Mes Pasado
      if (
        fecha.getMonth() + 1 === mesPasado &&
        fecha.getFullYear() === anioMesPasado
      ) {
        totalMesPasado += monto;
      }
      // Sumar Hoy
      if (
        fecha.getDate() === hoy.dia &&
        fecha.getMonth() === hoy.mes &&
        fecha.getFullYear() === hoy.anio
      ) {
        totalHoy += monto;
      }
    });

    const diferencia = totalMesActual - totalMesPasado;
    const porcentajeCrecimiento =
      totalMesPasado > 0 ? (diferencia / totalMesPasado) * 100 : 0;
    const porcentajeMensual =
      totalMesActual > 0 ? (totalMesPasado / totalMesActual) * 100 : 0;

    return {
      hoy: totalHoy.toFixed(2),
      mesActual: totalMesActual.toFixed(2),
      mesPasado: totalMesPasado.toFixed(2),
      diferencia: diferencia.toFixed(2),
      crecimientoPct: porcentajeCrecimiento.toFixed(1),
      mensualPct: porcentajeMensual.toFixed(1),
      esDiferenciaPositiva: diferencia >= 0,
    };
  }, [ventasData]);

  // --- C. RENDERIZADO DE LA INTERFAZ ---
  return (
    <div className="container-fluid p-0">
      <div className="row g-4">
        {/* ================= FILA 1: KPIs PRINCIPALES (General) ================= */}
        <div className="col-12">
          <div className="row g-3">
            {/* Ventas Hoy */}
            <div className="col-12 col-md-6 col-lg-3">
              <CondicionCarga isLoading={isLoading} isError={isError}>
                <div className="card py-2 h-100 ">
                  <div className="card-body d-flex flex-column justify-content-center">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <p className="fw-bold m-0">Ventas Hoy</p>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark px-2 py-1"
                        onClick={() => GetReporteExcel("/reporteVentasHOY")}
                        title="Descargar Reporte"
                      >
                        <FileText size={14} />
                      </button>
                    </div>
                    <p
                      className="totalVentasTitulo mb-0"
                      style={{ fontSize: "2rem" }}
                    >
                      S/ {metricas.hoy}
                    </p>
                  </div>
                </div>
              </CondicionCarga>
            </div>

            {/* Este Mes */}
            <div className="col-12 col-md-6 col-lg-3">
              <CondicionCarga
                isLoading={isLoading}
                isError={isError}
                mode="single-card"
              >
                <KpiCard
                  titulo="Este Mes"
                  monto={metricas.mesActual}
                  porcentaje={metricas.crecimientoPct}
                  icono={Store}
                  colorClass="emerald"
                  esPositivo={true}
                />
              </CondicionCarga>
            </div>

            {/* Mes Pasado */}
            <div className="col-12 col-md-6 col-lg-3">
              <CondicionCarga
                isLoading={isLoading}
                isError={isError}
                mode="single-card"
              >
                <KpiCard
                  titulo="Mes Pasado"
                  monto={metricas.mesPasado}
                  porcentaje={metricas.mensualPct}
                  icono={CalendarFold}
                  colorClass="saffron"
                  esPositivo={true}
                />
              </CondicionCarga>
            </div>

            {/* Diferencia */}
            <div className="col-12 col-md-6 col-lg-3">
              <CondicionCarga
                isLoading={isLoading}
                isError={isError}
                mode="single-card"
              >
                <KpiCard
                  titulo="Diferencia"
                  monto={metricas.diferencia}
                  porcentaje={metricas.crecimientoPct}
                  icono={
                    metricas.esDiferenciaPositiva ? TrendingUp : TrendingDown
                  }
                  colorClass={
                    metricas.esDiferenciaPositiva ? "emerald" : "strawberry"
                  }
                  esPositivo={metricas.esDiferenciaPositiva}
                />
              </CondicionCarga>
            </div>
          </div>
        </div>

        {/* ================= FILA 2: PROTAGONISTAS (Gráfico Ancho + Ranking) ================= */}
        <div className="col-12 col-lg-8">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card p-4 h-100">
              {/* Al darle 8 columnas, este gráfico al fin podrá mostrar los meses de Enero a Diciembre sin aplastarse */}
              <GraficoBarVentas />
            </div>
          </CondicionCarga>
        </div>

        <div className="col-12 col-lg-4">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            {/* El Plato Más Vendido encaja perfecto como barra lateral derecha */}
            <PlatoMasVendido />
          </CondicionCarga>
        </div>

        {/* ================= FILA 3: ANÁLISIS DETALLADO (Tercios) ================= */}
        <div className="col-12 col-lg-6">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card p-4 h-100 m-0">
              <GraficoLineaEjemplo />
            </div>
          </CondicionCarga>
        </div>

        <div className="col-12 col-lg-3">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card p-4 h-100 m-0">
              <GraficoLineaDayVentas />
            </div>
          </CondicionCarga>
        </div>

        <div className="col-12 col-lg-3">
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div className="card h-100 p-4">
              <GraficoMetodoPago />
            </div>
          </CondicionCarga>
        </div>
      </div>
    </div>
  );
}
