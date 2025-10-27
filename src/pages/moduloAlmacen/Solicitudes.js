import { useState } from "react";
import { SolicitudesLista } from "../../components/componenteAlmacen/SolicitudesLista";

import { ContenedorPrincipal } from "../../components/componentesReutilizables/ContenedorPrincipal";
import { Plus } from "lucide-react";
import ModalRight from "../../components/componentesReutilizables/ModalRight";
import { FormAddSolicitudExterna } from "../../components/componenteAlmacen/componenteSolicitud/FormAddSolicitudExterna";

export function Solicitudes() {
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="card shadow-sm py-2">
        <div className="card-header border-bottom d-flex justify-content-between align-items-center">
          <div className="m-2">
            <h4 className="card-title mb-0 titulo-card-especial">
              Solicitudes
            </h4>
          </div>
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn ms-2 btn-outline-dark"
                onClick={setShowModalAdd}
                title="Realiza una solicitud"
              >
                <Plus className="color-auto" />
              </button>
            </div>
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
