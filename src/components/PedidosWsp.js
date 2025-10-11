import { useQuery } from "@tanstack/react-query";
import { GetPedidosWsp } from "../service/GetPedidosWsp";
import "../css/EstilosPedidosWsp.css";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export function PedidosWsp() {
  const navigate = useNavigate(); // ✅ Mantenerlo en la raíz
  const {
    data: listPedidos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pedidosWsp"],
    queryFn: GetPedidosWsp,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
  });

  // Obtener la fecha actual (sin hora) en formato YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  const handleVerPedido = useCallback(
    (pedido) => {
      const pedidoString = encodeURIComponent(JSON.stringify(pedido));
      navigate(`/vender/mensajeriaPedido?pedido=${pedidoString}`);
    },
    [navigate]
  );

  return (
    <div className="card shadow-sm contenedor-pedidosWsp h-100">
      <div className="header-bandeja">
        <img src="/images/wsp.png" width={30} alt="WhatsApp" /> Pedidos WhatsApp
      </div>
      <div className="lista-pedidos">
        {isLoading ? (
          <p>Cargando pedidos de WhatsApp...</p>
        ) : isError ? (
          <p>Error: {error.message}</p>
        ) : listPedidos.length === 0 ? (
          <p className="no-pedidos">No hay pedidos disponibles.</p>
        ) : (
          listPedidos
            .slice()
            .reverse() // 🔥 Orden descendente (últimos pedidos arriba)
            .map((pedido) => {
              const fechaPedido = new Date(pedido.created_at);
              const fechaFormateada = fechaPedido.toLocaleString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });
              const horaFormateada = fechaPedido.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              // Comparar si la fecha del pedido es la misma que hoy
              const esHoy = fechaPedido.toISOString().split("T")[0] === today;

              return (
                <div
                  key={pedido.id}
                  className="pedido-item"
                  onClick={() => handleVerPedido(pedido)}
                >
                  <div className="pedido-info p-0">
                    <span className="cliente">{pedido.cliente}</span>
                  </div>
                  <span className="hora p-0">
                    <p className="pedido-mensaje p-0 m-0">{pedido.mensaje}</p>
                    {esHoy ? "Hoy" : fechaFormateada} {horaFormateada}
                  </span>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
