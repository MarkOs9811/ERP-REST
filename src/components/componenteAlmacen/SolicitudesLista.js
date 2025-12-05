import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { Cargando } from "../componentesReutilizables/Cargando";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { ModalDetallesSolicitud } from "./componenteSolicitud/ModalDetallesSolicitud";

import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { CheckCheck, CheckCheckIcon, Clock, Clock1 } from "lucide-react";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";

export function SolicitudesLista({ search, updateList }) {
  const rowColors = ["#1dae79", "#d34242", "#4c7d9a", "#ff9800"];

  const conditionalRowStyles = [
    {
      when: (row) => row,
      style: (row) => {
        const index = row.id % rowColors.length;
        return {
          borderLeft: `5px solid ${rowColors[index]}`,
        };
      },
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoSolicitud, setInfoSolicitud] = useState(null);

  const {
    data: solicitudes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["solicitudes"],
    queryFn: async () => {
      const response = await axiosInstance.get("/solicitudes");
      if (!response.data.success) {
        throw new Error("No se pudieron cargar las solicitudes");
      }
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const filteredSolicitudes = useMemo(() => {
    const searchLower = search.toLowerCase();

    return solicitudes.filter((solicitud) => {
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

      const estadoTexto = estado == 1 ? "Resuelta" : "Pendiente";

      return (
        (email && email.toLowerCase().includes(searchLower)) ||
        (nombre && nombre.toLowerCase().includes(searchLower)) ||
        (apellidos && apellidos.toLowerCase().includes(searchLower)) ||
        (telefono && String(telefono).includes(searchLower)) ||
        estadoTexto.toLowerCase().includes(searchLower) ||
        (nombre_producto &&
          nombre_producto.toLowerCase().includes(searchLower)) ||
        (marcaProd && marcaProd.toLowerCase().includes(searchLower)) ||
        (descripcion && descripcion.toLowerCase().includes(searchLower)) ||
        (cantidad && String(cantidad).includes(searchLower)) ||
        (nombre_solicitante &&
          nombre_solicitante.toLowerCase().includes(searchLower)) ||
        (area?.nombre && area.nombre.toLowerCase().includes(searchLower))
      );
    });
  }, [search, solicitudes]);

  const handleVerSolicitud = (data) => {
    setInfoSolicitud(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setInfoSolicitud(null);
    setIsModalOpen(false);
  };

  const actualizarTabla = () => {
    updateList?.(); // Llama a la función de actualización si se pasa como prop
  };

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
      cell: (row) => (
        <button
          className="btn-principal"
          title="Ver Solicitud"
          onClick={() => handleVerSolicitud(row)}
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
      ),
    },
    {
      name: "Estado",
      grow: 0,
      minWidth: "150px",
      center: false,
      wrap: true,
      cell: (row) => {
        return row.estado == 1 ? (
          <BadgeComponent
            label={"Resuelto"}
            icon={<CheckCheckIcon className="text-auto" />}
            variant={"success"}
          />
        ) : (
          <span className="badge bg-warning m-2 text-dark">
            <small>
              <Clock1 className="text-auto" /> Pendiente
            </small>
          </span>
        );
      },
    },
    {
      name: "Producto",
      selector: (row) => `${row.nombre_producto} Marca: ${row.marcaProd}`,
      sortable: true,
      wrap: true,
    },
    {
      name: "Detalles",
      selector: (row) => row.descripcion,
      sortable: true,
      wrap: true,
    },
    {
      name: "Cantidad",
      selector: (row) => row.cantidad,
      sortable: true,
      wrap: true,
      minWidth: "150px",
      grow: 0,
    },
    {
      name: "Usuario Origen",
      selector: (row) => (
        <>
          <span className="badge bg-light text-muted text-left">
            {capitalizeFirstLetter(row.nombre_solicitante)}
            <br />
          </span>
          <span className="small">
            {capitalizeFirstLetter(row.usuario?.email)}
          </span>
        </>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Área Origen",
      selector: (row) => row.area?.nombre || "Sin área",
      sortable: true,
      wrap: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.created_at,
      sortable: true,
      wrap: true,
      format: (row) => {
        if (!row.created_at) {
          return "";
        }
        const date = new Date(row.created_at);
        if (isNaN(date.getTime())) {
          return "Fecha Inválida";
        }
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      },
    },
  ];

  if (isLoading) return <Cargando />;
  if (isError) return <div className="text-danger">Error: {error.message}</div>;

  return (
    <div>
      <TablasGenerales
        datos={filteredSolicitudes}
        columnas={columns}
        conditionalRowStyles={conditionalRowStyles}
      />

      <Modal show={isModalOpen} onHide={handleCloseModal} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Detalles Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalDetallesSolicitud
            handleCloseModal={handleCloseModal}
            data={infoSolicitud}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
