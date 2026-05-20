import { AjustesBonificaciones } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesBonificaciones";
import { AjustesDeducciones } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesDeducciones";
import { AjustesGenerales } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesGenerales";
import { AjustesHorario } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesHorario";
import { PeriodoNomina } from "../../components/componentePlanillas/componentesAjustesPlanilla/PeriodoNomina";

export function AjustesPlanilla() {
  return (
    <div>
      <div className="row g-3">
        <div className="col-md-12 gap-3 d-flex flex-column col-sm-12">
          {/* <div className="col-md-12">
            <AjustesGenerales />
          </div> */}
          <div className="col-md-12">
            <PeriodoNomina />
          </div>
        </div>
        <div className="col-md-12 col-sm-12">
          <div className="row g-3">
            <div className="col-md-4 col-sm-4">
              <AjustesBonificaciones />
            </div>
            <div className="col-md-4 col-sm-4">
              <AjustesDeducciones />
            </div>
            <div className="col-md-4 col-sm-4">
              <AjustesHorario />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
