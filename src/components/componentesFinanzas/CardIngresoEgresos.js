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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler);

export function CardIngresoEgresos({ sumaIngresos, sumaEgresos }) {
  // --- Datos falsos para simular el gráfico ---
  const dataIngresos = [10, 12, 9, 15, 18, 20, 17, 25, 28];
  const dataEgresos = [8, 9, 11, 13, 10, 14, 13, 15, 12];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4, borderWidth: 2 },
      point: { radius: 0 }, // sin puntos
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  const ingresosChartData = {
    labels: dataIngresos.map((_, i) => i),
    datasets: [
      {
        data: dataIngresos,
        borderColor: "rgba(46,133,204,0.9)",
        backgroundColor: "rgba(46,133,204,0.1)",
        fill: true,
      },
    ],
  };

  const egresosChartData = {
    labels: dataEgresos.map((_, i) => i),
    datasets: [
      {
        data: dataEgresos,
        borderColor: "rgba(245,88,88,0.9)",
        backgroundColor: "rgba(245,88,88,0.1)",
        fill: true,
      },
    ],
  };

  return (
    <div className="col-md-12">
      <div className="row g-3">
        {/* CARD INGRESOS */}
        <div className="col-md-12">
          <div
            className="card shadow-sm py-2 h-100 position-relative overflow-hidden"
            style={{
              background:
                "linear-gradient(165deg, rgba(46,133,204,0.05), rgba(46, 133, 204, 0.77))",
              border: "1px solid rgba(46,133,204,0.2)",
            }}
          >
            {/* gráfico de fondo */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ opacity: 0.3 }}
            >
              <Line data={ingresosChartData} options={options} />
            </div>

            <div className="card-header p-2 w-100 bg-transparent position-relative">
              <p className="h6 card-title d-flex align-items-center">
                <TrendingUp className="text-auto mx-2" size={35} />
                Total Ingresos
              </p>
            </div>

            <div className="card-body p-3 position-relative">
              <p
                className="h1 text-left ms-3 fw-bold"
                style={{ color: "#2e85ccff" }}
              >
                S/. {sumaIngresos.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* CARD EGRESOS */}
        <div className="col-md-12">
          <div
            className="card shadow-sm py-2 h-100 position-relative overflow-hidden"
            style={{
              background:
                "linear-gradient(175deg, rgba(245,88,88,0.05), rgba(201, 10, 10, 0.51))",
              border: "1px solid rgba(245,88,88,0.3)",
            }}
          >
            {/* gráfico de fondo */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ opacity: 0.3 }}
            >
              <Line data={egresosChartData} options={options} />
            </div>

            <div className="card-header p-2 w-100 bg-transparent position-relative">
              <p className="h6 card-title d-flex align-items-center">
                <TrendingDown size={35} className="mx-2 text-auto" />
                Total Egresos
              </p>
            </div>

            <div className="card-body p-3 position-relative">
              <p
                className="h1 text-left ms-3 fw-bold"
                style={{ color: "#d12222ff" }}
              >
                S/. {sumaEgresos.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
