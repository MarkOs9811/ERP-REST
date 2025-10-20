import { useEffect, useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faPowerOff, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import { ProveedorEdit } from "./ProveedorEdit";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { GetProveedores } from "../../service/GetProveedores";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CondicionCarga } from "../componentesReutilizables/CondicionCarga";

export function ProveedorList({ search, updateList }) {
  const [filterProveedores, setFilterProveedores] = useState([]);

  const queryClient = useQueryClient();

  // 🟩 1. Llamar al servicio con React Query
  const {
    data: proveedores = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["proveedores", updateList], // se vuelve a ejecutar cuando cambia updateList
    queryFn: GetProveedores,
    staleTime: 1000 * 60 * 5, // cache 5 min
    retry: 1,
  });

  // 🟦 2. Filtrar registros según búsqueda
  useEffect(() => {
    if (!proveedores) return;

    const searchLower = search?.toLowerCase() || "";
    const result = proveedores.filter((proveedor) => {
      const { nombre, numero_documento, telefono, direccion, email } =
        proveedor;

      return (
        (nombre && nombre.toLowerCase().includes(searchLower)) ||
        (numero_documento &&
          numero_documento.toLowerCase().includes(searchLower)) ||
        (telefono && telefono.toLowerCase().includes(searchLower)) ||
        (direccion && direccion.toLowerCase().includes(searchLower)) ||
        (email && email.toLowerCase().includes(searchLower))
      );
    });

    setFilterProveedores(result);
  }, [search, proveedores]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataProvee, setDataProvee] = useState(false);

  const handleOpenModalEdit = (data) => {
    setDataProvee(data);
    setIsModalOpen(true);
  };

  const handleCloseEditarProve = () => {
    setDataProvee(null);
    setIsModalOpen(false);
  };
  const handleProveedorUpdated = () => {
    queryClient.invalidateQueries(["proveedores"]);
  };

  // FUNCIONES PARA ELIMINAR Y ACTIVAR
  const [modalDelete, setModalDelete] = useState(false);
  const [showConfirmActivar, setShowConfirmActivar] = useState(false);

  const [idProveedor, setIdProveedor] = useState(null);
  const [nombreToDeleteProveedor, setNombreToDeleteProveedor] = useState(null);

  // funcion para eliminar un registro - modal
  const handleQuestionDelete = (id, nombre) => {
    setModalDelete(true);
    setIdProveedor(id);
    setNombreToDeleteProveedor(nombre);
  };

  const handleCloseModalQuestionEliminar = () => {
    setModalDelete(false);
    setIdProveedor(null);
    setNombreToDeleteProveedor(null);
  };

  // funcion para activar registro - modal
  const handleQuestionActivar = (id, nombre) => {
    setShowConfirmActivar(true);
    setIdProveedor(id);
    setNombreToDeleteProveedor(nombre);
  };

  const handleCloseModalActivar = () => {
    setShowConfirmActivar(false);
    setIdProveedor(null);
    setNombreToDeleteProveedor(null);
  };

  // Handle para eliminar un usuario
  const handleEliminar = async (id) => {
    try {
      // Realiza la solicitud POST para cambiar el estado del usuario
      const response = await axiosInstance.delete(
        `/proveedores/deleteProveedor/${id}`
      );

      if (response.data.success) {
        ToastAlert("success", response.data.message);
        queryClient.invalidateQueries(["proveedores"]);
        return true;
      } else {
        ToastAlert("error", response.data.message);
        queryClient.invalidateQueries(["proveedores"]);
        return false; // Error al cambiar el estado
      }
    } catch (error) {
      ToastAlert("error", "error de conexion");
      queryClient.invalidateQueries(["proveedores"]);
      return false; // Error en la conexión
    }
  };

  const handleActivar = async (id) => {
    try {
      // Realiza la solicitud POST para cambiar el estado del usuario
      const response = await axiosInstance.put(
        `/proveedores/activarProveedor/${id}`
      );

      if (response.data.success) {
        ToastAlert("success", response.data.message);
        queryClient.invalidateQueries(["proveedores"]);
        return true;
      } else {
        ToastAlert("error", response.data.message);
        queryClient.invalidateQueries(["proveedores"]);
        return false; // Error al cambiar el estado
      }
    } catch (error) {
      ToastAlert("error", "error de conexion");
      queryClient.invalidateQueries(["proveedores"]);
      return false; // Error en la conexión
    }
  };

  // Define columnas
  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Ruc",
      selector: (row) => row.numero_documento,
      sortable: true,
      wrap: true,
    },
    {
      name: "Telefono",
      selector: (row) => row.telefono,
      sortable: true,
      wrap: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: "Direccion",
      selector: (row) => {
        const direccion = row.direccion
          ? row.direccion
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())
          : "";
        return <small>{direccion}</small>;
      },
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => {
        const { estado } = row;
        return (
          <div className="d-flex justify-content-around py-2">
            {estado == 1 ? (
              <>
                <button
                  className="btn-editar me-2"
                  onClick={() => handleOpenModalEdit(row)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="btn-eliminar me-2"
                  onClick={() => handleQuestionDelete(row.id, row.nombre)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-success"
                onClick={() => handleQuestionActivar(row.id, row.nombre)}
              >
                <FontAwesomeIcon icon={faPowerOff} />
              </button>
            )}
          </div>
        );
      },
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <div>
      <CondicionCarga isLoading={isLoading} isError={isError}>
        <TablasGenerales datos={filterProveedores} columnas={columns} />
      </CondicionCarga>

      {/* // modal para editar un proveedor */}
      <Modal
        show={isModalOpen}
        onHide={handleCloseEditarProve}
        centered
        size="lg"
        className="modal-sin-borde"
      >
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Pasa handleCloseModal como prop a CATEGORIA */}
          <ProveedorEdit
            handleCloseModal={handleCloseEditarProve}
            dataProveedor={dataProvee}
            handleProveedorUpdated={handleProveedorUpdated}
          />
        </Modal.Body>
      </Modal>

      {/* MODAL PARA ELIMINAR */}
      <ModalAlertQuestion
        show={modalDelete}
        idEliminar={idProveedor}
        nombre={nombreToDeleteProveedor}
        tipo={"proveedor"}
        handleEliminar={handleEliminar}
        handleCloseModal={handleCloseModalQuestionEliminar}
      />
      <ModalAlertActivar
        show={showConfirmActivar}
        idActivar={idProveedor}
        nombre={nombreToDeleteProveedor}
        tipo={"proveedor"}
        handleActivar={handleActivar}
        handleCloseModal={handleCloseModalActivar}
      />
    </div>
  );
}
