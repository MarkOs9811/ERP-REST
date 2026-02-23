import NotificacionBtn from "../componentesReutilizables/componentesPedidosWeb/NotificacionBtn";
import { useProcesarPagoWeb } from "../../hooks/VenderDeliveryHook/UseProcesarPagoWeb";
import {
  AlarmClock,
  CheckCheck,
  CheckCheckIcon,
  Megaphone,
  Phone,
  Printer,
  PrinterIcon,
  UserRound,
} from "lucide-react";
import { useRef, useState } from "react";
import React from "react";
import { useReactToPrint } from "react-to-print";
import { TicketPedidosWeb } from "./TiketsType/TicketPedidosWeb";

const PedidoCard = ({ pedido, onOpenModal }) => {
  const { procesarPago } = useProcesarPagoWeb();

  const handleRealizarPago = (e) => {
    e.stopPropagation();
    procesarPago(pedido);
  };

  const componentRef = useRef();
  const [datosVenta, setDatosVenta] = useState(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => {
      setDatosVenta(null);
    },
  });

  const ImprimirPedidoWeb = () => {
    const datosParaImprimir = {
      codigo_pedido: pedido.codigo_pedido,
      nombre_cliente: pedido.nombre_cliente || "Cliente",
      numero_cliente: pedido.numero_cliente,
      estado_pago: pedido.estado_pago,
      productos: (pedido.detalles_pedido || []).map((detalle) => ({
        nombre: detalle.plato?.nombre || "Producto",
        precio: detalle.precio || detalle.plato?.precio || 0,
        cantidad: detalle.cantidad || 1,
      })),
      total:
        pedido.detalles_pedido?.reduce(
          (total, detalle) => total + parseFloat(detalle.precio),
          0,
        ) || 0,
      fecha: pedido.fecha || new Date().toLocaleDateString(),
    };
    setDatosVenta(datosParaImprimir);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const estadoClases = {
    3: {
      bgColor: "#fff3cd",
      icono: <AlarmClock color="#ffc100" size={16} />,
      botones: (
        <div className="d-flex flex-column align-items-center justify-content-center gap-2 w-100 h-100">
          <button className="btn-principal p-1" title="Notificar al cliente">
            <Megaphone size={"auto"} className="text-auto" />
          </button>
        </div>
      ),
    },
    4: {
      bgColor: "#ffe2e2",
      icono: <AlarmClock color="#007bff" size={16} />,
      botones: (
        <div className="d-flex flex-column align-items-center justify-content-center gap-2 w-100 h-100">
          <button
            className="btn-principal p-1"
            onClick={(e) => {
              e.stopPropagation(); // Buena práctica
              ImprimirPedidoWeb();
            }}
            type="button"
          >
            <Printer className="text-auto" />
          </button>
          <div style={{ display: "none" }}>
            <TicketPedidosWeb ref={componentRef} dataActual={datosVenta} />
          </div>
          <NotificacionBtn pedido={pedido} className="text-auto" />
        </div>
      ),
    },
    5: {
      bgColor: "#def8e4",
      icono: <CheckCheck color="#28a745" size={16} />,
      botones: (
        <div className="d-flex flex-column align-items-center justify-content-center gap-2 w-100 h-100">
          {/* LÓGICA APLICADA AQUÍ: Solo mostrar si NO está pagado */}
          {pedido.estado_pago !== "pagado" && (
            <>
              <button
                type="button"
                className="btn-principal p-1"
                onClick={handleRealizarPago}
                title="Procesar Pago"
              >
                <CheckCheckIcon className="text-auto" />
              </button>

              <button
                className="btn-principal p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  ImprimirPedidoWeb();
                }}
                title="Imprimir Ticket"
              >
                <PrinterIcon className="text-auto" />
              </button>
              <div style={{ display: "none" }}>
                <TicketPedidosWeb ref={componentRef} dataActual={datosVenta} />
              </div>
            </>
          )}

          {/* Este botón siempre se muestra */}
          <NotificacionBtn pedido={pedido} />
        </div>
      ),
    },
  };

  const estadoActual = estadoClases[pedido.estado_pedido] || estadoClases[3];

  return (
    <div
      className={`mb-2 rounded position-relative overflow-hidden shadow-sm`}
      style={{
        background: estadoActual.bgColor,
        borderLeft: `4px solid ${
          pedido.estado_pedido === 3
            ? "#ffc013"
            : pedido.estado_pedido === 4
              ? "#ce4e2e"
              : "#0fb30f"
        }`,
      }}
    >
      <div className="row g-0 w-100 m-0">
        {/* Columna Izquierda (Texto) */}
        <div
          className="col-7 col-md-7 p-3 d-flex flex-column justify-content-center"
          onClick={onOpenModal}
          style={{ cursor: "pointer" }}
        >
          <div className="fw-bold mb-1">{pedido.codigo_pedido}</div>
          <div className="text-muted small">
            <div className="d-flex align-items-center mb-1">
              <UserRound className="me-2" size={14} />
              <span className="text-truncate">
                {pedido.nombre_cliente || "Cliente"}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <Phone className="me-2" size={14} />
              <span>{pedido.numero_cliente}</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha (Precios) */}
        <div
          className="col-3 col-md-4 p-3 d-flex flex-column justify-content-center align-items-end"
          onClick={onOpenModal}
          style={{ cursor: "pointer" }}
        >
          <span className="fw-bold fs-5 mb-1">
            S/.{" "}
            {pedido?.detalles_pedido
              ?.reduce(
                (total, detalle) => total + parseFloat(detalle.precio),
                0,
              )
              .toFixed(2)}
          </span>

          <span
            className={`badge ${
              pedido.estado_pago === "pagado"
                ? "bg-success text-white"
                : "bg-warning text-dark"
            }`}
            style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
          >
            {pedido.estado_pago === "pagado" ? "Pagado" : "Por Pagar"}
          </span>
        </div>

        {/* Columna Lateral (Botones) */}
        <div
          className="col-2 col-md-1 py-2 d-flex align-items-center justify-content-center border-start"
          style={{ background: "#ffffff" }}
        >
          {estadoActual.botones}
        </div>
      </div>
    </div>
  );
};

export default PedidoCard;
