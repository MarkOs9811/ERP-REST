import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import { MesasList } from "../components/componenteVender/MesasList";

export function Vender() {
  return (
    <ContenedorPrincipal>
      <MesasList />
    </ContenedorPrincipal>
  );
}
