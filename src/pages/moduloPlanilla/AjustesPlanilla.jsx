import { AjustesBonificaciones } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesBonificaciones";
import { AjustesDeducciones } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesDeducciones";
import { AjustesGenerales } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesGenerales";
import { AjustesHorario } from "../../components/componentePlanillas/componentesAjustesPlanilla/AjustesHorario";
import { PeriodoNomina } from "../../components/componentePlanillas/componentesAjustesPlanilla/PeriodoNomina";

export function AjustesPlanilla() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-3">
        <div className="md:col-span-12 gap-3 flex flex-col col-span-full">
          {/* <div className="md:col-span-12">
            <AjustesGenerales />
          </div> */}
          <div className="col-span-full md:col-span-12">
            <PeriodoNomina />
          </div>
        </div>
        <div className="md:col-span-12 col-span-full">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-full md:col-span-4 sm:col-span-4">
              <AjustesBonificaciones />
            </div>
            <div className="col-span-full md:col-span-4 sm:col-span-4">
              <AjustesDeducciones />
            </div>
            <div className="col-span-full md:col-span-4 sm:col-span-4">
              <AjustesHorario />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
