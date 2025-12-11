import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPedidosCocina } from "../../service/accionesVender/GetPedidosCocina";

import { useEffect, useMemo, useState } from "react";

import BotonAnimado from "../../components/componentesReutilizables/BotonAnimado";
import Pusher from "pusher-js";
import "../../css/EstilosCocina.css";
import Masonry from "react-masonry-css";
import { CheckCheck, PrinterIcon, RotateCcw } from "lucide-react";
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

    // Enviamos el nuevo estado en el cuerpo de la petición (data)
    // Asumo que tu backend recibe { estado: X } para actualizar
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
              <span>{plato.nombre}</span>
            </li>
          ))}
        </ul>
        {pedido.detalle_cliente && (
          <div
            className={`alert p-2 mx-2 ${
              esListo ? "alert-success border-0" : "alert-secondary text-muted"
            }`}
            style={{ fontSize: "0.85rem" }}
          >
            <strong>Nota:</strong> {pedido.detalle_cliente}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="card-footer d-flex bg-transparent border-top-0 pb-3 pt-0 align-items-center">
        <button
          className={`btn btn-sm ${
            esListo ? "btn-light text-muted" : "btn-outline-dark"
          }`}
          title="Imprimir Ticket"
        >
          <PrinterIcon className="text-auto" size={18} />
        </button>

        {/* BOTÓN DINÁMICO: CAMBIA SEGÚN EL ESTADO */}
        <BotonAnimado
          className={`h6 p-1 ms-auto ${
            esListo
              ? "btn btn-outline-dark border-1" // Estilo sutil para deshacer
              : "btn-realizarPedido" // Estilo principal
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
          {/* AQUÍ PASAMOS EL TEXTO (CHILDREN) */}
          {esListo ? "Deshacer" : "Marcar Listo"}
        </BotonAnimado>
      </div>
    </div>
  );
}

export function CocinaDespacho() {
  const queryClient = useQueryClient();
  const breakpointColumnsObj = {
    default: 5, // columnas en escritorio grande
    1200: 4,
    992: 3,
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
      {/* MESAS */}
      <div className="col-lg-12 col-sm-12 h-100">
        <div className="card shadow-sm h-100">
          <div className="card-header  text-center p-3 border-bottom">
            <p className="h5 "> Por Servir </p>
          </div>
          <CondicionCarga isLoading={isLoading} isError={isError}>
            <div
              className="card-body overflow-auto p-4 justify-content-start  contenedor-platos "
              style={{ height: "calc(100vh - 200px)" }}
            >
              {pedidos.length === 0 ? (
                <p className="text-muted text-center">No hay pedidos.</p>
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
