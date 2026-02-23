import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { TicketPedidosWeb } from "../TiketsType/TicketPedidosWeb";
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

export function ModalFooter({ selectedPedido }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [modalOpen, setModalOpen] = useState(false);
  const [datosVenta, setDatosVenta] = useState(null);
  const componentRef = useRef();

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

  // Validamos si tenemos coordenadas
  const tieneUbicacion = selectedPedido.latitud && selectedPedido.longitud;

  // Variable rápida para saber si está pagado
  const estaPagado = selectedPedido.estado_pago === "pagado";

  return (
    <>
      <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
        {/* --- ESTADO DEL PEDIDO --- */}
        <div
          className="badge p-2 d-flex align-items-center"
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
        <div className="d-flex gap-2 align-items-center">
          {/* Modal del Comprobante (Imagen) */}
          <div className="comprobante-container">
            {modalOpen && (
              <div
                className="modal-overlay"
                onClick={() => setModalOpen(false)}
              >
                <div className="modal-content">
                  <img
                    src={`${BASE_URL}/storage/${selectedPedido.fotoComprobante}`}
                    alt="Comprobante en grande"
                    width={350}
                    className="comprobante-grande mx-auto"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ESTADO 3: PENDIENTE */}
          {selectedPedido.estado_pedido === 3 && (
            <button className="btn-principal p-1" title="Notificar al cliente">
              <Megaphone />
            </button>
          )}

          {/* ESTADO 4: EN PROCESO */}
          {selectedPedido.estado_pedido === 4 && (
            <>
              {!estaPagado && (
                <>
                  <button
                    className="btn-principal p-1"
                    onClick={ImprimirPedidoWeb}
                    type="button"
                    title="Imprimir Ticket"
                  >
                    <Printer />
                  </button>
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
                  <button
                    type="button"
                    className="btn-principal p-1"
                    onClick={handleRealizarPago}
                    title="Procesar Pago"
                  >
                    <CheckCheck /> Pagar
                  </button>
                  <button
                    className="btn-principal p-1"
                    onClick={ImprimirPedidoWeb}
                    type="button"
                    title="Imprimir Ticket"
                  >
                    <Printer />
                  </button>
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

          {/* ESTADO PAGADO: Solo confirmación del comprobante */}
          {estaPagado && (
            <button className="btn btn-sm btn-warning p-1 text-dark fw-bold">
              <CheckCheck className="me-1" size={18} /> Confirmar Comprobante
            </button>
          )}
        </div>
      </div>

      {/* ======================================================= */}
      {/* 🗺️ SECCIÓN DEL MAPA (CON URLS CORREGIDAS) 🗺️ */}
      {/* ======================================================= */}
      {tieneUbicacion ? (
        <div className="card m-2 overflow-hidden border-0 shadow-sm">
          {/* Encabezado del mapa */}
          <div className="card-header bg-light py-2 d-flex justify-content-between align-items-center">
            <span className="fw-bold text-secondary d-flex align-items-center gap-2">
              <MapPin size={16} /> Ubicación de Entrega
            </span>
            <small className="text-muted">
              Lat: {parseFloat(selectedPedido.latitud).toFixed(4)}, Lon:{" "}
              {parseFloat(selectedPedido.longitud).toFixed(4)}
            </small>
          </div>

          <div className="position-relative">
            {/* IFRAME DE GOOGLE MAPS CORREGIDO */}
            <iframe
              title="Mapa de entrega"
              width="100%"
              height="250"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${selectedPedido.latitud},${selectedPedido.longitud}&hl=es&z=16&output=embed`}
            ></iframe>

            {/* Botón flotante para abrir en app externa (Corregido) */}
            <div className="position-absolute bottom-0 end-0 p-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedPedido.latitud},${selectedPedido.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm shadow"
                style={{ fontSize: "0.8rem" }}
              >
                <ExternalLink className="me-1" size={14} /> Abrir en Maps
              </a>
            </div>
          </div>
        </div>
      ) : (
        // Si es delivery pero no mandó ubicación (o es recojo en tienda)
        selectedPedido.tipo_entrega === "delivery" && (
          <div className="alert alert-warning m-2 d-flex align-items-center gap-2 border-0">
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
