import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPedidosCocina } from "../../service/accionesVender/GetPedidosCocina";

import { useEffect, useMemo, useState } from "react";

import BotonAnimado from "../../components/componentesReutilizables/BotonAnimado";
import Pusher from "pusher-js";
import "../../css/EstilosCocina.css";
import Masonry from "react-masonry-css";
import { CheckCheck, PrinterIcon, RotateCcw, AlertCircle } from "lucide-react"; // Importamos AlertCircle
import { PutData } from "../../service/CRUD/PutData";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { BadgeComponent } from "../../components/componentesReutilizables/BadgeComponent";

const estados = {
  0: { texto: "En proceso", variant: "warning" },
  1: { texto: "Listo", variant: "success" },
};

function TarjetaPedido({ pedido }) {
  const [cargando, setCargando] = useState(false);
  const queryClient = useQueryClient();

  const esListo = pedido.estado === 1;

  const cambiarEstado = async () => {
    setCargando(true);
    const nuevoEstado = esListo ? 0 : 1;
    const success = await PutData("pedidoCocina", pedido.id, {
      estado: nuevoEstado,
    });
    setCargando(false);
    if (success) {
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
        border: "1px solid #0f5a29ff",
        opacity: 0.85,
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
          esListo ? "bg-transparent border-bottom-0" : "bg-light"
        }`}
        style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
      >
        <span className="fw-bold text-secondary"># {pedido.id}</span>
        <span
          style={{ fontWeight: "bold", color: esListo ? "#15803d" : "#000" }}
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
              <span className="mx-2 text-muted">x</span>
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
                esListo
                  ? "bg-secondary bg-opacity-10 text-muted"
                  : "bg-warning bg-opacity-25 text-dark"
              }`}
              style={{
                fontSize: "0.85rem",
                border: esListo ? "1px solid #e5e7eb" : "1px solid #ffc107",
              }}
            >
              <AlertCircle
                size={16}
                className={esListo ? "text-secondary" : "text-dark"}
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
          className={`btn btn-sm ${
            esListo ? "btn-light text-muted" : "btn-outline-dark"
          }`}
          title="Imprimir Ticket"
        >
          <PrinterIcon className="text-auto" size={18} />
        </button>

        <BotonAnimado
          className={`h6 p-1 ms-auto ${
            esListo ? "btn btn-outline-dark border-1" : "btn-realizarPedido"
          }`}
          onClick={() => cambiarEstado()}
          loading={cargando}
          icon={
            esListo ? (
              <RotateCcw className="text-auto" width="18px" height="18px" />
            ) : (
              <CheckCheck className="text-auto" width="20px" height="20px" />
            )
          }
        >
          {esListo ? "Deshacer" : "Marcar Listo"}
        </BotonAnimado>
      </div>
    </div>
  );
}

export function CocinaDespacho() {
  const queryClient = useQueryClient();
  const breakpointColumnsObj = {
    default: 4,
    1400: 4,
    1100: 3,
    768: 2,
    576: 1,
  };
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
      <div className="col-lg-12 col-sm-12 h-100">
        <div className="card shadow-sm h-100 border-0 p-0">
          {" "}
          {/* Fondo transparente para mejor look en cocina */}
          <div className="card-header bg-white text-center p-3 m-0 border-bottom rounded-top shadow-sm mb-3">
            <h5 className="m-0 fw-bold d-flex align-items-center justify-content-center gap-2">
              Pedidos en Cocina / Despacho
            </h5>
          </div>
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div
              className="card-body overflow-auto p-2 justify-content-start"
              style={{ height: "calc(100vh - 180px)" }}
            >
              {pedidos.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted opacity-50">
                  <CheckCheck size={60} className="mb-3" />
                  <h4>Todo despachado</h4>
                  <p>Esperando nuevos pedidos...</p>
                </div>
              ) : (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {pedidos.map((pedido, i) => (
                    <TarjetaPedido key={i} pedido={pedido} />
                  ))}
                </Masonry>
              )}
            </div>
          </CondicionCarga>
        </div>
      </div>
    </div>
  );
}
