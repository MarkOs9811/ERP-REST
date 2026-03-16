import { useState } from "react";
import { ProveedorList } from "../components/componenteProveedor/ProveedorList";

import { Modal } from "react-bootstrap";
import { ProveedorAdd } from "../components/componenteProveedor/ProveedorAdd";
import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import { FileText, Plus, Search } from "lucide-react";
import { GetReporteExcel } from "../service/accionesReutilizables/GetReporteExcel";
import { CondicionCarga } from "../components/componentesReutilizables/CondicionCarga";
import ModalRight from "../components/componentesReutilizables/ModalRight";

export function Proveedores() {
  const [search, setSearch] = useState("");
  const [updateList, setUpdateList] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddProveedor = () => setShowModal(true);

  return (
    <div>
      <div className="row g-3">
        <div className="col-md-12">
          <CondicionCarga isLoading={updateList} isError={null}>
            <div className="card shadow-sm border-0 mb-4 rounded-4">
              <div className="card-header border-bottom-0 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <h4 className="card-title mb-0 titulo-card-especial">
                    Panel de Proveedores
                  </h4>
                  <span className="badge-header">Activos</span>
                </div>

                <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-md-0">
                  <div className="header-search-container">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      placeholder="Buscar proveedor..."
                      className="form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="btn btn-outline-dark px-3"
                    onClick={() => GetReporteExcel("/reporteProveedores")}
                  >
                    <FileText size={18} />
                    Reporte
                  </button>

                  <button
                    className="btn btn-dark px-3"
                    onClick={() => handleAddProveedor()}
                  >
                    <Plus size={18} />
                    Agregar
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                <ProveedorList search={search} updateList={updateList} />
              </div>
            </div>
          </CondicionCarga>
        </div>
      </div>

      {/* Modal para agregar usuario*/}
      <ModalRight
        isOpen={showModal}
        onClose={handleCloseModal}
        hideFooter={true}
        title={"Agregar nuevo proveedor"}
      >
        {({ handleClose }) => <ProveedorAdd handleCloseModal={handleClose} />}
      </ModalRight>
    </div>
  );
}
