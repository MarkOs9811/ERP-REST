import { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axiosInstance from "../../api/AxiosInstance";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";
import { Cargando } from "../componentesReutilizables/Cargando";
import { useEstadoAsyn } from "../../hooks/EstadoAsync";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from "@fortawesome/free-regular-svg-icons";
import { ModalDetallesSolicitud } from "./componenteSolicitud/ModalDetallesSolicitud";
import { Modal } from "react-bootstrap";

import { AlarmOutline, CheckmarkDoneOutline } from "react-ionicons";

export function SolicitudesLista({ search, updateList }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filterSolicitudes, setFilteredSolicitudes] = useState([]);

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

  const fetchSolicitudes = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/solicitudes");
      if (response.data.success) {
        setSolicitudes(response.data.data);
        setFilteredSolicitudes(response.data.data);
      } else {
        setHasError(true);
      }
    } catch (err) {
      setError("Hubo un error al cargar los datos");
    }
  });
  const { loading, error, execute } = useEstadoAsyn(fetchSolicitudes);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!hasError) {
      execute();
    }
  }, []); // Se detiene si ocurre un error

  // CODIGO PARA BUSCAR solicitudes
  useEffect(() => {
    const result = solicitudes.filter((solicitud) => {
      const {
        estado,
        nombre_producto,
        marcaProd,
        descripcion,
        cantidad,
        nombre_solicitante,
        area,
        email,
        empleado,
      } = solicitud;

      const persona = empleado?.persona || {};
      const { nombre, apellidos, telefono, documento_identidad } = persona;

      // Convierte el texto de búsqueda a minúsculas para comparación insensible a mayúsculas
      const searchLower = search.toLowerCase();

      // Normaliza el estado (1 = Resuelta, cualquier otro valor = Pendiente)
      const estadoTexto = estado === 1 ? "Resuelta" : "Pendiente";

      // Filtra basándose en los campos relevantes
      return (
        (email && email.toLowerCase().includes(searchLower)) ||
        (nombre && nombre.toLowerCase().includes(searchLower)) ||
        (apellidos && apellidos.toLowerCase().includes(searchLower)) ||
        (telefono && String(telefono).toLowerCase().includes(searchLower)) ||
        estadoTexto.toLowerCase().includes(searchLower) ||
        (nombre_producto &&
          nombre_producto.toLowerCase().includes(searchLower)) ||
        (marcaProd && marcaProd.toLowerCase().includes(searchLower)) ||
        (descripcion && descripcion.toLowerCase().includes(searchLower)) ||
        (cantidad && String(cantidad).toLowerCase().includes(searchLower)) ||
        (nombre_solicitante &&
          nombre_solicitante.toLowerCase().includes(searchLower)) ||
        (area?.nombre && area.nombre.toLowerCase().includes(searchLower))
      );
    });

    setFilteredSolicitudes(result);
  }, [search, solicitudes]);

  //  ===================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoSolicitud, setInfoSolicitud] = useState(null);
  const handleVerSolicitud = (data) => {
    setInfoSolicitud(data);
    setIsModalOpen(true);
  };
  // Cerrar el modal
  const handleCloseModal = () => {
    setInfoSolicitud(null);
    setIsModalOpen(false);
  };
  const actualizarTabla = () => {
    fetchSolicitudes();
  };
  // COLUMANS DE MI TABLA
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      center: true,
      grow: 0,
    },
    {
      name: "Acciones",
      grow: 0,
      cell: (row) => {
        return (
          <button
            className=" btn btn-primary "
            title={"Ver Solicitud"}
            onClick={() => handleVerSolicitud(row)}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        );
      },
    },
    {
      name: "Estado",
      grow: 0,
      minWidth: "150px",
      center: false,
      wrap: true,
      cell: (row) => {
        const { estado } = row;
        return (
          <div>
            {estado === 1 ? (
              <span className={"badge bg-success m-2  "}>
                <small>
                  <CheckmarkDoneOutline color={"auto"} />
                  Resuelta
                </small>
              </span>
            ) : (
              <span className={"badge bg-warning m-2  text-dark"}>
                <small>
                  <AlarmOutline color={"auto"} />
                  Pendiente
                </small>
              </span>
            )}
          </div>
        );
      },
    },
    {
      name: "Producto",
      selector: (row) => row.nombre_producto + " Marca: " + row.marcaProd,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Detalles",
      selector: (row) => row.descripcion,
      sortable: true,
      wrap: true,
      center: false,
    },

    {
      name: "Cantidad",
      selector: (row) => row.cantidad,
      sortable: true,
      wrap: true,
      center: false,
      minWidth: "150px",
      grow: 0,
    },
    {
      name: "Usuario Origen",
      selector: (row) => (
        <div className="p-2">
          <span
            className="badge"
            style={{
              background: "#c6dcee",
              color: "#638099",
              fontWeight: "bold",
              fontSize: "14px",
              verticalAlign: "middle",
            }}
          >
            {capitalizeFirstLetter(row.nombre_solicitante)}
          </span>
        </div>
      ),
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Area Origen",
      selector: (row) => row.area.nombre,
      sortable: true,
      wrap: true,
      center: false,
    },
  ];

  return (
    <div className="">
      {loading && <Cargando />}
      {error && <div className="error">{error}</div>}{" "}
      <DataTable
        className="tablaGeneral"
        columns={columns}
        data={filterSolicitudes}
        pagination
        responsive
        dense
        fixedHeader
        customStyles={customDataTableStyles}
        conditionalRowStyles={conditionalRowStyles}
        fixedHeaderScrollHeight="500px"
        striped={true}
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Todos",
        }}
      />
      {/* // modal detlales solicitud */}
      <Modal show={isModalOpen} onHide={handleCloseModal} centered size={"xl"}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Pasa handleCloseModal como prop a UsuarioForm */}
          <ModalDetallesSolicitud
            handleCloseModal={handleCloseModal}
            data={infoSolicitud}
            actualizarTabla={actualizarTabla}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
