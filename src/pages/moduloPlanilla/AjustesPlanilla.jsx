import { AjustesBonificaciones } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesBonificaciones";
import { AjustesDeducciones } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesDeducciones";
import { AjustesGenerales } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesGenerales";
import { AjustesHorario } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesHorario";
import { PeriodoNomina } from "../../components/componentePlanillas/componentesAjustesPlanilla/PeriodoNomina";

export function AjustesPlanilla() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-12 gap-3 d-flex flex-column col-sm-12">
          {/* <div className="md:col-span-12">
            <AjustesGenerales />
          </div> */}
          <div className="md:col-span-12">
            <PeriodoNomina />
          </div>
        </div>
        <div className="md:col-span-12 col-sm-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4 col-sm-4">
              <AjustesBonificaciones />
            </div>
            <div className="md:col-span-4 col-sm-4">
              <AjustesDeducciones />
            </div>
            <div className="md:col-span-4 col-sm-4">
              <AjustesHorario />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
