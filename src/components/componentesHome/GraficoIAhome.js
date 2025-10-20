import { useMutation, useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2"; // Importar el componente de línea de Chart.js
import "chart.js/auto"; // Importar configuración automática de Chart.js
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { GetVentasIA } from "../../service/serviceIA/GetVentasIA";
import { GetRecomendaciones } from "../../service/serviceIA/GetRecomendaciones";
import { useState } from "react";
import { PlatoMasVendido } from "./PlatosMasVendidos";
import { ChartColumnBig, WandSparkles } from "lucide-react";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function GraficoIAhome() {
  const [recomendaciones, setRecomendaciones] = useState(null);
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

  // Asegurarse de que ventasIA sea un array
  const ventasIA = Array.isArray(ventasIAResponse) ? ventasIAResponse : [];

  // Obtener recomendaciones
  const {
    mutate: generarAnalisisIA,
    isLoading: isLoadingRecomendaciones,
    isError: isErrorRecomendaciones,
  } = useMutation({
    mutationFn: GetRecomendaciones,
    onSuccess: (data) => {
      setRecomendaciones(data);
    },
    onError: (error) => {
      console.error("Error al generar recomendaciones", error);
    },
  });

  // Obtener la fecha de hace 7 días y extender las etiquetas para incluir predicciones
  const hoy = new Date();
  const hace7Dias = new Date(hoy);
  hace7Dias.setDate(hoy.getDate() - 7);

  // Generar etiquetas (labels) para los últimos 7 días y los próximos 7 días
  const labels = [];
  for (let i = -7; i <= 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    labels.push(fecha.toISOString().split("T")[0]); // Formato YYYY-MM-DD
  }

  // Procesar datos para el gráfico de ventas reales
  const ventasPorFecha = [...ventas].reduce((acc, venta) => {
    // Convertir la fecha de la venta al formato YYYY-MM-DD
    const fecha = new Date(venta.fechaVenta).toISOString().split("T")[0];

    // Sumar el total de ventas para la fecha actual
    acc[fecha] = (acc[fecha] || 0) + Number(venta.total || 0); // Asegurarse de que 'total' sea un número

    return acc; // Retornar el acumulador actualizado
  }, {});

  const dataVentas = labels.map((fecha) => ventasPorFecha[fecha] || 0); // Totales por fecha

  // Procesar datos para el gráfico de predicciones (ventasIA)
  const prediccionesPorFecha = ventasIA.reduce((acc, prediccion) => {
    const fecha = new Date(prediccion.fecha).toISOString().split("T")[0];
    acc[fecha] = Number(prediccion.total) || 0;
    return acc;
  }, {});

  // Crear array alineado a labels
  const dataPredicciones = labels.map(
    (fecha) => prediccionesPorFecha[fecha] || 0
  );

  // Configuración del gráfico
  const data = {
    labels,
    datasets: [
      {
        label: "Ventas Reales (Últimos 7 días)",
        data: dataVentas,
        borderColor: "rgba(54, 162, 235, 1)", // Azul para la línea
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Fondo azulado
        pointBackgroundColor: "rgba(54, 162, 235, 1)", // Azul para los puntos
        pointBorderColor: "#fff", // Blanco para el borde de los puntos
        pointHoverBackgroundColor: "#fff", // Blanco al pasar el cursor
        pointHoverBorderColor: "rgba(54, 162, 235, 1)", // Azul al pasar el cursor
        tension: 0.4, // Suavizar las líneas
        fill: true, // Pintar el área debajo de la línea
      },
      {
        label: "Predicción de Ventas (IA)",
        data: dataPredicciones,
        borderColor: "rgba(255, 99, 132, 1)", // Rojo para la línea
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Fondo rosado
        pointBackgroundColor: "rgba(255, 99, 132, 1)", // Rojo para los puntos
        pointBorderColor: "#fff", // Blanco para el borde de los puntos
        pointHoverBackgroundColor: "#fff", // Blanco al pasar el cursor
        pointHoverBorderColor: "rgba(255, 99, 132, 1)", // Rojo al pasar el cursor
        tension: 0.4, // Suavizar las líneas
        fill: true, // Pintar el área debajo de la línea
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permitir ajustar el tamaño del gráfico
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#444", // Color del texto de la leyenda
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Fecha",
          color: "#666", // Color del título del eje X
        },
        ticks: {
          color: "#666", // Color de las etiquetas del eje X
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Ventas (S/)",
          color: "#666", // Color del título del eje Y
        },
        ticks: {
          color: "#666", // Color de las etiquetas del eje Y
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="row mb-3 g-3">
      {/* Platos más pedidos */}
      <div className="col-md-4">
        <div className="card p-3 shadow-sm h-100">
          <PlatoMasVendido />
        </div>
      </div>
      {/* Gráfico de Ventas */}
      <div className="col-md-8">
        <CondicionCarga isLoading={isLoadingVentasIA} isError={isErrorVentasIA}>
          <div className="card shadow-sm chart-container h-100">
            <div className="card-header m-3">
              <p className="mb-0 text-dark h5">
                Ventas Históricas y Predicciones (Últimos 7 días)
              </p>
            </div>
            <div className="card-body">
              <div className="mt-4" style={{ height: "300px" }}>
                {isLoadingVentas || isLoadingVentasIA ? (
                  <p className="text-muted">Cargando datos...</p>
                ) : isErrorVentas || isErrorVentasIA ? (
                  <p className="text-danger">Error al cargar los datos.</p>
                ) : (
                  <Line data={data} options={options} />
                )}
              </div>
            </div>
          </div>
        </CondicionCarga>
      </div>
      {/* Recomendaciones de IA */}
      <div className="col-md-12">
        <div className="card shadow-sm h-100">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="text-dark h5 m-3 d-flex align-items-center mb-0">
                <ChartColumnBig
                  color={"auto"}
                  height="24px"
                  width="24px"
                  className="me-2"
                />
                Segun IA
              </p>
              <div className="d-flex justify-content-center w-50">
                {" "}
                {/* Agregar este contenedor para el centrado */}
                <button
                  className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 px-3 py-2"
                  onClick={() => generarAnalisisIA()}
                  disabled={isLoadingRecomendaciones}
                  style={{ minWidth: "160px" }}
                >
                  <WandSparkles style={{ color: "auto" }} size={24} />
                  <span style={{ fontSize: "16px" }}>
                    {isLoadingRecomendaciones ? "Generando..." : "Generar"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            {isLoadingRecomendaciones ? (
              <p>Cargando recomendaciones...</p>
            ) : isErrorRecomendaciones ? (
              <p className="text-danger">Error al cargar recomendaciones.</p>
            ) : recomendaciones ? (
              <>
                <p>
                  <strong>Resumen:</strong> {recomendaciones.resumen_ejecutivo}
                </p>
                <p>
                  <strong>Análisis:</strong>{" "}
                  {recomendaciones.analisis_comparativo}
                </p>

                <div className="mt-3">
                  <strong>Tendencias:</strong>
                  <ul>
                    {recomendaciones.tendencias?.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <strong>Recomendaciones:</strong>
                  <ul>
                    {recomendaciones.recomendaciones?.map((r, i) => (
                      <li key={i}>
                        <strong>{r.titulo}</strong>: {r.descripcion}
                        <span
                          className={`badge bg-${
                            r.prioridad === "alta" ? "danger" : "secondary"
                          } ms-2`}
                        >
                          {r.prioridad}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <strong>Causas posibles:</strong>
                  <ul>
                    {recomendaciones.causas_posibles?.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-muted">
                Haz clic en "Generar" para obtener recomendaciones.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
