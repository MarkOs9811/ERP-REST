import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faHome, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { UsuarioEditar } from "./UsuarioEditar";
import { Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import axiosInstance from "../../api/AxiosInstance";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";

// LOS PROPS SON PARAMETROS QUE SE ESTA RECIEBIENDO EN ESTA FUNCTION COMO "SEARCH" Y "UPDATELIST"
export function UsuariosList({ search, updateList }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmTrue, setShowConfirmTrue] = useState(false);

  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [nombreToDelete, setNombreToDelete] = useState(null);

  const [userIdActive, setUserIdActive] = useState(null);
  const [nombreToActive, setNombreToActive] = useState(null);
  // Define los colores y estilos condicionales
  const rowColors = ["#1dae79", "#d34242", "#4c7d9a", "#ff9800"]; // Colores alternados
  const conditionalRowStyles = [
    {
      when: (row) => row,
      style: (row) => {
        const index = row.id % rowColors.length; // Alterna colores según el ID
        return {
          borderLeftColor: rowColors[index],
        };
      },
    },
  ];
  // Función para obtener usuarios de la API
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/usuarios");
      if (response.data) {
        setUsuarios(response.data.data);
        setFilteredUsuarios(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Hubo un error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Llamar a fetchUsuarios al cargar el componente o al actualizar updateList
  useEffect(() => {
    fetchUsuarios();
  }, [updateList]);

  // funcion efect para filtrar datos de la tabla
  useEffect(() => {
    const result = usuarios.filter((usuario) => {
      const { email, empleado } = usuario;
      const persona = empleado?.persona || {}; // Evita errores si empleado o persona no están definidos
      const { nombre, apellidos, telefono, documento_identidad } = persona;

      // Convierte el texto de búsqueda a minúsculas para comparación insensible a mayúsculas
      const searchLower = search.toLowerCase();

      // Filtra los usuarios basándose en los campos relevantes
      return (
        (email && email.toLowerCase().includes(searchLower)) ||
        (nombre && nombre.toLowerCase().includes(searchLower)) ||
        (apellidos && apellidos.toLowerCase().includes(searchLower)) ||
        (telefono && String(telefono).toLowerCase().includes(searchLower)) ||
        (documento_identidad &&
          String(documento_identidad).toLowerCase().includes(searchLower))
      );
    });

    setFilteredUsuarios(result);
  }, [search, usuarios]);

  const handleOpenModalEdit = (id) => {
    setIdUsuario(id);
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIdUsuario(null);
  };

  const handleUsuarioUpdated = () => {
    fetchUsuarios();
  };
  // para abrir el modal de pregunta
  const handleDeleteClick = (userId, nombre) => {
    setShowConfirm(true);
    setUserIdToDelete(userId);
    setNombreToDelete(nombre);
  };

  const handleActivarClick = (userId, nombre) => {
    setShowConfirmTrue(true);
    setUserIdActive(userId);
    setNombreToActive(nombre);
  };

  const handleCloseModalQuestionEliminar = () => {
    setShowConfirm(false);
    setUserIdToDelete(null);
    setNombreToDelete(null);
  };

  const handleCloseModalQuestionActivar = () => {
    setShowConfirmTrue(false);
    setUserIdActive(null);
    setNombreToActive(null);
  };

  // Handle para eliminar un usuario
  const handleEliminar = async (userId) => {
    try {
      // Realiza la solicitud POST para cambiar el estado del usuario
      const response = await axiosInstance.post(`/usuarios/eliminar/${userId}`);

      if (response.data.success) {
        toast.success("Usuario eliminado correctamente");
        fetchUsuarios();
        return true;
      } else {
        toast.error("Error al cambiar el estado del usuario");
        fetchUsuarios();
        return false; // Error al cambiar el estado
      }
    } catch (error) {
      toast.error("Error en la conexión");
      fetchUsuarios();
      return false; // Error en la conexión
    }
  };

  // Handle para ACTIVAR un usuario
  const handleActivarUser = async (userId) => {
    try {
      // Realiza la solicitud POST para cambiar el estado del usuario
      const response = await axiosInstance.post(`/usuarios/activar/${userId}`);

      if (response.data.success) {
        toast.success("Usuario activado correctamente");
        fetchUsuarios();
        return true; // Usuario eliminado con éxito
      } else {
        toast.error("Error al cambiar el estado del usuario");
        fetchUsuarios();
        return false; // Error al cambiar el estado
      }
    } catch (error) {
      toast.error("Error en la conexión");
      fetchUsuarios();
      return false; // Error en la conexión
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Foto",
      selector: (row) => row.fotoPerfil || "No disponible",
      sortable: true,
      wrap: true,
      center: true,
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          {row.fotoPerfil ? (
            <img
              src={`${BASE_URL}/storage/${row.fotoPerfil}`} // Aquí colocas la URL completa a la imagen (puede ser en 'public')
              alt="Foto de perfil"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }} // Ajusta el tamaño y el estilo
            />
          ) : (
            <span>No disponible</span> // Si no hay foto, muestra este texto
          )}
        </div>
      ),
    },
    {
      name: "Usuario",
      selector: (row) => row.email || "No disponible",
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Nombre y Apellidos",
      selector: (row) => (
        <div>
          <div className="nombreUsuarioTabla mt-2">
            {row.empleado?.persona?.nombre || "N/A"}{" "}
            {row.empleado?.persona?.apellidos || "N/A"}
          </div>
          {row.empleado?.persona?.correo && (
            <small className="badge-user mb-2">
              {row.empleado.persona.correo}
            </small>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Fecha Nacimiento",
      selector: (row) => (
        <div>
          <div className="mt-2">
            {row.empleado?.persona?.fecha_nacimiento || "N/A"}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Telefono",
      selector: (row) => row.empleado?.persona?.telefono || "No disponible",
      sortable: true,
      wrap: true,
    },
    {
      name: "DOC. Identidad",
      selector: (row) =>
        row.empleado?.persona.documento_identidad || "Documento no disponible",
      sortable: true,
      wrap: true,
    },
    {
      name: "Cargo",
      selector: (row) => {
        const cargo = row.empleado?.cargo?.nombre || "Cargo no disponible";
        return cargo === "Cargo no disponible"
          ? cargo
          : cargo.charAt(0).toUpperCase() + cargo.slice(1).toLowerCase();
      },
      sortable: true,
      wrap: true,
    },

    {
      name: "Acciones",
      cell: (row) => {
        const { estado } = row;

        return (
          <div className="d-flex justify-content-around">
            {estado === 1 ? (
              <>
                <button
                  className=" btn-editar me-2"
                  onClick={() => handleOpenModalEdit(row.id)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() =>
                    handleDeleteClick(row.id, row.empleado?.persona?.nombre)
                  }
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-success"
                onClick={() =>
                  handleActivarClick(row.id, row.empleado?.persona?.nombre)
                }
              >
                <FontAwesomeIcon icon={faPowerOff} />
              </button>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
    },
  ];

  return (
    <div>
      <DataTable
        className="tablaGeneral"
        columns={columns}
        data={filteredUsuarios}
        pagination
        responsive
        dense
        fixedHeader
        customStyles={customDataTableStyles}
        fixedHeaderScrollHeight="500px"
        striped={true}
        conditionalRowStyles={conditionalRowStyles}
        //selectableRows={true} //con este se activa un check  porc ada fila selccionble
        //selectableRowsHighlight={true} //resaltar la fila selecionada

        // onRowClicked={(row) => console.log(row)} para ejecutar cuandos e hace click en cada fila
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Todos",
        }}
      />

      {/* // modal para editar un usuario */}
      <Modal show={isModalOpen} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Pasa handleCloseModal como prop a UsuarioForm */}
          <UsuarioEditar
            handleCloseModal={handleCloseModal}
            idUsuario={idUsuario}
            onUsuarioUpdated={handleUsuarioUpdated}
          />
        </Modal.Body>
      </Modal>

      {/* MODAL PARA ELIMINAR USUARIO */}
      <ModalAlertQuestion
        show={showConfirm}
        idEliminar={userIdToDelete}
        nombre={nombreToDelete}
        tipo={"usuario"}
        handleEliminar={handleEliminar}
        handleCloseModal={handleCloseModalQuestionEliminar}
      />
      <ModalAlertActivar
        show={showConfirmTrue}
        idActivar={userIdActive}
        nombre={nombreToActive}
        handleActivar={handleActivarUser}
        handleCloseModal={handleCloseModalQuestionActivar}
      />
    </div>
  );
}
