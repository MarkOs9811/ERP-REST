import { Areas } from "../../components/componentesAreasCargos/Areas";
import { Cargos } from "../../components/componentesAreasCargos/Cargos";
import { Sedes } from "../../components/componentesAreasCargos/componentesCargo/Sedes";
import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";

export function AreasCargo() {
  return (
    <div>
      <div className="row g-3 ">
        <div className="col-md-12">
          <Sedes />
        </div>
        <div className="col-md-8">
          <Areas />
        </div>
        <div className="col-md-4">
          <Cargos />
        </div>
      </div>
    </div>
  );
}
