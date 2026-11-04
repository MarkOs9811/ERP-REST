import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { TicketPedidosWeb } from "../TiketsType/TicketPedidosWeb";
import ReactDOM from "react-dom";
import NotificacionBtn from "../../componentesReutilizables/componentesPedidosWeb/NotificacionBtn";
import {
  BadgeCheck,
  CalendarClock,
  CheckCheck,
  Megaphone,
  Printer,
  MapPin,
  ExternalLink,
  CookingPotIcon,
} from "lucide-react";
import { useProcesarPagoWeb } from "../../../hooks/VenderDeliveryHook/UseProcesarPagoWeb";
import { useRiderTracking } from "../../../hooks/useRiderTracking";
import { MapaRiderCliente } from "../../MapaRiderCliente";
import { Button } from "../../ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

export function ModalFooter({ selectedPedido }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [modalOpen, setModalOpen] = useState(false);
  const [datosVenta, setDatosVenta] = useState(null);
  const componentRef = useRef();
  // Llamamos al hook. Si esRider es false (admin), el hook devolverá null y no hará peticiones
  const ubicacionActualRider = useRiderTracking(
    selectedPedido.idDeliveryRider,
    30000,
  );
  const { procesarPago } = useProcesarPagoWeb();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => {
      setDatosVenta(null);
    },
  });

  const ImprimirPedidoWeb = () => {
    const datosParaImprimir = {
      codigo_pedido: selectedPedido.codigo_pedido,
      nombre_cliente: selectedPedido.nombre_cliente || "Cliente",
      numero_cliente: selectedPedido.numero_cliente,
      estado_pago: selectedPedido.estado_pago,
      productos: (selectedPedido.detalles_pedido || []).map((detalle) => ({
        nombre: detalle.plato?.nombre || "Producto",
        precio: detalle.precio || detalle.plato?.precio || 0,
        cantidad: detalle.cantidad || 1,
      })),
      total:
        selectedPedido.detalles_pedido?.reduce(
          (total, detalle) => total + parseFloat(detalle.precio),
          0,
        ) || 0,
      fecha: selectedPedido.fecha || new Date().toLocaleDateString(),
    };
    setDatosVenta(datosParaImprimir);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const handleRealizarPago = () => {
    procesarPago(selectedPedido);
  };

  const urlMapa = ubicacionActualRider
    ? `https://maps.google.com/maps?saddr=${ubicacionActualRider.latitud},${ubicacionActualRider.longitud}&daddr=${selectedPedido.latitud},${selectedPedido.longitud}&hl=es&output=embed`
    : `https://maps.google.com/maps?q=${selectedPedido.latitud},${selectedPedido.longitud}&hl=es&z=16&output=embed`;

  const tieneUbicacion = selectedPedido?.latitud && selectedPedido?.longitud;

  // Variable rápida para saber si está pagado
  const estaPagado = selectedPedido.estado_pago === "pagado";

  return (
    <>
      <CardFooter className="flex justify-between items-center flex-wrap gap-2">
        {/* --- ESTADO DEL PEDIDO --- */}
        <div
          className="rounded-full text-xs font-semibold transition-colors p-2 flex items-center"
          style={{
            backgroundColor:
              selectedPedido.estado_pedido === 3
                ? "#FFA500"
                : selectedPedido.estado_pedido === 4
                  ? "#00A8E4"
                  : selectedPedido.estado_pedido === 5
                    ? "#28A745"
                    : "#6C757D",
            color: selectedPedido.estado_pedido === 3 ? "black" : "white",
          }}
        >
          {selectedPedido.estado_pedido === 3 && <CalendarClock size={16} />}
          {selectedPedido.estado_pedido === 4 && <CookingPotIcon size={16} />}
          {selectedPedido.estado_pedido === 5 && <BadgeCheck size={16} />}

          <span className="ms-2">
            {selectedPedido.estado_pedido === 3 && "Pendiente"}
            {selectedPedido.estado_pedido === 4 && "En Proceso"}
            {selectedPedido.estado_pedido === 5 && "Listo para recoger"}
          </span>
        </div>

        {/* --- BOTONES DE ACCIÓN --- */}
        <div className="flex gap-2 items-center">
          {/* Modal del Comprobante (Imagen) */}
          <div className="comprobante-container">
            {modalOpen &&
              ReactDOM.createPortal(
                <div
                  className="modal-overlay"
                  onClick={() => setModalOpen(false)}
                >
                  <div
                    className="rounded-xl bg-background p-3 shadow-xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <img
                      src={`${BASE_URL}/storage/${selectedPedido.fotoComprobante}`}
                      alt="Comprobante en grande"
                      width={350}
                      className="comprobante-grande mx-auto"
                    />
                  </div>
                </div>,
                document.body,
              )}
          </div>

          {/* ESTADO 3: PENDIENTE */}
          {selectedPedido.estado_pedido === 3 && (
            <Button
              className="btn-principal p-1"
              title="Notificar al cliente"
              variant="default"
            >
              <Megaphone />
            </Button>
          )}

          {/* ESTADO 4: EN PROCESO */}
          {selectedPedido.estado_pedido === 4 && (
            <>
              {!estaPagado && (
                <>
                  <Button
                    className="btn-principal p-1"
                    onClick={ImprimirPedidoWeb}
                    type="button"
                    title="Imprimir Ticket"
                    variant="default"
                  >
                    <Printer />
                  </Button>
                  <div style={{ display: "none" }}>
                    <TicketPedidosWeb
                      ref={componentRef}
                      dataActual={datosVenta}
                    />
                  </div>
                </>
              )}
              <NotificacionBtn pedido={selectedPedido} />
            </>
          )}

          {/* ESTADO 5: LISTO PARA RECOGER */}
          {selectedPedido.estado_pedido === 5 && (
            <>
              {!estaPagado && (
                <>
                  <Button
                    type="button"
                    className="btn-principal p-1"
                    onClick={handleRealizarPago}
                    title="Procesar Pago"
                    variant="default"
                  >
                    <CheckCheck /> Pagar
                  </Button>
                  <Button
                    className="btn-principal p-1"
                    onClick={ImprimirPedidoWeb}
                    type="button"
                    title="Imprimir Ticket"
                    variant="default"
                  >
                    <Printer />
                  </Button>
                  <div style={{ display: "none" }}>
                    <TicketPedidosWeb
                      ref={componentRef}
                      dataActual={datosVenta}
                    />
                  </div>
                </>
              )}
              <NotificacionBtn pedido={selectedPedido} />
            </>
          )}
        </div>
      </CardFooter>

      {/* ======================================================= */}
      {/* 🗺️ SECCIÓN DEL MAPA (CON URLS CORREGIDAS) 🗺️ */}
      {/* ======================================================= */}
      {tieneUbicacion ? (
        <Card className="m-2 overflow-hidden border-0 shadow-sm">
          {/* Encabezado del mapa (Se mantiene igual) */}
          <CardHeader className="bg-muted py-2 flex justify-between items-center">
            <span className="font-bold text-muted-foreground flex items-center gap-2">
              <MapPin size={16} /> Ubicación de Entrega
            </span>
            <small className="text-muted-foreground">
              Lat: {parseFloat(selectedPedido.latitud).toFixed(4)}, Lon:{" "}
              {parseFloat(selectedPedido.longitud).toFixed(4)}
            </small>
          </CardHeader>

          <div className="relative">
            {/* 🚀 AQUÍ REEMPLAZAMOS EL IFRAME POR NUESTRO NUEVO COMPONENTE 🚀 */}
            <MapaRiderCliente
              latCliente={selectedPedido.latitud}
              lngCliente={selectedPedido.longitud}
              latRider={ubicacionActualRider?.latitud || null}
              lngRider={ubicacionActualRider?.longitud || null}
            />

            {/* Botón flotante para abrir en app externa (Se mantiene igual) */}
            <div className="absolute bottom-0 right-0 p-2">
              <a
                href={
                  ubicacionActualRider
                    ? `https://www.google.com/maps/dir/?api=1&origin=${ubicacionActualRider.latitud},${ubicacionActualRider.longitud}&destination=${selectedPedido.latitud},${selectedPedido.longitud}`
                    : `https://www.google.com/maps/search/?api=1&query=${selectedPedido.latitud},${selectedPedido.longitud}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs shadow"
                style={{ fontSize: "0.8rem" }}
              >
                <ExternalLink className="me-1" size={14} /> Abrir en Maps
              </a>
            </div>
          </div>
        </Card>
      ) : (
        // Si es delivery pero no mandó ubicación (o es recojo en tienda)
        selectedPedido.tipo_entrega === "delivery" && (
          <div className="relative w-full rounded-lg px-4 py-3 text-sm border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 m-2 flex items-center gap-2 border-0">
            <MapPin size={16} />
            <small>
              Este pedido es delivery pero no tiene ubicación registrada.
            </small>
          </div>
        )
      )}
    </>
  );
}
