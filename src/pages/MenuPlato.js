import { useState } from "react";
import { CategoriaList } from "../components/componentePlatos/CategoriaList";
import { PlatoList } from "../components/componentePlatos/PlatoList";
import { PlatoAdd } from "../components/componentePlatos/PlatoAdd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import { CombosList } from "../components/componentePlatos/CombosList";
import { useQueryClient } from "@tanstack/react-query";
import { GetReporteExcel } from "../service/accionesReutilizables/GetReporteExcel";
import { FileChartColumnIncreasing } from "lucide-react";
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
            <div className="card-header border-bottom d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Menú</h5>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="flex-grow-1 me-2">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-dark rounded-pill"
                    onClick={() => setShowModal(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nuevo Plato
                  </button>

                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => GetReporteExcel("/reportePlatosTodos")}
                    title="Descargar Reporte de Platos"
                  >
                    <FileChartColumnIncreasing />
                  </button>
                </div>
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
