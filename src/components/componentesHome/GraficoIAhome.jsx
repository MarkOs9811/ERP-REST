import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GetVentasIA } from "../../service/serviceIA/GetVentasIA";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";
import {
  ChartNoAxesCombined,
  Lightbulb,
  Info,
  CalendarDays,
} from "lucide-react";
import { Card } from "@/components/ui/card";


ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
);

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const chartStyles = {
  panel: {
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    overflow: "hidden",
  },
  header: {
    background: "#f8fafc",
    borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconWrap: {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #ff5c7d, #ff7d62)",
    color: "#fff",
  },
  title: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 800,
    color: "#1f2937",
  },
  subtitle: {
    margin: 0,
    fontSize: "0.78rem",
    color: "#6b7280",
  },
  body: {
    padding: "18px 16px 12px",
  },
  metricShell: {
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "18px",
    background: "#fff",
    padding: "18px 20px",
  },
};

export function GraficoIAhome() {
  const {
    data: ventas = [],
    isLoading: isLoadingVentas,
    isError: isErrorVentas,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: ventasIAResponse = [],
    isLoading: isLoadingVentasIA,
    isError: isErrorVentasIA,
  } = useQuery({
    queryKey: ["ventasIA"],
    queryFn: GetVentasIA,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const ventasIA =
    ventasIAResponse?.data ||
    (Array.isArray(ventasIAResponse) ? ventasIAResponse : []);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechasHistoricas = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);
    fechasHistoricas.push(fecha.toISOString().split("T")[0]);
  }

  const fechasFuturas = [];
  for (let i = 0; i <= 6; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    fechasFuturas.push(fecha.toISOString().split("T")[0]);
  }

  const fechaHoyStr = hoy.toISOString().split("T")[0];

  const ventasPorFecha = ventas.reduce((acc, venta) => {
    const fecha = new Date(venta.fechaVenta).toISOString().split("T")[0];
    acc[fecha] = (acc[fecha] || 0) + Number(venta.total || 0);
    return acc;
  }, {});

  const dataVentas = fechasHistoricas.map((fecha) => {
    return ventasPorFecha[fecha] || 0;
  });

  const prediccionesPorFecha = ventasIA.reduce((acc, prediccion) => {
    const fecha = new Date(prediccion.fecha).toISOString().split("T")[0];
    acc[fecha] = Number(prediccion.total) || 0;
    return acc;
  }, {});

  const dataPredicciones = fechasFuturas.map((fecha) => {
    if (fecha <= fechaHoyStr) return null;
    return prediccionesPorFecha[fecha] || 0;
  });

  const ventasUltimos7 = dataVentas.filter((valor) => valor !== null);
  const prediccionesUltimos7 = dataPredicciones.filter(
    (valor) => valor !== null,
  );
  const ventasTotales = ventasUltimos7.reduce(
    (sum, valor) => sum + Number(valor),
    0,
  );
  const prediccionTotal = prediccionesUltimos7.reduce(
    (sum, valor) => sum + Number(valor),
    0,
  );
  const promedioReal = ventasTotales / Math.max(ventasUltimos7.length, 1);
  const promedioPred =
    prediccionTotal / Math.max(prediccionesUltimos7.length, 1);

  const variacion = (() => {
    const ultimoReal = Number(ventasUltimos7[ventasUltimos7.length - 1] || 0);
    const anteriorReal = Number(
      ventasUltimos7[ventasUltimos7.length - 2] || ultimoReal,
    );
    if (!anteriorReal) return 0;
    return ((ultimoReal - anteriorReal) / anteriorReal) * 100;
  })();

  const realChartData = useMemo(
    () => ({
      labels: fechasHistoricas,
      datasets: [
        {
          label: "Ventas Reales",
          data: dataVentas,
          borderColor: "#1ea86a",
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return "rgba(30, 168, 106, 0.14)";
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(0, "rgba(30, 168, 106, 0.28)");
            gradient.addColorStop(1, "rgba(30, 168, 106, 0.02)");
            return gradient;
          },
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#1ea86a",
          pointBorderColor: "#ffffff",
          tension: 0.38,
          fill: true,
          spanGaps: true,
        },
      ],
    }),
    [dataVentas],
  );

  const predictionChartData = useMemo(
    () => ({
      labels: fechasFuturas,
      datasets: [
        {
          label: "Predicción IA",
          data: dataPredicciones,
          borderColor: "#ef4c4c",
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return "rgba(239, 76, 76, 0.12)";
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(0, "rgba(239, 76, 76, 0.18)");
            gradient.addColorStop(1, "rgba(239, 76, 76, 0.02)");
            return gradient;
          },
          borderWidth: 3,
          borderDash: [6, 6],
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#ef4c4c",
          pointBorderColor: "#ffffff",
          tension: 0.38,
          fill: true,
          spanGaps: true,
        },
      ],
    }),
    [dataPredicciones],
  );

  const chartOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        borderWidth: 0,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Fecha",
          color: "#6b7280",
          font: { size: 12, weight: "700" },
        },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
          maxTicksLimit: 8,
        },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: titleText,
          color: "#6b7280",
          font: { size: 12, weight: "700" },
        },
        beginAtZero: true,
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
        },
        grid: {
          color: "rgba(148, 163, 184, 0.18)",
        },
      },
    },
  });

  const dataReady =
    !isLoadingVentas &&
    !isLoadingVentasIA &&
    !isErrorVentas &&
    !isErrorVentasIA;
  const hasError = isErrorVentas || isErrorVentasIA;

  return (
    <Card className="w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
      <CondicionCarga isLoading={isLoadingVentasIA} isError={isErrorVentasIA}>
        <div className="px-4 pt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: "var(--bg-emerald-soft)",
                  color: "var(--fw-emerald)",
                }}
              >
                <ChartNoAxesCombined size={24} />
              </span>
              <div>
                <h2 className="mb-1 text-base font-semibold text-foreground sm:text-lg">
                  Ventas de los últimos 7 días y Predicción IA
                </h2>
                <p className="mb-0 text-sm text-muted-foreground">
                  Histórico vs. pronóstico (próximos 7 días)
                </p>
              </div>
            </div>

            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground"
            >
              <CalendarDays size={18} />
            </div>
          </div>
        </div>

        <div className="px-4 pt-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Ventas Reales (7 días)",
                value: formatCurrency(ventasTotales),
                delta: `${variacion >= 0 ? "+" : ""}${variacion.toFixed(1)}%`,
                color: "#1fae68",
                bg: "#e8f9ee",
              },
              {
                label: "Predicción (7 días)",
                value: formatCurrency(prediccionTotal),
                color: "#ef4c4c",
                bg: "#ffe9e9",
              },
              {
                label: "Promedio Diario (Reales)",
                value: formatCurrency(promedioReal),
                sub: "Por día",
                color: "#3b82f6",
                bg: "#edf6ff",
              },
              {
                label: "Promedio Diario (Predicción)",
                value: formatCurrency(promedioPred),
                sub: "Por día",
                color: "#a855f7",
                bg: "#f4ebff",
              },
            ].map((item) => (
              <div key={item.label} className="min-w-0">
                <Card
                  className="h-full rounded-xl border border-border p-3"
                  style={{ background: item.bg }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-foreground">
                        {item.label}
                      </div>
                      {item.delta && (
                        <span
                          className="text-xs font-semibold"
                          style={{ color: item.color }}
                        >
                          {item.delta}
                        </span>
                      )}
                    </div>

                    <div
                      className="mt-3 font-bold text-foreground"
                      style={{ fontSize: "1.1rem" }}
                    >
                      {item.value}
                    </div>

                    {item.sub && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.sub}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            <div className="min-w-0">
              <Card className="h-full overflow-hidden rounded-xl border border-border">
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                  <span
                    className="inline-block size-3 rounded-full"
                    style={{ width: 12, height: 12, background: "#22c55e" }}
                  />
                  <span className="font-semibold text-foreground">Ventas Reales</span>
                </div>
                <div style={{ height: "340px" }} className="p-4">
                  {hasError ? (
                    <p className="mb-0 text-center text-destructive">
                      Error al cargar los datos del gráfico.
                    </p>
                  ) : !dataReady ? (
                    <p className="mb-0 text-center text-muted-foreground">
                      Cargando datos del gráfico...
                    </p>
                  ) : (
                    <Line data={realChartData} options={chartOptions("S/")} />
                  )}
                </div>
              </Card>
            </div>

            <div className="min-w-0">
              <Card className="h-full overflow-hidden rounded-xl border border-border">
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                  <span
                    className="inline-block size-3 rounded-full"
                    style={{ width: 12, height: 12, background: "#ef4444" }}
                  />
                  <span className="font-semibold text-foreground">Predicción IA</span>
                </div>
                <div style={{ height: "340px" }} className="p-4">
                  {hasError ? (
                    <p className="mb-0 text-center text-destructive">
                      Error al cargar los datos del gráfico.
                    </p>
                  ) : !dataReady ? (
                    <p className="mb-0 text-center text-muted-foreground">
                      Cargando datos del gráfico...
                    </p>
                  ) : (
                    <Line
                      data={predictionChartData}
                      options={chartOptions("S/")}
                    />
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="min-w-0">
              <Card
                className="flex items-start gap-3 rounded-xl border border-border p-4"
                style={{ background: "#ecfeff" }}
              >
                <div
                  className="flex shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "#dff8ec", width: 40, height: 40 }}
                >
                  <Lightbulb size={20} color="#0f766e" />
                </div>
                <div>
                  <div className="mb-1 font-semibold text-foreground">
                    ¿Cómo interpretarlo?
                  </div>
                  <div
                    className="text-sm leading-relaxed text-muted-foreground"
                    style={{ lineHeight: 1.6 }}
                  >
                    Los datos reales muestran las ventas efectivas de los
                    últimos 7 días. La IA predice las ventas para los próximos 7
                    días con un rango de confianza.
                  </div>
                </div>
              </Card>
            </div>

            <div className="min-w-0">
              <Card
                className="flex items-start gap-3 rounded-xl border border-border p-4"
                style={{ background: "#f5f3ff" }}
              >
                <div
                  className="flex shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "#ede9fe", width: 40, height: 40 }}
                >
                  <Info size={20} color="#7c3aed" />
                </div>
                <div>
                  <div className="mb-1 font-semibold text-foreground">
                    Información clave
                  </div>
                  <ul
                    className="mb-0 list-disc pl-5 text-sm leading-relaxed text-muted-foreground"
                    style={{ lineHeight: 1.7 }}
                  >
                    <li>
                      La predicción se basa en patrones históricos,
                      estacionalidad y tendencias.
                    </li>
                    <li>
                      El rango sombreado muestra el nivel de confianza de la
                      predicción (±15%).
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </CondicionCarga>
    </Card>
  );
}
