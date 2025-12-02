import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { GetInformesFinancieros } from "../service/serviceFinanzas/GetInformesFinancieros";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

// 1. Array constante con los meses abreviados
const MESES_ABREVIADOS = [
  "", // Dejamos el índice 0 vacío para que coincida con mes 1 = Ene
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export function GraficoPagoEmpleados() {
  const {
    data: dataInformes = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["finanzas"],
    queryFn: GetInformesFinancieros,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError) return <div>Error al cargar datos: {error.message}</div>;

  const datosPagos = dataInformes.datosPagosEmpleados || {};

  // Datos crudos del backend (pueden ser [1, 2, 11] o [0, 0, ..., 11])
  const rawLabels = datosPagos.labels || [];
  const montos = datosPagos.data || [];

  // 2. Transformación: Convertir números a Nombres
  // Si rawLabels trae ["1", "2", "11"], esto generará ["Ene", "Feb", "Nov"]
  const labels = rawLabels.map(
    (mesNumero) => MESES_ABREVIADOS[parseInt(mesNumero)]
  );

  const data = {
    labels, // Usamos las etiquetas transformadas
    datasets: [
      {
        label: "Monto Pagado",
        data: montos,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "#0971AC",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Meses",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 30,
        },
      },
      y: {
        title: {
          display: true,
          text: "Monto Total",
        },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            // El label ya viene como texto ("Nov"), así que lo mostramos directo
            return "Mes: " + tooltipItems[0].label;
          },
          label: function (tooltipItem) {
            // Opcional: Formatear el dinero bonito (S/ 1,200.00)
            const valor = tooltipItem.raw;
            return (
              "Monto: S/ " +
              Number(valor).toLocaleString("es-PE", {
                minimumFractionDigits: 2,
              })
            );
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
