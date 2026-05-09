import React, { useMemo } from "react";
// 1. Importamos los elementos necesarios de Chart.js y react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

// 2. Registramos los módulos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function GraficoVentasDelivery({ ventasList, load, errorLoad }) {
  // 3. Procesamos los datos
  const procesarDatos = useMemo(() => {
    if (!ventasList || ventasList.length === 0) {
      return { labels: [], datasetWeb: [], datasetLocal: [] };
    }

    // [CORRECCIÓN 1]: Generar últimos 7 días con la zona horaria local correcta
    const ultimos7Dias = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        // Construimos YYYY-MM-DD manualmente para evitar desfases de UTC
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      })
      .reverse();

    // Inicializar contadores
    const agrupado = ultimos7Dias.map((fecha) => {
      // Al agregar T00:00:00 forzamos a JS a leerlo en hora local
      const fechaObjeto = new Date(fecha + "T00:00:00");
      return {
        fechaOriginal: fecha,
        fechaFormateada: fechaObjeto.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
        }),
        ventasWeb: 0,
        ventasLocal: 0,
      };
    });

    // Contar ventas
    ventasList.forEach((venta) => {
      if (!venta.fechaVenta) return;

      // [CORRECCIÓN 2]: Usar substring para garantizar que siempre obtenemos "YYYY-MM-DD"
      // sin importar si hay una "T", un espacio, o nada extra.
      const fechaVentaDate = venta.fechaVenta.substring(0, 10);

      const diaEnGrafico = agrupado.find(
        (d) => d.fechaOriginal === fechaVentaDate,
      );

      if (diaEnGrafico) {
        // [NOTA]: Asegúrate de que el backend manda esta propiedad exactamente como "idPedidoWeb"
        if (venta.idPedidoWeb !== null && venta.idPedidoWeb !== undefined) {
          diaEnGrafico.ventasWeb += 1;
        } else {
          diaEnGrafico.ventasLocal += 1;
        }
      }
    });

    return {
      labels: agrupado.map((d) => d.fechaFormateada),
      datasetWeb: agrupado.map((d) => d.ventasWeb),
      datasetLocal: agrupado.map((d) => d.ventasLocal),
    };
  }, [ventasList]);

  // 4. Construimos el objeto "data"
  const data = {
    labels: procesarDatos.labels,
    datasets: [
      {
        label: "Delivery (Web)",
        data: procesarDatos.datasetWeb,
        backgroundColor: "#FF992C",
        borderRadius: 4,
      },
      {
        label: "Local (Mesa/Llevar)",
        data: procesarDatos.datasetLocal,
        backgroundColor: "#17C668",
        borderRadius: 4,
      },
    ],
  };

  // 5. Configuramos las opciones visuales del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#6B7280",
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280" },
      },
      y: {
        grid: {
          color: "#F3F4F6",
          drawBorder: false,
        },
        ticks: {
          color: "#6B7280",
          stepSize: 1, // Evita decimales (no puedes vender 1.5 pedidos)
        },
      },
    },
  };

  return (
    <CondicionCarga isLoading={load} isError={errorLoad}>
      <div
        className="card shadow-sm border-0 rounded-4 p-4 h-100 w-100"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="d-flex align-items-center mb-4">
          <div
            className="p-2 rounded-circle me-3 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "var(--bg-saffron-soft)",
              color: "var(--fw-saffron)",
            }}
          >
            <TrendingUp size={24} />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ color: "var(--text-main)" }}>
              Tendencia de Pedidos
            </h5>
            <span className="small" style={{ color: "var(--text-muted)" }}>
              Últimos 7 días: Web vs Local
            </span>
          </div>
        </div>

        <div style={{ position: "relative", width: "100%", height: "300px" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </CondicionCarga>
  );
}
