import { useQuery } from "@tanstack/react-query";
import { GetCompras } from "../service/GetCompras";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Cargando } from "../components/componentesReutilizables/Cargando";

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

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

export function GraficoEgresoTodo() {
  const {
    data: dataCompras = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["compras"],
    queryFn: GetCompras,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isLoading)
    return (
      <div>
        <Cargando />
      </div>
    );
  if (isError) return <div>Error al cargar datos</div>;

  // Agrupar compras por mes y sumar egresos
  const egresosPorMes = {};
  const comprasArray = Array.isArray(dataCompras)
    ? dataCompras
    : Array.isArray(dataCompras.compras)
    ? dataCompras.compras
    : [];

  comprasArray.forEach((compra) => {
    const [anio, mes] = compra.fecha_compra.split("-");
    const key = `${anio}-${mes}`;
    egresosPorMes[key] =
      (egresosPorMes[key] || 0) + parseFloat(compra.totalPagado || 0);
  });

  // Ordenar meses
  const mesesOrdenados = Object.keys(egresosPorMes).sort();

  const labels = mesesOrdenados.map((mesKey) => {
    const [anio, mes] = mesKey.split("-");
    return `${mesesES[parseInt(mes, 10) - 1]}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Egresos por Compras (S/.)",
        data: mesesOrdenados.map((mes) => egresosPorMes[mes]),
        fill: true,
        backgroundColor: "rgba(243, 150, 5, 0.2)",
        borderColor: "#F39605",
        pointBackgroundColor: "#F39605",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: "Mes" } },
      y: { title: { display: true, text: "Egresos (S/.)" }, beginAtZero: true },
    },
  };

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
