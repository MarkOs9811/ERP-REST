import { useState } from "react";

import NotificacionBtn from "../../componentesReutilizables/componentesPedidosWeb/NotificacionBtn";
import {
  BadgeCheck,
  CalendarClock,
  CheckCheck,
  CookingPot,
  Megaphone,
  Printer,
  ReceiptText,
} from "lucide-react";

export function ModalFooter({ selectedPedido }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="card-footer d-flex justify-content-between align-items-center">
      {/* Estado del pedido */}
      <div
        className="badge p-2 "
        style={{
          backgroundColor:
            selectedPedido.estado_pedido === 3
              ? "#FFA500" // Naranja
              : selectedPedido.estado_pedido === 4
              ? "#00A8E4" // Azul Claro
              : selectedPedido.estado_pedido === 5
              ? "#28A745" // Verde
              : "#6C757D", // Gris para otros estados
          color: selectedPedido.estado_pedido === 3 ? "black" : "white",
        }}
      >
        {selectedPedido.estado_pedido === 3 && (
          <CalendarClock color="#5F4100" size={16} />
        )}
        {selectedPedido.estado_pedido === 4 && (
          <CookingPot color="#1D4468" size={16} />
        )}
        {selectedPedido.estado_pedido === 5 && (
          <BadgeCheck color="auto" size={16} />
        )}

        <span className="ms-2">
          {selectedPedido.estado_pedido === 3 && "Pendiente"}
          {selectedPedido.estado_pedido === 4 && "En Proceso"}
          {selectedPedido.estado_pedido === 5 && "Listo para recoger"}
        </span>
      </div>

      {/* Botones según el estado */}
      <div className="d-flex gap-2">
        <div className="comprobante-container">
          {/* Miniatura */}
          <button
            src={`${BASE_URL}/storage/${selectedPedido.fotoComprobante}`}
            alt="Comprobante"
            width={50}
            className="comprobante-thumbnail btn-sm ms-2 p-1 fw-bold px-2"
            onClick={() => setModalOpen(true)}
          >
            <ReceiptText color={"auto"} /> Ver Pago
          </button>

          {/* Modal */}
          {modalOpen && (
            <div className="modal-overlay" onClick={() => setModalOpen(false)}>
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
        {/* Estado 3: "Pagar en Caja" */}
        {selectedPedido.estado_pedido === 3 && (
          <button
            className="btn btn-sm btn-light p-1 ms-auto"
            title="Notificar al cliente"
          >
            <Megaphone size={14} color={"auto"} />
          </button>
        )}

        {/* Estado 4: "En Proceso" */}
        {selectedPedido.estado_pedido === 4 && (
          <>
            <button className="btn btn-sm btn-light p-1 ms-auto">
              <Printer size={14} />
            </button>
            <NotificacionBtn pedido={selectedPedido} color={"auto"} />
          </>
        )}

        {/* Estado 5: "Pagado" */}
        {selectedPedido.estado_pedido === 5 && (
          <>
            <button className="btn btn-sm btn-light border p-1 ms-auto">
              <CheckCheck size={14} color={"auto"} />
            </button>
            <button className="btn btn-sm btn-light p-1 ms-auto">
              <Printer size={14} color={"auto"} />
            </button>
            <NotificacionBtn pedido={selectedPedido} color={"auto"} />
          </>
        )}

        {/* Botón extra si el estado de pago es "pagado" */}
        {selectedPedido.estado_pago === "pagado" && (
          <button className="btn btn-sm btn-warning p-1 ms-auto">
            <CheckCheck size={14} className="me-1" color={"auto"} /> Confirmar
            Comprobante
          </button>
        )}
      </div>
    </div>
  );
}
