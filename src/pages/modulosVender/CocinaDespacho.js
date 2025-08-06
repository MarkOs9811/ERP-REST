import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { GetPedidosCocina } from "../../service/accionesVender/GetPedidosCocina";

import { useEffect, useMemo } from "react";

import BotonAnimado from "../../components/componentesReutilizables/BotonAnimado";
import Pusher from "pusher-js";
import "../../css/EstilosCocina.css";
import Masonry from "react-masonry-css";
import { Printer } from "lucide-react";

const estados = {
  0: { texto: "En proceso", clase: "badge bg-warning text-dark" },
  1: { texto: "Listo", clase: "badge bg-success" },
};

function TarjetaPedido({ pedido }) {
  const platos = useMemo(() => {
    try {
      return JSON.parse(pedido.detalle_platos);
    } catch {
      return [];
    }
  }, [pedido.detalle_platos]);

  // Etiqueta y color según tipo de pedido
  const tipoPedidoInfo = {
    mesa: {
      titulo: `MESA ${
        pedido?.preventa_mesa?.pre_ventas?.[0]?.mesa?.numero ?? "?"
      }`,
      borderTopColor: "#d8627e",
    },
    llevar: {
      titulo: "LLEVAR",
      borderTopColor: "#2a9d8f",
    },
    web: {
      titulo: "WSP",
      borderTopColor: "#0077b6",
    },
  };

  const { titulo, borderTopColor } = tipoPedidoInfo[pedido.tipo_pedido] ?? {
    titulo: "SIN TIPO",
    borderTopColor: "#999",
  };

  return (
    <div
      className="mb-3 shadow-sm"
      style={{
        borderTop: `4px solid ${borderTopColor}`,
        borderBottom: "1px solid #c4c4c4",
        borderLeft: "1px solid #c4c4c4",
        borderRight: "1px solid #c4c4c4",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
      }}
    >
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <span style={{ fontWeight: "bold" }}># {pedido.id}</span>
        <span style={{ fontWeight: "bold" }}>{titulo}</span>
        <span
          className={estados[pedido.estado]?.clase}
          style={{ fontSize: "0.8rem" }}
        >
          {estados[pedido.estado]?.texto}
        </span>
      </div>

      <div className="card-body p-0">
        <ul className="list-group list-group-flush mb-2">
          {platos.map((plato, idx) => (
            <li
              key={idx}
              className="list-group-item d-flex border-0 align-items-center"
              style={{ fontSize: "0.9rem" }}
            >
              <span>
                {plato.cantidad} <strong>×</strong>
              </span>
              <span className="mx-2">{plato.nombre}</span>
            </li>
          ))}
        </ul>

        {pedido.detalle_cliente && (
          <div
            className="alert alert-muted text-muted p-2"
            style={{ fontSize: "0.85rem" }}
          >
            <strong>Detalles:</strong> {pedido.detalle_cliente}
          </div>
        )}
      </div>
      <div className="card-footer d-flex">
        <button className="btn-sm btn btn-outline-dark">
          <Printer color={"auto"} />
        </button>
        <BotonAnimado className="btn-realizarPedido h6 p-1 ms-auto">
          Marcar Listo
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
      console.log("🎯 Nuevo pedido recibido. Actualizando lista...");
      queryClient.invalidateQueries(["pedidosEstado"]);
    });

    return () => {
      channel.unbind_all();
      pusher.disconnect();
    };
  }, [queryClient]);

  return (
    <ContenedorPrincipal>
      <div className="row g-3">
        {/* MESAS */}
        <div className="col-lg-12 col-sm-12">
          <div className="card shadow-sm">
            <div className="card-header  text-center p-3 border-bottom">
              <p className="h5 "> Por Servir </p>
            </div>
            <div
              className="card-body "
              style={{ maxHeight: "100vh", overflowY: "auto" }}
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
          </div>
        </div>
      </div>
    </ContenedorPrincipal>
  );
}
