import { TrendingDown, TrendingUp } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
import { getThemeColors, hexToRgb, toRgba } from "../../utils/ThemeColors";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler);

export function CardIngresoEgresos({ sumaIngresos, sumaEgresos }) {
  const colors = getThemeColors();
  const dataIngresos = [10, 12, 9, 15, 18, 20, 17, 25, 28];
  const dataEgresos = [8, 9, 11, 13, 10, 14, 13, 15, 12];
  const ingresoBase = colors.emerald;
  const egresoBase = colors.strawberry;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4, borderWidth: 2 },
      point: { radius: 0 },
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  const ingresosChartData = {
    labels: dataIngresos.map((_, i) => i),
    datasets: [
      {
        data: dataIngresos,
        borderColor: ingresoBase,
        backgroundColor: toRgba(hexToRgb(ingresoBase), 0.2),
        fill: true,
      },
    ],
  };

  const egresosChartData = {
    labels: dataEgresos.map((_, i) => i),
    datasets: [
      {
        data: dataEgresos,
        borderColor: egresoBase,
        backgroundColor: toRgba(hexToRgb(egresoBase), 0.18),
        fill: true,
      },
    ],
  };

  return (
    <div className="col-12">
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div
            className="card p-3 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--fw-border)",
              minHeight: "140px",
            }}
          >
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ opacity: 0.34, pointerEvents: "none" }}
            >
              <Line data={ingresosChartData} options={options} />
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                className="rounded-circle p-3 position-relative"
                style={{
                  backgroundColor: "var(--bg-emerald-soft)",
                  color: colors.emerald,
                }}
              >
                <TrendingUp size={24} />
              </span>
              <span
                className="ms-auto fw-bold"
                style={{ fontSize: "0.9rem", color: colors.emerald }}
              >
                Ingresos
              </span>
            </div>

            <div className="position-relative">
              <span
                className="text-muted fw-bold"
                style={{
                  fontSize: "0.85rem",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Total Ingresos
              </span>
              <h3
                className="fw-bold mb-0"
                style={{ fontSize: "1.3rem", color: colors.emerald }}
              >
                S/. {sumaIngresos.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div
            className="card p-3 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--fw-border)",
              minHeight: "140px",
            }}
          >
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ opacity: 0.34, pointerEvents: "none" }}
            >
              <Line data={egresosChartData} options={options} />
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                className="rounded-circle p-3 position-relative"
                style={{
                  backgroundColor: "var(--bg-strawberry-soft)",
                  color: colors.strawberry,
                }}
              >
                <TrendingDown size={24} />
              </span>
              <span
                className="ms-auto fw-bold"
                style={{ fontSize: "0.9rem", color: colors.strawberry }}
              >
                Egresos
              </span>
            </div>

            <div className="position-relative">
              <span
                className="text-muted fw-bold"
                style={{
                  fontSize: "0.85rem",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Total Egresos
              </span>
              <h3
                className="fw-bold mb-0"
                style={{ fontSize: "1.3rem", color: colors.strawberry }}
              >
                S/. {sumaEgresos.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
