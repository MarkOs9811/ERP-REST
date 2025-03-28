import {
  AlarmOutline,
  CheckmarkDoneCircleOutline,
  CheckmarkOutline,
  ColorFillOutline,
  HourglassOutline,
  MegaphoneOutline,
  PrintOutline,
} from "react-ionicons";

export function ModalFooter({ selectedPedido }) {
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
          <HourglassOutline color="#5F4100" size={16} />
        )}
        {selectedPedido.estado_pedido === 4 && (
          <ColorFillOutline color="#1D4468" size={16} />
        )}
        {selectedPedido.estado_pedido === 5 && (
          <CheckmarkDoneCircleOutline color="#0F3F09" size={16} />
        )}

        <span className="ms-2">
          {selectedPedido.estado_pedido === 3 && "Pendiente"}
          {selectedPedido.estado_pedido === 4 && "En Proceso"}
          {selectedPedido.estado_pedido === 5 && "Listo para recoger"}
        </span>
      </div>

      {/* Botones según el estado */}
      <div className="d-flex gap-2">
        {/* Estado 3: "Pagar en Caja" */}
        {selectedPedido.estado_pedido === 3 && (
          <button
            className="btn btn-sm btn-light p-1 ms-auto"
            title="Notificar al cliente"
          >
            <MegaphoneOutline size={14} />
          </button>
        )}

        {/* Estado 4: "En Proceso" */}
        {selectedPedido.estado_pedido === 4 && (
          <>
            <button className="btn btn-sm btn-light p-1 ms-auto">
              <PrintOutline size={14} />
            </button>
            <button
              className="btn btn-sm btn-light p-1 ms-auto"
              title="Notificar al cliente"
            >
              <MegaphoneOutline size={14} />
            </button>
          </>
        )}

        {/* Estado 5: "Pagado" */}
        {selectedPedido.estado_pedido === 5 && (
          <>
            <button className="btn btn-sm btn-light border p-1 ms-auto">
              <CheckmarkOutline size={14} />
            </button>
            <button className="btn btn-sm btn-light p-1 ms-auto">
              <PrintOutline size={14} />
            </button>
            <button
              className="btn btn-sm btn-light p-1 ms-auto"
              title="Notificar al cliente"
            >
              <MegaphoneOutline size={14} />
            </button>
          </>
        )}

        {/* Botón extra si el estado de pago es "pagado" */}
        {selectedPedido.estado_pago === "pagado" && (
          <button className="btn btn-sm btn-warning p-1 ms-auto">
            <CheckmarkOutline size={14} className="me-1" /> Confirmar
            Comprobante
          </button>
        )}
      </div>
    </div>
  );
}
