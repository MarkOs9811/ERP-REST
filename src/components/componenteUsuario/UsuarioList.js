import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { UsuarioEditar } from "./UsuarioEditar";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import axiosInstance from "../../api/AxiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetUsuarios } from "../../service/GetUsuarios";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import {
  Ban,
  CheckCircle2,
  Eye,
  Pencil,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import ModalRight from "../componentesReutilizables/ModalRight";
import { PerfilGeneralNomina } from "../componentePlanillas/PerfilGeneralNomina";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";

// LOS PROPS SON PARAMETROS QUE SE ESTA RECIEBIENDO EN ESTA FUNCTION COMO "SEARCH" Y "UPDATELIST"
export function UsuariosList({ search, updateList }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [filteredUsuarios, setFilteredUsuarios] = useState([]);

  // PARA VER DETALLES DEL EMPLEADO
  const [modalPerfilEmpleado, setModalPerfilEmpleado] = useState(false);
  const [idEmpleado, setIdEmpleado] = useState(null);
  // =========================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmTrue, setShowConfirmTrue] = useState(false);

  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [nombreToDelete, setNombreToDelete] = useState(null);

  const [userIdActive, setUserIdActive] = useState(null);
  const [nombreToActive, setNombreToActive] = useState(null);

  // React Query para obtener usuarios
  const {
    data: usuariosData = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["usuarios", updateList],
    queryFn: GetUsuarios,
    retry: 1,
  });

  // funcion efect para filtrar datos de la tabla
  useEffect(() => {
    const result = usuariosData.filter((usuario) => {
      const { email, empleado } = usuario;
      const persona = empleado?.persona || {};
      const { nombre, apellidos, telefono, documento_identidad } = persona;
      const searchLower = search.toLowerCase();
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
  }, [search, usuariosData]);

  const handleOpenModalEdit = (data) => {
    setUsuarioEdit(data);
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUsuarioEdit([]);
  };

  const handleUsuarioUpdated = () => {
    refetch();
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
        refetch();
        return true;
      } else {
        toast.error("Error al cambiar el estado del usuario");
        refetch();
        return false; // Error al cambiar el estado
      }
    } catch (error) {
      toast.error("Error en la conexión");
      refetch();
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
        refetch();
        return true; // Usuario eliminado con éxito
      } else {
        toast.error("Error al cambiar el estado del usuario");
        refetch();
        return false; // Error al cambiar el estado
      }
    } catch (error) {
      toast.error("Error en la conexión");
      refetch();
      return false; // Error en la conexión
    }
  };

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (isError) return <p>Error al cargar usuarios.</p>;

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
      center: true,
    },
    {
      name: "Perfil",
      selector: (row) => row.fotoPerfil,
      center: true,
      width: "80px",
      cell: (row) => (
        <div style={{ padding: "5px" }}>
          {row.fotoPerfil ? (
            <img
              src={`${BASE_URL}/storage/${row.fotoPerfil}`}
              alt="avatar"
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #eee", // Un toque sutil
              }}
            />
          ) : (
            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                backgroundColor: "#e9ecef",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: "#6c757d",
              }}
            >
              N/A
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Colaborador",
      selector: (row) => row.empleado?.persona?.nombre,
      sortable: true,
      wrap: true,
      grow: 2, // Le damos más espacio a esta columna importante
      cell: (row) => (
        <div className="d-flex flex-column justify-content-center py-2">
          <div className="nombreUsuarioTabla fw-bold">
            {row.empleado?.persona?.nombre || "Sin Nombre"}{" "}
            {row.empleado?.persona?.apellidos || ""}
          </div>
          {/* Usamos el email aquí, así ahorramos una columna entera */}
          {row.email && (
            <small className="badge-user mt-1 text-muted">{row.email}</small>
          )}
        </div>
      ),
    },
    {
      name: "Datos Laborales",
      selector: (row) => row.empleado?.cargo?.nombre,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-column">
          <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
            {row.empleado?.cargo?.nombre
              ? row.empleado.cargo.nombre.charAt(0).toUpperCase() +
                row.empleado.cargo.nombre.slice(1).toLowerCase()
              : "Sin Cargo"}
          </span>
          <small className="text-muted">
            <i className="fas fa-map-marker-alt me-1"></i>
            {row.sede?.nombre || "Sin Sede"}
          </small>
        </div>
      ),
    },
    {
      name: "Documento / Contacto",
      selector: (row) => row.empleado?.persona?.documento_identidad,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-column">
          <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>
            DOC: {row.empleado?.persona?.documento_identidad || "---"}
          </span>
          <small className="text-muted">
            Tel: {row.empleado?.persona?.telefono || "---"}
          </small>
        </div>
      ),
    },
    {
      name: "Acceso y Estado",
      selector: (row) => row.auth_type,
      sortable: true,
      center: true,
      cell: (row) => {
        const authType = row.auth_type || "N/A";
        // Lógica: 1 es Activo, cualquier otra cosa es Inactivo
        const isActive = row.estado == 1;

        return (
          <div className="d-flex flex-column align-items-center justify-content-center">
            {/* 1. Tipo de Autenticación (Texto pequeño arriba) */}
            <div
              className="d-flex align-items-center gap-1 mb-1 text-secondary"
              style={{ fontSize: "0.75rem", fontWeight: "bold" }}
            >
              <ShieldCheck size={12} /> {/* Un toque visual extra opcional */}
              {authType.toUpperCase()}
            </div>

            {/* 2. Tu Badge Component Moderno */}
            <BadgeComponent
              label={isActive ? "Activo" : "INACTIVO"}
              // El componente detectará autom: ACTIVO->Verde, INACTIVO->Rojo

              icon={isActive ? <CheckCircle2 /> : <Ban />}
              // Pasamos iconos condicionales
            />
          </div>
        );
      },
    },
    {
      name: "Acciones",
      button: true, // Importante para que no se corte
      minWidth: "150px",
      cell: (row) => {
        const { estado } = row;
        return (
          <div className="d-flex justify-content-center w-100 gap-2">
            {estado == 1 ? (
              <>
                <button
                  className="btn-editar"
                  onClick={() => handleOpenModalEdit(row)}
                  title="Editar"
                >
                  <Pencil size={16} />{" "}
                  {/* Ajusté el tamaño para consistencia */}
                </button>
                <button
                  className="btn-principal"
                  onClick={() => {
                    setModalPerfilEmpleado(true);
                    setIdEmpleado(row.id);
                  }}
                  title="Ver Perfil Completo"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() =>
                    handleDeleteClick(row.id, row.empleado?.persona?.nombre)
                  }
                  title="Desactivar"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() =>
                  handleActivarClick(row.id, row.empleado?.persona?.nombre)
                }
                title="Reactivar usuario"
              >
                <FontAwesomeIcon icon={faPowerOff} /> Activar
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <TablasGenerales datos={filteredUsuarios} columnas={columns} />

      <ModalRight
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Editar usuario"}
        hideFooter={true}
        icono={<Pencil />}
      >
        {({ handleClose }) => (
          <UsuarioEditar
            handleCloseModal={handleClose}
            data={usuarioEdit}
            onUsuarioUpdated={handleUsuarioUpdated}
          />
        )}
      </ModalRight>

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
      <ModalRight
        isOpen={modalPerfilEmpleado}
        onClose={() => setModalPerfilEmpleado(false)}
        title="Perfil del empleado"
        width="70%"
      >
        <PerfilGeneralNomina idEmpleado={idEmpleado} />
      </ModalRight>
    </div>
  );
}
