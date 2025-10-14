import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { CalendarioEventos } from "../../components/componenteIncidencias/CalendarioEventos";

import "../../css/EstilosIncidenciasEventos.css";

export function Eventos() {
  return (
    <ContenedorPrincipal>
      <CalendarioEventos />
    </ContenedorPrincipal>
  );
}
