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
          <div className="card p-3 shadow-sm">
            {/* Cabecera de Áreas (NUEVA) */}
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2 align-items-center">
                <div className="p-2 alert alert-primary rounded-lg mb-0">
                  <LayoutGrid className="text-primary" size={20} />
                </div>
                <div className="d-flex flex-column">
                  <h4 className="fw-bold m-0">Áreas</h4>
                  <small className="text-muted">
                    Gestiona los departamentos
                  </small>
                </div>
              </div>
              <BotonMotionGeneral
                text="Agregar Área"
                icon={<Plus size={18} />}
                onClick={handleOpenAreaModal}
              />
            </div>
            {/* Cuerpo de Áreas */}
            <div className="card-body">
              <Areas />
            </div>
          </div>
        </div>

        {/* --- CARGOS --- */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            {/* Cabecera de Cargos (NUEVA) */}
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2 align-items-center">
                <div className="p-2 alert alert-success rounded-lg mb-0">
                  <Briefcase className="text-success" size={20} />
                </div>
                <div className="d-flex flex-column">
                  <h4 className="fw-bold m-0">Cargos</h4>
                  <small className="text-muted">
                    Define los puestos de trabajo
                  </small>
                </div>
              </div>
              <BotonMotionGeneral
                text="Agregar Cargo"
                icon={<Plus size={18} />}
                onClick={handleOpenCargoModal}
              />
            </div>
            {/* Cuerpo de Cargos */}
            <div className="card-body">
              <Cargos />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
