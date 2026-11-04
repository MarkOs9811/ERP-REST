import { Phone, User } from "lucide-react";

export function ModalCabecera({ selectedPedido }) {
  return (
    <div
      className="flex p-3 gap-2 m-0 rounded-none border-b w-full"
      style={{
        borderLeft: `4px solid ${
          selectedPedido.estado_pago === "pagado" ? "#28a745" : "#ffc100"
        }`,
      }}
    >
      <div className="text-muted-foreground text-sm">
        <div className="flex items-center">
          <User className="me-1" size={12} color={"auto"} />
          {selectedPedido.nombre_cliente || "Cliente"}
        </div>
        <div className="flex items-center">
          <Phone className="me-1" size={12} color={"auto"} />
          {selectedPedido.numero_cliente}
        </div>
      </div>
      <div className="flex-col text-right ms-auto items-center">
        <p className="h3">{selectedPedido.codigo_pedido}</p>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors w-auto ${
            selectedPedido.estado_pago === "pagado"
              ? "bg-emerald-600 text-white"
              : "bg-amber-500 text-foreground"
          }`}
        >
          {selectedPedido.estado_pago === "pagado" ? "Pagado" : "Por Pagar"}
        </span>
      </div>
    </div>
  );
}
