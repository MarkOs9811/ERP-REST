import NotificacionBtn from "../componentesReutilizables/componentesPedidosWeb/NotificacionBtn";
import { useProcesarPagoWeb } from "../../hooks/VenderDeliveryHook/UseProcesarPagoWeb";
import {
  BikeIcon,
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
import ModalGenerales from "../componentesReutilizables/ModalGenerales";
import { FormAsignarRider } from "../componenteDelivery/FormAsignarider";
import { Button } from "../ui/button";

const CardPedidoDelivery = ({ pedido, onOpenModal }) => {
  const formRiderRef = useRef(null);
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
      color: "amber",
      botones: (
        <div className="flex flex-col items-center justify-center gap-1">
          <Button
            className="size-8 rounded-lg"
            size="icon"
            title="Notificar al cliente"
            variant="ghost"
          >
            <Megaphone className="size-4" />
          </Button>
        </div>
      ),
    },
    4: {
      color: "sky",
      botones: (
        <div className="flex flex-col items-center justify-center gap-1">
          <Button
            className="size-8 rounded-lg"
            size="icon"
            onClick={(e) => {
              e.stopPropagation(); // Buena práctica
              ImprimirPedidoWeb();
            }}
            type="button"
            title="Imprimir Ticket"
            variant="ghost"
          >
            <Printer size={16} />
          </Button>
          <div style={{ display: "none" }}>
            <TicketPedidosWeb ref={componentRef} dataActual={datosVenta} />
          </div>
          <NotificacionBtn pedido={pedido} />
        </div>
      ),
    },
    5: {
      color: "emerald",
      botones: (
        <div className="flex flex-col items-center justify-center gap-1">
          {/* LÓGICA APLICADA AQUÍ: Solo mostrar si NO está pagado */}
          {pedido.estado_pago !== "pagado" && (
            <>
              <Button
                type="button"
                className="size-8 rounded-lg"
                size="icon"
                onClick={handleRealizarPago}
                title="Procesar Pago"
                variant="ghost"
              >
                <CheckCheckIcon className="size-4" />
              </Button>

              <Button
                className="size-8 rounded-lg"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  ImprimirPedidoWeb();
                }}
                title="Imprimir Ticket"
                variant="ghost"
              >
                <PrinterIcon className="size-4" />
              </Button>
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
  const estiloEstado = {
    amber: {
      card: "border-amber-500/25 bg-amber-500/[0.04]",
      accent: "bg-amber-500",
      badge: "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300",
    },
    sky: {
      card: "border-sky-500/25 bg-sky-500/[0.04]",
      accent: "bg-sky-500",
      badge: "border-sky-500/25 bg-sky-500/10 text-sky-800 dark:text-sky-300",
    },
    emerald: {
      card: "border-emerald-500/25 bg-emerald-500/[0.04]",
      accent: "bg-emerald-500",
      badge: "border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
    },
  }[estadoActual.color];

  const [verModalRider, setVerModalRider] = useState(false);
  const [dataIdPedido, setDataIdPedido] = useState(null);

  return (
    <div
      className={`relative mb-0 overflow-hidden rounded-xl border ${estiloEstado.card}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${estiloEstado.accent}`}
      />
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto]">
        <div
          className="flex min-w-0 cursor-pointer flex-col justify-center gap-2 p-3 pl-4 transition-colors hover:bg-background/50"
          onClick={onOpenModal}
          role="button"
          tabIndex={0}
          aria-label={`Ver detalles del pedido ${pedido.codigo_pedido}`}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenModal?.();
            }
          }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold tracking-tight text-foreground">
              {pedido.codigo_pedido}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${estiloEstado.badge}`}
            >
              <span
                className={`size-1.5 rounded-full bg-current ${
                  pedido.estado_pedido === 3 ? "animate-pulse" : ""
                }`}
              />
              {pedido.estado_pedido === 3
                ? "Pendiente"
                : pedido.estado_pedido === 4
                  ? "En proceso"
                  : "Listo"}
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex min-w-0 items-center gap-1.5">
              <UserRound className="size-3.5 shrink-0" />
              <span className="truncate">
                {pedido.nombre_cliente || "Cliente"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="size-3.5 shrink-0" />
              <span className="truncate">{pedido.numero_cliente}</span>
            </div>
          </div>
        </div>

        <div className="flex min-w-24 flex-col items-end justify-center gap-1.5 p-3">
          <span className="text-base font-semibold tabular-nums text-foreground">
            S/.{" "}
            {pedido?.detalles_pedido
              ?.reduce(
                (total, detalle) => total + parseFloat(detalle.precio),
                0,
              )
              .toFixed(2)}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              pedido.estado_pago === "pagado"
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                : "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300"
            }`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {pedido.estado_pago === "pagado" ? "Pagado" : "Por Pagar"}
          </span>
          {pedido.estado_pedido === 5 && (
            <Button
              type="button"
              size="sm"
              variant={pedido.idDeliveryRider == null ? "default" : "outline"}
              className="mt-1 h-7 gap-1.5 rounded-lg px-2 text-[11px]"
              onClick={(event) => {
                event.stopPropagation();
                setVerModalRider(true);
                setDataIdPedido(pedido.id);
              }}
            >
              <BikeIcon className="size-3.5" />
              {pedido.idDeliveryRider == null
                ? "Asignar Rider"
                : "Asigando a Rider"}
            </Button>
          )}
        </div>

        <div className="col-start-3 row-start-1 row-span-2 flex items-center justify-center border-l border-border/70 bg-background/70 px-1.5">
          {estadoActual.botones}
        </div>
      </div>
      <ModalGenerales
        show={verModalRider}
        idProceso={dataIdPedido}
        handleAccion={() => formRiderRef.current?.submitForm()}
        handleCloseModal={() => setVerModalRider(false)}
        width="600px"
        textConfirm="Asignar"
      >
        <FormAsignarRider
          ref={formRiderRef}
          idPedido={dataIdPedido}
          dataPedido={pedido}
          handleCloseModal={() => setVerModalRider(false)}
        />
      </ModalGenerales>
    </div>
  );
};

export default CardPedidoDelivery;
