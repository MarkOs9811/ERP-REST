import { useState } from "react";

import { FileText, Plus, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { CondicionCarga } from "../../components/componentesReutilizables/CondicionCarga";
import { CategoriaPlatos } from "../../components/componenteVender/tareasVender/CategoriaPlatos";
import { GetReporteExcel } from "../../service/accionesReutilizables/GetReporteExcel";
import { PlatoList } from "../../components/componentePlatos/PlatoList";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { PlatoAdd } from "../../components/componentePlatos/PlatoAdd";

export function Platos() {
  const [search, setSearch] = useState("");
  const [upDateList, setUpDateList] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const categoriaActual = useSelector(
    (state) => state.categoriaFiltroPlatos.estado,
  );

  return (
    <div className="row g-3 ">
      <div className="col-md-12 col-lg-12">
        <CondicionCarga isLoading={upDateList} isError={null}>
          <div className="card  h-100">
            <div className="card-header border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <h4 className="card-title mb-0 titulo-card-especial">
                  Panel de Menú
                </h4>
                <span className="badge-header ms-2">Platos</span>
              </div>
              <CategoriaPlatos />
              <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
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
                  <FileText size={20} />
                  Reporte
                </button>

                <button
                  type="button"
                  className="btn btn-dark px-3"
                  onClick={() => setShowModal(true)}
                >
                  <Plus size={20} />
                  Crear
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <PlatoList
                search={search}
                upDateList={upDateList}
                categoriaActual={categoriaActual}
              />
            </div>
          </div>
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
