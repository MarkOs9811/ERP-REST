import React, { useEffect, useState } from "react";
import { UsuariosList } from "../components/componenteUsuario/UsuarioList";
import { UsuarioForm } from "../components/componenteUsuario/UsuarioForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck,
  faUsers,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import axiosInstance from "../api/AxiosInstance";
import { ContenedorPrincipal } from "../components/componentesReutilizables/ContenedorPrincipal";
import { FileChartColumnIncreasing, Plus, PlusIcon } from "lucide-react";
import { GetReporteExcel } from "../service/accionesReutilizables/GetReporteExcel";

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
  };

  return (
    <ContenedorPrincipal>
      <div className="row g-3">
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
                  <button
                    className="btn mx-2 btn-outline-dark"
                    onClick={handleOpenModal}
                  >
                    <PlusIcon className="color-auto" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => GetReporteExcel("/reporteUsuarios")}
                    title="Descargar Reporte de usuarios"
                  >
                    <FileChartColumnIncreasing className="text-auto" />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body cuerpo-tabla p-0">
              <UsuariosList search={search} updateList={updateList} />
            </div>
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
    </ContenedorPrincipal>
  );
}
