import {
  Clock1,
  PencilIcon,
  Trash2Icon,
  UserRound,
  Users2,
  UtensilsCrossed,
} from "lucide-react";

export function CardReservas({
  reserva,
  setModalDelete,
  irAFormulario = () => {},
}) {
  return (
    <div
      key={reserva.id}
      className="card w-100 h-100"
      style={{ borderLeft: "4px solid #ef4444!important" }} // Un rojo/coral sutil que combina con tu UI
    >
      <div className="p-3 position-relative">
        {/* Botones de Acción */}
        <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
          <button
            className="btn-editar btn-icon p-1 hover-dark"
            style={{ background: "transparent" }}
            title="Editar Reserva"
            onClick={() => irAFormulario(reserva)} // Mandamos el objeto para editar
          >
            <PencilIcon size={15} />
          </button>
          <button
            className="btn-eliminar btn-icon p-1"
            style={{ background: "transparent" }}
            title="Anular Reserva"
            onClick={() =>
              setModalDelete({
                show: true,
                id: reserva.id,
                nombre: reserva.nombre_cliente,
              })
            }
          >
            <Trash2Icon size={15} />
          </button>
        </div>

        <h6 className="m-0 fw-bold d-flex align-items-center gap-2 mb-3 pe-5 text-dark">
          <UserRound size={16} className="text-muted" />
          {reserva.nombre_cliente}
        </h6>

        <div className="d-flex flex-wrap gap-2 mb-2">
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 px-2 py-1">
            <Clock1 size={12} className="text-danger" />
            {reserva.hora_reserva.substring(0, 5)}
          </span>
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 px-2 py-1">
            <UtensilsCrossed size={12} className="text-muted" />
            Mesa {reserva.mesa?.numero || reserva.idMesa}
          </span>
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1 px-2 py-1">
            <Users2 size={12} className="text-muted" />
            {reserva.cantidad_personas} Pax
          </span>
        </div>

        {reserva.nota && (
          <div
            className="mt-3 p-2 rounded text-secondary"
            style={{
              fontSize: "0.8rem",
              backgroundColor: "#f1f5f9",
            }}
          >
            <span className="fst-italic">"{reserva.nota}"</span>
          </div>
        )}
      </div>
    </div>
  );
}
