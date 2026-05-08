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

// 2. Registramos los módulos de Chart.js para poder usarlos en React
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function GraficoVentasDelivery({ ventasList, load, errorLoad }) {
  // 3. Procesamos los datos igual que antes, usando useMemo para optimizar
  const procesarDatos = useMemo(() => {
    if (!ventasList || ventasList.length === 0) {
      return { labels: [], datasetWeb: [], datasetLocal: [] };
    }

    // Generar últimos 7 días
    const ultimos7Dias = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      })
      .reverse();

    // Inicializar contadores
    const agrupado = ultimos7Dias.map((fecha) => {
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
      const fechaVentaDate = venta.fechaVenta.split("T")[0];
      const diaEnGrafico = agrupado.find(
        (d) => d.fechaOriginal === fechaVentaDate,
      );

      if (diaEnGrafico) {
        if (venta.idPedidoWeb !== null) {
          diaEnGrafico.ventasWeb += 1;
        } else {
          diaEnGrafico.ventasLocal += 1;
        }
      }
    });

    // Chart.js necesita arreglos separados para las etiquetas y los datos
    return {
      labels: agrupado.map((d) => d.fechaFormateada),
      datasetWeb: agrupado.map((d) => d.ventasWeb),
      datasetLocal: agrupado.map((d) => d.ventasLocal),
    };
  }, [ventasList]);

  // 4. Construimos el objeto "data" que requiere Chart.js
  const data = {
    labels: procesarDatos.labels,
    datasets: [
      {
        label: "Delivery (Web)",
        data: procesarDatos.datasetWeb,
        backgroundColor: "#FF992C", // Tu color --fw-saffron
        borderRadius: 4, // Bordes redondeados superiores
      },
      {
        label: "Local (Mesa/Llevar)",
        data: procesarDatos.datasetLocal,
        backgroundColor: "#17C668", // Tu color --fw-emerald
        borderRadius: 4,
      },
    ],
  };

  // 5. Configuramos las opciones visuales del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el gráfico llene el alto del contenedor padre
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#6B7280", // Color sutil para la leyenda (--text-muted)
          usePointStyle: true, // Usa círculos en la leyenda en lugar de rectángulos
        },
      },
      tooltip: {
        mode: "index",
        intersect: false, // Muestra el tooltip de ambas barras al pasar el mouse por la columna
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Oculta la cuadrícula vertical
        },
        ticks: {
          color: "#6B7280",
        },
      },
      y: {
        grid: {
          color: "#F3F4F6", // Líneas horizontales muy suaves (--fw-muetd)
          drawBorder: false,
        },
        ticks: {
          color: "#6B7280",
          stepSize: 1, // Evita decimales en el recuento de ventas
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
        {/* Encabezado del Gráfico */}
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

        {/* Contenedor del Gráfico (Debe tener una altura definida para Chart.js) */}
        <div style={{ position: "relative", width: "100%", height: "300px" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </CondicionCarga>
  );
}
