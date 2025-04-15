import { useState } from "react";
import { SolicitudesLista } from "../../components/componenteAlmacen/SolicitudesLista";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export function Solicitudes() {
  const [showModal, setShowModal] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");

  // Función para abrir el modal
  const handleOpenModal = () => setShowModal(true);

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setUpdateList((prev) => !prev);
  };

  return (
    <div className="container-fluid w-100 h-100 p-0">
      <div className="card bg-transparent  my-0 flex-grow-1 h-100 d-flex flex-column p-0 m-0">
        <div
          className="card-body overflow-y-auto overflow-x-hidden p-0 pe-2"
          style={{ height: "calc(100vh - 480px)" }}
        >
          <div className="card shadow-sm">
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
                  <button className="btn ms-2" onClick={handleOpenModal}>
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <SolicitudesLista search={search} updateList={updateList} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
