import { AjustesBonificaciones } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesBonificaciones";
import { AjustesDeducciones } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesDeducciones";
import { AjustesGenerales } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesGenerales";
import { AjustesHorario } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesHorario";

export function AjustesPlanilla() {
  return (
    <div>
      <div className="row g-2">
        <div className="col-md-6 col-sm-12">
          <AjustesGenerales />
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="row g-2">
            <div className="col-md-12 col-sm-12">
              <AjustesBonificaciones />
            </div>
            <div className="col-md-12 col-sm-12">
              <AjustesDeducciones />
            </div>
            <div className="col-md-12 col-sm-12">
              <AjustesHorario />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
