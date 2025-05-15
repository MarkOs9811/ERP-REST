import {
  CashOutline,
  RestaurantOutline,
  CartOutline,
  StorefrontOutline,
  PeopleOutline,
  AlertCircleOutline,
  BarChartOutline,
  TimeOutline,
  WalletOutline,
  ClipboardOutline,
  PersonOutline,
  CheckmarkDoneOutline,
  PulseOutline,
} from "react-ionicons";
import "../css/EstilosHome.css";
import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import { use, useEffect } from "react";
import { CabeceraHome } from "../components/componentesHome/CabeceraHome";
import { InformacionRapidaHome } from "../components/componentesHome/InformacionRapidaHome";
import { GraficoIAhome } from "../components/componentesHome/GraficoIAhome";
import { PedidosPendientesHome } from "../components/componentesHome/PedidosPendientesHome";
import { PedidosPopularesHome } from "../components/componentesHome/PedidosPopularesHome";
import { AccesosRapidos } from "../components/componentesHome/AccesosRapidos";
import { AsistenteIaHome } from "../components/componentesHome/AsistenteIaHome";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../service/ObtenerVentasDetalle";

export function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const shapes = [
      "shape-circle",
      "shape-square",
      "shape-diamond",
      "shape-blob",
    ];
    document.querySelectorAll(".dashboard-card").forEach((card) => {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      card.classList.add(randomShape);
    });
  }, []);

  const {
    data: ventasList = [],
    onLoading: loadingVentas,
    onError: errorVentas,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Datos de ejemplo ampliados
  const metrics = {
    ventasHoy: { value: 12450, trend: "up" },
    platosPopulares: ["Lomo Saltado", "Ceviche", "Arroz con Pollo"],
    mesasOcupadas: 8,
    alertasInventario: 3,
    pedidosPendientes: 5,
    usuariosActivos: [
      { id: 1, nombre: "Juan Pérez", foto: "", hora: "08:30 AM" },
      { id: 2, nombre: "María Gómez", foto: "", hora: "09:15 AM" },
      { id: 3, nombre: "Carlos Ruiz", foto: "", hora: "10:00 AM" },
    ],
    clientesRecurrentes: [
      { id: 1, nombre: "Ana Torres", visitas: 12, ultimaVisita: "Ayer" },
      { id: 2, nombre: "Luis Mendoza", visitas: 8, ultimaVisita: "Hoy" },
      { id: 3, nombre: "Sofía Castro", visitas: 5, ultimaVisita: "Hoy" },
    ],
    pedidosWeb: [
      {
        id: 1,
        cliente: "Cliente Web #1254",
        estado: "En preparación",
        tiempo: "15 min",
      },
      {
        id: 2,
        cliente: "Cliente Web #1255",
        estado: "Pendiente",
        tiempo: "5 min",
      },
    ],
    // Nuevos datos para IA
    recomendacionesIA: [
      {
        id: 1,
        titulo: "Optimización de menú",
        descripcion:
          "Sugerimos reducir inventario de 'Tallarines Rojos' por baja rotación",
        icono: "lightbulb",
        color: "warning",
      },
      {
        id: 2,
        titulo: "Oportunidad de venta",
        descripcion:
          "Clientes que piden 'Ceviche' suelen pedir 'Chicha Morada' (85% correlación)",
        icono: "currency-dollar",
        color: "success",
      },
      {
        id: 3,
        titulo: "Previsión de clientes",
        descripcion:
          "Mañana se espera un 20% más de clientes (basado en patrones históricos)",
        icono: "people-fill",
        color: "primary",
      },
    ],
    satisfaccionClientes: {
      puntuacion: 8.7,
      factores: [
        { nombre: "Tiempo de espera", valor: 85 },
        { nombre: "Calidad comida", valor: 92 },
        { nombre: "Atención", valor: 76 },
      ],
    },
  };

  return (
    <ContenedorPrincipal>
      <CabeceraHome ventasList={ventasList} />

      <InformacionRapidaHome />

      {/* Sección Media */}
      <GraficoIAhome />

      {/* Sección Inferior */}
      <div className="row g-3 mb-3">
        {/* Pedidos Web Pendientes */}
        <PedidosPendientesHome />

        {/* Platos Populares */}

        {/* Análisis de Satisfacción con IA */}
        <div className="col-md-5">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="text-dark mb-3 d-flex align-items-center">
                <i className="bi bi-emoji-smile text-warning me-2"></i>
                Análisis de Satisfacción (IA)
              </h5>
              <div className="text-center mb-3">
                <div className="ai-sentiment-score display-4 text-primary">
                  {metrics.satisfaccionClientes.puntuacion}/10
                </div>
                <small className="text-muted">
                  Puntuación promedio basada en reseñas
                </small>
              </div>
              <div className="ai-sentiment-factors">
                <h6 className="text-dark">Factores clave:</h6>
                {metrics.satisfaccionClientes.factores.map((factor, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <div
                      className="progress flex-grow-1 me-2"
                      style={{ height: "8px" }}
                    >
                      <div
                        className={`progress-bar bg-${
                          index === 0
                            ? "success"
                            : index === 1
                            ? "info"
                            : "warning"
                        }`}
                        style={{ width: `${factor.valor}%` }}
                      ></div>
                    </div>
                    <small>{factor.nombre}</small>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <button className="btn btn-sm btn-outline-primary w-100">
                  Ver análisis completo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <AccesosRapidos />
      </div>

      {/* Asistente de IA Flotante */}
      <AsistenteIaHome />
    </ContenedorPrincipal>
  );
}
