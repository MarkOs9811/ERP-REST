import ListReservas from "../../components/componentesVentas/reservasMesas/ListReservas";
import "../../css/estilosVentas/EstilosReservas.css";

export function ReservasMesas() {
  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <h4>Reservas de mesas</h4>
      </div>
      <div className="card-body p-0">
        <ListReservas />
      </div>
    </div>
  );
}
