import { useState } from "react";
import { SolicitudesLista } from "../../components/componenteAlmacen/SolicitudesLista";

import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { Plus, Search } from "lucide-react";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { FormAddSolicitudExterna } from "../../components/componenteAlmacen/componenteSolicitud/FormAddSolicitudExterna";

export function Solicitudes() {
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="card shadow-sm py-2">
        <div className="card-header  d-flex flex-column border-bottom-0 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <div className="d-flex flex-column">
            <h4 className="m-0">Panel de Solicitudes</h4>
            <div>
              <span className="text-muted small">
                Lista de solicitudes por parte del usuario en ventas
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center flex-wrap gap-2 mt-3 mt-md-0">
            <div className="header-search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar solicitud..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="btn btn-dark px-3"
              onClick={setShowModalAdd}
              title="Realiza una solicitud"
            >
              <Plus size={18} />
              Agregar
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <SolicitudesLista search={search} updateList={updateList} />
        </div>
      </div>

      <ModalRight
        isOpen={showModalAdd}
        onClose={() => setShowModalAdd(false)}
        hideFooter={true}
        title={"Agrega una nueva solicitud"}
        subtitulo={"Genera una nueva solicitud a un proveedor"}
        width="40%"
      >
        {({ handleClose }) => <FormAddSolicitudExterna onClose={handleClose} />}
      </ModalRight>
    </div>
  );
}
