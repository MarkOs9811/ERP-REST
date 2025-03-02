import React, { useEffect, useState } from "react";
import { UsuariosList } from "../components/componenteUsuario/UsuarioList";
import { UsuarioForm } from "../components/componenteUsuario/UsuarioForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUserCheck,
  faUsers,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import axiosInstance from "../api/AxiosInstance";

export function Usuarios() {
  const [showModal, setShowModal] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [search, setSearch] = useState("");

  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    usuariosAlmacen: 0,
  });
  useEffect(() => {
    const obtenerEstadisticas = async () => {
      try {
        const { data } = await axiosInstance.get("/usuarios/estadisticas");
        setEstadisticas(data);
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
      }
    };

    obtenerEstadisticas();
  }, []);

  // Función para abrir el modal
  const handleOpenModal = () => setShowModal(true);

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setUpdateList((prev) => !prev);
  };

  return (
    <div className="row g-3">
      {/* Tarjetas de estadísticas */}
      <div className="col-md-4">
        <div className="card shadow-sm text-center stats-card ">
          <div className="card-body">
            <FontAwesomeIcon icon={faUsers} className="icon mb-2" size="2x" />
            <h6 className="card-title mt-2">Total de Usuarios</h6>
            <p className="card-text mx-2">{estadisticas.totalUsuarios}</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card shadow-sm text-center stats-card">
          <div className="card-body">
            <FontAwesomeIcon
              icon={faUserCheck}
              className="icon mb-2"
              size="2x"
            />
            <h6 className="card-title mt-2">Usuarios Activos</h6>
            <p className="card-text mx-2">{estadisticas.usuariosActivos}</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card shadow-sm text-center stats-card">
          <div className="card-body">
            <FontAwesomeIcon
              icon={faWarehouse}
              className="icon mb-2"
              size="2x"
            />
            <h6 className="card-title mt-2">Cargo: Almacén</h6>
            <p className="card-text mx-2">{estadisticas.usuariosAlmacen}</p>
          </div>
        </div>
      </div>

      <div className="col-md-12 ">
        <div className="card border-0 shadow-sm">
          <div className="card-header border-bottom d-flex justify-content-between align-items-center">
            <div className="m-2">
              <h4 className="card-title mb-0 titulo-card-especial">
                Lista de Usuarios
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
          <div className="card-body cuerpo-tabla p-0">
            <UsuariosList search={search} updateList={updateList} />
          </div>
        </div>
      </div>

      {/* Modal para agregar usuario*/}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="modal-sin-borde"
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Pasa handleCloseModal como prop a UsuarioForm */}
          <UsuarioForm handleCloseModal={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
