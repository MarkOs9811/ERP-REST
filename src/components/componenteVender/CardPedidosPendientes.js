import {
  PrintOutline,
  PersonOutline,
  CallOutline,
  CheckmarkOutline,
  AlarmOutline,
  MegaphoneOutline,
} from "react-ionicons";

import ModalRight from "../../components/componentesReutilizables/ModalRight";

const PedidoCard = ({ pedido, onOpenModal }) => {
  // Definir clases y estilos basados en el estado
  const estadoClases = {
    3: {
      bgColor: "bg-light",
      estadoTexto: "Pagar en Caja",
      estadoClase: "bg-warning text-dark",
      icono: <AlarmOutline color="#ffc100" size={16} />,
      botones: (
        <div className="d-flex flex-column justify-content-end gap-2 p-0 me-2">
          <button
            className="btn btn-sm btn-light p-1 ms-auto"
            title="Notificar al cliente"
          >
            <MegaphoneOutline size={"auto"} />
          </button>
        </div>
      ),
    },
    4: {
      bgColor: "bg-light",
      estadoTexto: "En proceso",
      estadoClase: "bg-primary text-white",
      icono: <AlarmOutline color="#007bff" size={16} />,
      botones: (
        <div className="d-flex flex-column justify-content-end gap-2 p-0 me-2">
          <button className="btn btn-sm btn-light p-1 ms-auto">
            <PrintOutline size={14} />
          </button>
          <button
            className="btn btn-sm btn-light p-1 ms-auto"
            title="Notificar al cliente"
          >
            <MegaphoneOutline size={14} />
          </button>
        </div>
      ),
    },
    5: {
      bgColor: "bg-light",
      estadoTexto: "Pagado",
      estadoClase: "bg-success",
      icono: <CheckmarkOutline color="#28a745" size={16} />,
      botones: (
        <div className="d-flex flex-column justify-content-end gap-2 p-0 me-2">
          <button className="btn btn-sm btn-light border  p-1 ms-auto">
            <CheckmarkOutline size={14} />
          </button>
          <button className="btn btn-sm btn-light  p-1 ms-auto">
            <PrintOutline size={14} />
          </button>
          <button
            className="btn btn-sm btn-light  p-1 ms-auto"
            title="Notificar al cliente"
          >
            <MegaphoneOutline size={14} />
          </button>
        </div>
      ),
    },
  };

  const estadoActual = estadoClases[pedido.estado_pedido] || estadoClases[3];

  return (
    <div
      className={`mb-2 p-3 rounded position-relative shadow-sm ${estadoActual.bgColor}`}
      style={{
        borderLeft: `4px solid ${
          pedido.estado_pago === "pagado" ? "#28a745" : "#ffc100"
        }`,
      }}
    >
      <div className="row align-items-center">
        {/* Columna Izquierda */}
        <div className="col-md-7" onClick={onOpenModal}>
          <div className="fw-bold mb-1">{pedido.codigo_pedido}</div>
          <div className="text-muted small">
            <div className="d-flex align-items-center">
              <PersonOutline className="me-1" size={12} />
              {pedido.nombre_cliente || "Cliente"}
            </div>
            <div className="d-flex align-items-center">
              <CallOutline className="me-1" size={12} />
              {pedido.numero_cliente}
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div
          className="col-md-4 text-end d-flex flex-column"
          onClick={onOpenModal}
        >
          <span className="fw-bold ms-auto my-2">
            S/.{" "}
            {pedido?.detalles_pedido
              ?.reduce(
                (total, detalle) => total + parseFloat(detalle.precio),
                0
              )
              .toFixed(2)}
          </span>

          {/* Badge de Estado de Pago */}
          <span
            className={`badge ${
              pedido.estado_pago === "pagado"
                ? "bg-success text-white"
                : "bg-warning text-dark"
            }`}
            style={{ padding: "0.3rem 0.8rem" }}
          >
            {pedido.estado_pago === "pagado" ? "Pagado" : "Por Pagar"}
          </span>
        </div>
        <div className="col-md-1 p-0 m-0">{estadoActual.botones}</div>
      </div>
    </div>
  );
};

export default PedidoCard;
