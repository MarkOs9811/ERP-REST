import { Building2, Plus, LayoutGrid, Briefcase } from "lucide-react"; // Importamos los nuevos íconos
import { Areas } from "../../components/componentesAreasCargos/Areas";
import { Cargos } from "../../components/componentesAreasCargos/Cargos";
import { Sedes } from "../../components/componentesAreasCargos/componetesSedes/Sedes";
import { BotonMotionGeneral } from "../../components/componentesReutilizables/BotonMotionGeneral";

export function AreasCargo() {
  // --- Handlers para los modales ---
  // Es una buena práctica tenerlos listos
  const handleOpenSedeModal = () => console.log("Abrir modal Sede");
  const handleOpenAreaModal = () => console.log("Abrir modal Area");
  const handleOpenCargoModal = () => console.log("Abrir modal Cargo");

  return (
    <div>
      <div className="row g-3 ">
        <div className="col-md-12">
          <Sedes />
        </div>

        {/* --- ÁREAS --- */}
        <div className="col-md-8">
          <Areas />
        </div>

        {/* --- CARGOS --- */}
        <div className="col-md-4">
          <Cargos />
        </div>
      </div>
    </div>
  );
}
