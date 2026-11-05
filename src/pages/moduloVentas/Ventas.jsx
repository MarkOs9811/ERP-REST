import { useMemo } from "react";
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

// Estilos y Utilidades

import { formatMoneda } from "../../utils/currency";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* =================================================================================
   1. SUB-COMPONENTE REUTILIZABLE: Tarjeta KPI
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
    <Card className="p-3 flex flex-col justify-between h-full">
      <div className="flex items-center gap-2 mb-3">
        {/* Ícono Circular */}
        <span
          className="rounded-full p-3 flex items-center justify-center"
          style={{
            backgroundColor: `var(--bg-${colorClass}-soft)`,
            color: `var(--fw-${colorClass})`,
          }}
        >
          <Icon size={24} />
        </span>

        {/* Porcentaje */}
        <span
          className="ml-auto font-bold flex items-center gap-1"
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
          className="text-muted-foreground font-bold block mb-1"
          style={{ fontSize: "0.85rem" }}
        >
          {titulo}
        </span>
        <h3
          className="font-bold mb-0"
          style={{
            fontSize: "1.3rem",
            color:
              colorClass === "emerald" || colorClass === "strawberry"
                ? `var(--fw-${colorClass})`
                : "var(--text-main)",
          }}
        >
          {formatMoneda(monto)}
        </h3>
      </div>
    </Card>
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

      if (
        fecha.getMonth() + 1 === mesActual &&
        fecha.getFullYear() === anioActual
      ) {
        totalMesActual += monto;
      }
      if (
        fecha.getMonth() + 1 === mesPasado &&
        fecha.getFullYear() === anioMesPasado
      ) {
        totalMesPasado += monto;
      }
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
    <div className="grid grid-cols-12 gap-4">
      {/* ================= FILA 1: KPIs PRINCIPALES (General) ================= */}
      <div className="col-span-full">
        <div className="grid grid-cols-12 gap-3">
          {/* Ventas Hoy */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <CondicionCarga isLoading={isLoading} isError={isError}>
              <Card className="py-2 h-full">
                <CardContent className="flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold m-0">Ventas Hoy</p>
                    <Button
                      type="button"
                      className="gap-2 px-3"
                      onClick={() =>
                        GetReporteExcel(
                          "/reporteVentasHOY",
                          null,
                          null,
                          "Ventas_Hoy",
                        )
                      }
                      title="Descargar Reporte"
                      variant="ghostOutline"
                    >
                      <FileText />
                      Reporte
                    </Button>
                  </div>
                  <p
                    className="totalVentasTitulo mb-0"
                    style={{ fontSize: "2rem" }}
                  >
                    {formatMoneda(metricas.hoy)}
                  </p>
                </CardContent>
              </Card>
            </CondicionCarga>
          </div>

          {/* Este Mes */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
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
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
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
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
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

      {/* ================= FILA 2: PROTAGONISTAS ================= */}
      <div className="col-span-12 lg:col-span-8">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <Card className="p-4 h-full">
            <GraficoBarVentas />
          </Card>
        </CondicionCarga>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <PlatoMasVendido />
        </CondicionCarga>
      </div>

      {/* ================= FILA 3: ANÁLISIS DETALLADO ================= */}
      <div className="col-span-12 lg:col-span-6">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <Card className="p-4 h-full m-0">
            <GraficoLineaEjemplo />
          </Card>
        </CondicionCarga>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <Card className="p-4 h-full m-0">
            <GraficoLineaDayVentas />
          </Card>
        </CondicionCarga>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <CondicionCarga isLoading={isLoading} isError={isError}>
          <Card className="h-full p-4">
            <GraficoMetodoPago />
          </Card>
        </CondicionCarga>
      </div>
    </div>
  );
}
