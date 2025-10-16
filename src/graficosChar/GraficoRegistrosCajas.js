import { useQuery } from "@tanstack/react-query";
import { GetRegistrosCajas } from "../service/accionesVentas/GetRegistrosCajas";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Cargando } from "../components/componentesReutilizables/Cargando";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function GraficoRegistrosCajas() {
  const {
    data: registrosCajasData = [],
    isLoading: loadingRegistrosCajas,
    error: errorRegistrosCajas,
  } = useQuery({
    queryKey: ["registrosCajas"],
    queryFn: GetRegistrosCajas,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Si la data viene como { registros: [...] }
  const registros = Array.isArray(registrosCajasData)
    ? registrosCajasData
    : registrosCajasData.registros || [];

  // Agrupa por caja y suma el neto vendido
  const cajasMap = {};
  registros.forEach((registro) => {
    const nombreCaja = registro.caja?.nombreCaja || "Caja desconocida";
    const neto =
      parseFloat(registro.montoFinal || 0) -
      parseFloat(registro.montoInicial || 0);
    cajasMap[nombreCaja] = (cajasMap[nombreCaja] || 0) + neto;
  });

  const labels = Object.keys(cajasMap);
  const dataVentas = Object.values(cajasMap);

  const data = {
    labels,
    datasets: [
      {
        label: "Ventas por Caja (S/.)",
        data: dataVentas,
        backgroundColor: "rgba(52, 152, 219, 0.5)",
        borderColor: "#3498db",
        borderWidth: 2,
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
      x: { title: { display: true, text: "Caja" } },
      y: { title: { display: true, text: "Ventas (S/.)" }, beginAtZero: true },
    },
  };

  return (
    <div style={{ width: "100%", height: "350px" }}>
      {loadingRegistrosCajas ? (
        <Cargando />
      ) : (
        <>
          <Bar data={data} options={options} />
        </>
      )}
      {errorRegistrosCajas && (
        <div className="text-danger">
          Error al cargar los registros de cajas: {errorRegistrosCajas.message}
        </div>
      )}
    </div>
  );
}
