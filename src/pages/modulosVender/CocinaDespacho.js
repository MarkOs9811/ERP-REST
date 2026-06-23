import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPedidosCocina } from "../../service/accionesVender/GetPedidosCocina";

import { useEffect, useMemo, useState } from "react";

import BotonAnimado from "../../components/componentesReutilizables/BotonAnimado";
import Pusher from "pusher-js";
import "../../css/EstilosCocina.css";
import { CheckCheck, PrinterIcon, RotateCcw, AlertCircle } from "lucide-react"; // Importamos AlertCircle
import { PutData } from "../../service/CRUD/PutData";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { BadgeComponent } from "../../components/componentesReutilizables/BadgeComponent";

const estados = {
  0: { texto: "En espera", variant: "warning", columna: "espera" },
  2: { texto: "En preparación", variant: "info", columna: "preparacion" },
  1: { texto: "Listo", variant: "success", columna: "listo" },
};

function TarjetaPedido({ pedido }) {
  const [cargando, setCargando] = useState(false);
  const queryClient = useQueryClient();

  const esListo = pedido.estado === 1;
  const esEnPreparacion = pedido.estado === 2;

  const playBeep = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 1000;
    gain.gain.value = 0.12;

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.12);
    oscillator.onended = () => audioCtx.close();
  };

  const cambiarEstado = async () => {
    setCargando(true);
    const nuevoEstado = pedido.estado === 0 ? 2 : pedido.estado === 2 ? 1 : 0;
    const success = await PutData("pedidoCocina", pedido.id, {
      estado: nuevoEstado,
    });
    setCargando(false);
    if (success) {
      playBeep();
      queryClient.invalidateQueries(["pedidosEstado"]);
    }
  };

  const platos = useMemo(() => {
    try {
      return JSON.parse(pedido.detalle_platos);
    } catch {
      return [];
    }
  }, [pedido.detalle_platos]);

  const tipoPedidoInfo = {
    mesa: {
      titulo: `MESA ${pedido?.numeroMesa ?? "?"}`,
      borderTopColor: "#d8627e",
    },
    llevar: { titulo: "LLEVAR", borderTopColor: "#2a9d8f" },
    web: { titulo: "WSP", borderTopColor: "#0077b6" },
  };

  const { titulo, borderTopColor } = tipoPedidoInfo[pedido.tipo_pedido] ?? {
    titulo: "SIN TIPO",
    borderTopColor: "#999",
  };

  const cardStyle = esListo
    ? {
        backgroundColor: "#f0fdf4",
        border: "1px solid rgb(33, 146, 73)",
        opacity: 0.95,
      }
    : esEnPreparacion
      ? {
          backgroundColor: "#eff6ff",
          border: "1px solid #0c4a6e",
        }
      : {
          backgroundColor: "#fff",
          borderTop: `4px solid ${borderTopColor}`,
          borderBottom: "1px solid #e5e7eb",
          borderLeft: "1px solid #e5e7eb",
          borderRight: "1px solid #e5e7eb",
        };

  return (
    <div
      className="mb-3 shadow-sm p-0 position-relative"
      style={{
        ...cardStyle,
        borderRadius: "10px",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        className={`card-header d-flex justify-content-between align-items-center m-0 ${
          esListo
            ? "bg-transparent border-bottom-0"
            : esEnPreparacion
              ? "cocina-header-preparacion"
              : "cocina-header-espera"
        }`}
        style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
      >
        <span className="fw-bold cocina-pedido-id"># {pedido.id}</span>
        <span
          className={`cocina-pedido-title ${esListo ? "cocina-title-listo" : ""}`}
        >
          {titulo}
        </span>
        <BadgeComponent
          variant={estados[pedido.estado]?.variant}
          label={estados[pedido.estado]?.texto}
        />
      </div>

      {/* Body */}
      <div className="p-0">
        <ul className="list-group list-group-flush mb-2 bg-transparent">
          {platos.map((plato, idx) => (
            <li
              key={idx}
              className="list-group-item d-flex border-0 align-items-center bg-transparent"
              style={{
                fontSize: "0.95rem",
                textDecoration: esListo ? "line-through" : "none",
                color: esListo ? "#6b7280" : "#000",
              }}
            >
              <span className={esListo ? "" : "fw-bold"}>{plato.cantidad}</span>
              <span className="mx-2 cocina-text-muted">x</span>
              <span style={{ whiteSpace: "normal" }}>{plato.nombre}</span>{" "}
              {/* Ajuste para nombres largos */}
            </li>
          ))}
        </ul>

        {/* ============ SECCIÓN DE NOTAS DE COCINA (Detalles Extras) ============ */}
        {pedido.detalles_extras && (
          <div className="px-3 pb-2">
            <div
              className={`d-flex align-items-start gap-2 p-2 rounded ${
                esListo ? "cocina-nota-listo" : "cocina-nota-espera"
              }`}
              style={{
                fontSize: "0.85rem",
                border: esListo
                  ? "1px solid var(--fw-border)"
                  : "1px solid var(--fw-saffron)",
              }}
            >
              <AlertCircle
                size={16}
                className="cocina-icon-note"
                style={{ minWidth: "16px", marginTop: "2px" }}
              />
              <div>
                <span className="fw-bold d-block mb-1">Nota de Cocina:</span>
                <span className="fst-italic" style={{ lineHeight: "1.2" }}>
                  {pedido.detalles_extras}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* ==================================================================== */}
      </div>

      {/* Footer */}
      <div className="card-footer d-flex bg-transparent border-top-0 pb-3 pt-0 align-items-center mt-2">
        <button
          className={`cocina-btn-imprimir ${
            esListo
              ? "cocina-btn-imprimir-listo"
              : esEnPreparacion
                ? "cocina-btn-imprimir-preparacion"
                : "cocina-btn-imprimir-espera"
          }`}
          title="Imprimir Ticket"
        >
          <PrinterIcon className="text-auto" size={18} />
        </button>

        <BotonAnimado
          className={` p-1 ms-auto cocina-btn-accion ${
            esListo
              ? "cocina-btn-accion-listo"
              : esEnPreparacion
                ? "cocina-btn-accion-preparacion"
                : "cocina-btn-accion-espera"
          }`}
          onClick={() => cambiarEstado()}
          loading={cargando}
          icon={
            pedido.estado === 0 ? (
              <CheckCheck className="text-auto" width="20px" height="20px" />
            ) : pedido.estado === 2 ? (
              <CheckCheck className="text-auto" width="20px" height="20px" />
            ) : (
              <RotateCcw className="text-auto" width="18px" height="18px" />
            )
          }
        >
          {pedido.estado === 0
            ? "Mover a preparar"
            : pedido.estado === 2
              ? "Marcar Listo"
              : "Reabrir"}
        </BotonAnimado>
      </div>
    </div>
  );
}

export function CocinaDespacho() {
  const queryClient = useQueryClient();
  const {
    data: pedidos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pedidosEstado"],
    queryFn: GetPedidosCocina,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const filtroOpciones = [
    { label: "Todos", value: "Todos" },
    { label: "Mesa", value: "mesa" },
    { label: "Llevar", value: "llevar" },
    { label: "Delivery", value: "web" },
  ];

  const pedidosFiltrados = useMemo(() => {
    if (filtroTipo === "Todos") return pedidos;
    return pedidos.filter((pedido) => pedido.tipo_pedido === filtroTipo);
  }, [pedidos, filtroTipo]);

  const pedidosEnEspera = pedidosFiltrados.filter(
    (pedido) => pedido.estado === 0,
  );
  const pedidosEnPreparacion = pedidosFiltrados.filter(
    (pedido) => pedido.estado === 2,
  );
  const pedidosListos = pedidosFiltrados.filter(
    (pedido) => pedido.estado === 1,
  );

  const filtroLabel =
    filtroTipo === "Todos"
      ? "Todos"
      : filtroTipo === "web"
        ? "Delivery"
        : filtroTipo.charAt(0).toUpperCase() + filtroTipo.slice(1);

  useEffect(() => {
    const pusher = new Pusher("3a474e6680223eaa4e3f", {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe("pedidosEstado");
    channel.bind("pedidosEstado.creado", () => {
      queryClient.invalidateQueries(["pedidosEstado"]);
    });

    return () => {
      channel.unbind_all();
      pusher.disconnect();
    };
  }, [queryClient]);

  return (
    <div className="row g-3 h-100">
      <CondicionCarga isLoading={isLoading} isError={isError}>
        <div className="overflow-hidden  justify-content-start cocina-card-body">
          <div className="cocina-filter-bar mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex flex-wrap gap-2">
              {filtroOpciones.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`cocina-filter-btn ${filtroTipo === option.value ? "cocina-filter-btn-active" : ""}`}
                  onClick={() => setFiltroTipo(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <span className="text-muted small">Filtro: {filtroLabel}</span>
          </div>
          {pedidosFiltrados.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted opacity-50">
              <CheckCheck size={50} className="mb-3" />
              <h5>No hay pedidos</h5>
              <p>Intenta otro filtro o espera nuevos pedidos.</p>
            </div>
          ) : (
            <div className="cocina-columnas">
              <div className="cocina-columna bg-white rounded-4 border h-100">
                <div className="d-flex  border-bottom   p-3 justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-0">En espera</h6>
                    <small className="text-muted">Pedidos nuevos</small>
                  </div>
                  <span className="cocina-badge-warning">
                    {pedidosEnEspera.length}
                  </span>
                </div>
                <div className="cocina-col-body d-flex flex-column px-3">
                  {pedidosEnEspera.map((pedido, i) => (
                    <TarjetaPedido key={`espera-${i}`} pedido={pedido} />
                  ))}
                </div>
              </div>

              <div className="cocina-columna bg-white rounded-4 border h-100">
                <div className="d-flex border-bottom   p-3 justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-0">En preparación</h6>
                    <small className="text-muted">Cocinando ahora</small>
                  </div>
                  <span className="cocina-badge-preparacion">
                    {pedidosEnPreparacion.length}
                  </span>
                </div>
                <div className="cocina-col-body d-flex flex-column px-3">
                  {pedidosEnPreparacion.map((pedido, i) => (
                    <TarjetaPedido key={`preparacion-${i}`} pedido={pedido} />
                  ))}
                </div>
              </div>

              <div className="cocina-columna bg-white rounded-4 border h-100">
                <div className="d-flex border-bottom   p-3 justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-0">Listo</h6>
                    <small className="text-muted">Para despacho</small>
                  </div>
                  <span className="cocina-badge-listo">
                    {pedidosListos.length}
                  </span>
                </div>
                <div className="cocina-col-body d-flex flex-column px-3">
                  {pedidosListos.map((pedido, i) => (
                    <TarjetaPedido key={`listo-${i}`} pedido={pedido} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CondicionCarga>
    </div>
  );
}
