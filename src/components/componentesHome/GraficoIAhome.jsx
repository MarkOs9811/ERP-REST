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
    <div className="card  overflow-hidden w-100">
      <CondicionCarga isLoading={isLoadingVentasIA} isError={isErrorVentasIA}>
        <div className="px-3 pt-3">
          <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
            <div className="d-flex align-items-center gap-3">
              <span
                className="rounded-circle p-2 me-2"
                style={{
                  background: "var(--bg-emerald-soft)",
                  color: "var(--fw-emerald)",
                }}
              >
                <ChartNoAxesCombined size={24} />
              </span>
              <div>
                <h5 className="mb-1 fw-bold text-dark">
                  Ventas de los últimos 7 días y Predicción IA
                </h5>
                <p className="mb-0 text-muted small">
                  Histórico vs. pronóstico (próximos 7 días)
                </p>
              </div>
            </div>

            <div
              className="d-flex align-items-center justify-content-center rounded-3 border bg-light text-secondary"
              style={{ width: 38, height: 38 }}
            >
              <CalendarDays size={18} />
            </div>
          </div>
        </div>

        <div className="px-3 pt-3">
          <div className="row g-3">
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
              <div key={item.label} className="col-12 col-md-6 col-xl-3">
                <div
                  className="card  h-100 rounded-4"
                  style={{ background: item.bg }}
                >
                  <div className="card-body py-3 px-3">
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <div className="small fw-bold text-dark">
                        {item.label}
                      </div>
                      {item.delta && (
                        <span
                          className="small fw-bold"
                          style={{ color: item.color }}
                        >
                          {item.delta}
                        </span>
                      )}
                    </div>

                    <div
                      className="mt-3 fw-bold text-dark"
                      style={{ fontSize: "1.1rem" }}
                    >
                      {item.value}
                    </div>

                    {item.sub && (
                      <div className="mt-1 small text-muted">{item.sub}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <div className="card border h-100 rounded-4">
                <div className="card-header bg-light border-0 d-flex align-items-center gap-2 py-3">
                  <span
                    className="rounded-circle d-inline-block"
                    style={{ width: 12, height: 12, background: "#22c55e" }}
                  />
                  <span className="fw-bold text-dark">Ventas Reales</span>
                </div>
                <div style={{ height: "340px" }} className="card-body">
                  {hasError ? (
                    <p className="text-center text-danger mb-0">
                      Error al cargar los datos del gráfico.
                    </p>
                  ) : !dataReady ? (
                    <p className="text-center text-muted mb-0">
                      Cargando datos del gráfico...
                    </p>
                  ) : (
                    <Line data={realChartData} options={chartOptions("S/")} />
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card border h-100 rounded-4">
                <div className="card-header bg-light border-0 d-flex align-items-center gap-2 py-3">
                  <span
                    className="rounded-circle d-inline-block"
                    style={{ width: 12, height: 12, background: "#ef4444" }}
                  />
                  <span className="fw-bold text-dark">Predicción IA</span>
                </div>
                <div style={{ height: "340px" }} className="card-body">
                  {hasError ? (
                    <p className="text-center text-danger mb-0">
                      Error al cargar los datos del gráfico.
                    </p>
                  ) : !dataReady ? (
                    <p className="text-center text-muted mb-0">
                      Cargando datos del gráfico...
                    </p>
                  ) : (
                    <Line
                      data={predictionChartData}
                      options={chartOptions("S/")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 pb-3">
          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <div
                className="card  d-flex align-items-start gap-3 p-3"
                style={{ background: "#ecfeff" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{ background: "#dff8ec", width: 40, height: 40 }}
                >
                  <Lightbulb size={20} color="#0f766e" />
                </div>
                <div>
                  <div className="fw-bold text-dark mb-1">
                    ¿Cómo interpretarlo?
                  </div>
                  <div
                    className="text-secondary small"
                    style={{ lineHeight: 1.6 }}
                  >
                    Los datos reales muestran las ventas efectivas de los
                    últimos 7 días. La IA predice las ventas para los próximos 7
                    días con un rango de confianza.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div
                className="card  d-flex align-items-start gap-3 p-3"
                style={{ background: "#f5f3ff" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{ background: "#ede9fe", width: 40, height: 40 }}
                >
                  <Info size={20} color="#7c3aed" />
                </div>
                <div>
                  <div className="fw-bold text-dark mb-1">
                    Información clave
                  </div>
                  <ul
                    className="mb-0 ps-3 text-secondary small"
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
              </div>
            </div>
          </div>
        </div>
      </CondicionCarga>
    </div>
  );
}
