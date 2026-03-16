import { useState } from "react";
import { CategoriaList } from "../components/componentePlatos/CategoriaList";
import { PlatoList } from "../components/componentePlatos/PlatoList";
import { PlatoAdd } from "../components/componentePlatos/PlatoAdd";
import { CombosList } from "../components/componentePlatos/CombosList";
import { useQueryClient } from "@tanstack/react-query";
import { GetReporteExcel } from "../service/accionesReutilizables/GetReporteExcel";
import { FileText, Plus, Search } from "lucide-react";
import { CondicionCarga } from "../components/componentesReutilizables/CondicionCarga";
import ModalRight from "../components/componentesReutilizables/ModalRight";

export function MenuPlato() {
  const [search, setSearch] = useState("");
  const [upDateList, setUpDateList] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className="row g-3 ">
      <div className="col-md-12 col-lg-12">
        <CondicionCarga isLoading={upDateList} isError={null}>
          <div className="card shadow-sm h-100">
            <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <h4 className="card-title mb-0 titulo-card-especial">
                  Panel de Menú
                </h4>
                <span className="badge-header">Platos</span>
              </div>
              
              <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-md-0">
                <div className="header-search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar plato..."
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <button
                  type="button"
                  className="btn btn-outline-dark px-3"
                  onClick={() => GetReporteExcel("/reportePlatosTodos")}
                >
                  <FileText size={18} />
                  Reporte
                </button>

                <button
                  type="button"
                  className="btn btn-dark px-3"
                  onClick={() => setShowModal(true)}
                >
                  <Plus size={18} />
                  Nuevo Plato
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <PlatoList search={search} upDateList={upDateList} />
            </div>
          </div>
        </CondicionCarga>
      </div>
      <div className="col-sm-12 col-lg-8">
        <CondicionCarga isLoading={upDateList} isError={null}>
          <CombosList />
        </CondicionCarga>
      </div>
      <div className="col-sm-12 col-lg-4">
        <CondicionCarga isLoading={upDateList} isError={null}>
          <CategoriaList />
        </CondicionCarga>
      </div>

      <ModalRight
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Agregar Nuevo Plato"
        hideFooter={true}
      >
        {({ handleClose }) => <PlatoAdd handleCloseModal={handleClose} />}
      </ModalRight>
    </div>
  );
}
