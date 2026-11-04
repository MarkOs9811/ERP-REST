import {
  Clock1,
  PencilIcon,
  Trash2Icon,
  UserRound,
  Users2,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "@/components/ui/card";

export function CardReservas({
  reserva,
  setModalDelete,
  irAFormulario = () => {},
}) {
  return (
    <Card
      key={reserva.id}
      className="w-full h-full"
      style={{ borderLeft: "4px solid #ef4444!important" }} // Un rojo/coral sutil que combina con tu UI
    >
      <div className="p-3 relative">
        {/* Botones de Acción */}
        <div className="absolute top-0 right-0 m-2 flex gap-1">
          <Button
            className="btn-editar btn-icon p-1 hover-dark"
            style={{ background: "transparent" }}
            title="Editar Reserva"
            onClick={() => irAFormulario(reserva)} // Mandamos el objeto para editar
            variant="secondary"
          >
            <PencilIcon size={15} />
          </Button>
          <Button
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
            variant="destructive"
          >
            <Trash2Icon size={15} />
          </Button>
        </div>

        <h6 className="m-0 font-bold flex items-center gap-2 mb-3 pe-5 text-foreground">
          <UserRound size={16} className="text-muted-foreground" />
          {reserva.nombre_cliente}
        </h6>

        <div className="flex flex-wrap gap-2 mb-2">
          <span className="rounded-full text-xs font-semibold transition-colors bg-muted text-foreground flex items-center gap-1 px-2 py-1">
            <Clock1 size={12} className="text-destructive" />
            {reserva.hora_reserva.substring(0, 5)}
          </span>
          <span className="rounded-full text-xs font-semibold transition-colors bg-muted text-foreground flex items-center gap-1 px-2 py-1">
            <UtensilsCrossed size={12} className="text-muted-foreground" />
            Mesa {reserva.mesa?.numero || reserva.idMesa}
          </span>
          <span className="rounded-full text-xs font-semibold transition-colors bg-muted text-foreground flex items-center gap-1 px-2 py-1">
            <Users2 size={12} className="text-muted-foreground" />
            {reserva.cantidad_personas} Pax
          </span>
        </div>

        {reserva.nota && (
          <div
            className="mt-3 p-2 rounded text-muted-foreground"
            style={{
              fontSize: "0.8rem",
              backgroundColor: "#f1f5f9",
            }}
          >
            <span className="italic">"{reserva.nota}"</span>
          </div>
        )}
      </div>
    </Card>
  );
}
