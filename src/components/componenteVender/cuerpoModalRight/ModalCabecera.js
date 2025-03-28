import { CallOutline, PersonOutline } from "react-ionicons";

export function ModalCabecera({ selectedPedido }) {
  return (
    <div
      className=" d-flex p-3 gap-2 m-0 rounded-0 border-bottom w-100"
      style={{
        borderLeft: `4px solid ${
          selectedPedido.estado_pago === "pagado" ? "#28a745" : "#ffc100"
        }`,
      }}
    >
      <div className="text-muted small">
        <div className="d-flex align-items-center">
          <PersonOutline className="me-1" size={12} />
          {selectedPedido.nombre_cliente || "Cliente"}
        </div>
        <div className="d-flex align-items-center">
          <CallOutline className="me-1" size={12} />
          {selectedPedido.numero_cliente}
        </div>
      </div>
      <div className="flex-column text-end ms-auto align-items-center">
        <p className="h3">{selectedPedido.codigo_pedido}</p>
        <span
          className={`badge w-auto ${
            selectedPedido.estado_pago === "pagado"
              ? "bg-success text-white"
              : "bg-warning text-dark"
          }`}
        >
          {selectedPedido.estado_pago === "pagado" ? "Pagado" : "Por Pagar"}
        </span>
      </div>
    </div>
  );
}
