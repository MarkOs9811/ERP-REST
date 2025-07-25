import { useState } from "react";
import { ProveedorList } from "../components/componenteProveedor/ProveedorList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import { ProveedorAdd } from "../components/componenteProveedor/ProveedorAdd";
import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import { AddOutline } from "react-ionicons";

export function Proveedores() {
  const [search, setSearch] = useState("");
  const [updateList, setUpdateList] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setUpdateList((prev) => !prev);
  };

  const handleAddProveedor = () => setShowModal(true);

  return (
    <ContenedorPrincipal>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card shadow-sm ">
            <div className="card-header  border-bottom d-flex justify-content-between align-items-center">
              <div className="m-2">
                <h4 className="card-title mb-0 titulo-card-especial">
                  Proveedores
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
                    className="btn ms-3"
                    onClick={() => handleAddProveedor()}
                  >
                    <AddOutline color={"auto"} />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <ProveedorList search={search} updateList={updateList} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar usuario*/}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        className="modal-sin-borde"
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrar Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Pasa handleCloseModal como prop a UsuarioForm */}
          <ProveedorAdd handleCloseModal={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </ContenedorPrincipal>
  );
}
