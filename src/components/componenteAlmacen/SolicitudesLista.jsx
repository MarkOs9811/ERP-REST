import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";
import { capitalizeFirstLetter } from "../../hooks/FirstLetterUp";
import { Cargando } from "../componentesReutilizables/Cargando";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { ModalDetallesSolicitud } from "./componenteSolicitud/ModalDetallesSolicitud";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { CheckCheckIcon, Clock1, GitCompareIcon } from "lucide-react";
import { BadgeComponent } from "../componentesReutilizables/BadgeComponent";
import ModalRight from "../componentesReutilizables/ModalRight";
import ModalGeneral from "../componenteToast/ModalGeneral";
import ToastAlert from "../componenteToast/ToastAlert";
import "../../css/estilosAlmacen/EstilosSolicitudesModal.css";

export function SolicitudesLista({ search, updateList }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoSolicitud, setInfoSolicitud] = useState(null);
  const [modalQuestion, setModalQuestion] = useState(false);
  const queryClient = useQueryClient();

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
      const { nombre, apellidos, telefono } = persona;

      const estadoTexto = estado === 1 ? "Resuelta" : "Pendiente";

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

  const handleQuestionEstado = () => {
    if (!infoSolicitud?.id || infoSolicitud?.estado === 1) return;
    setModalQuestion(true);
  };

  const handleCambiarEstado = async () => {
    if (!infoSolicitud?.id) return false;
    try {
      const response = await axiosInstance.post("/solicitudes/cambioEstado", {
        id: infoSolicitud.id,
      });

      if (response.data.success) {
        ToastAlert("success", "Cambio de estado correctamente");
        queryClient.invalidateQueries(["solicitudes"]);
        actualizarTabla();
        setInfoSolicitud((prev) => (prev ? { ...prev, estado: 1 } : prev));
        return true;
      }

      ToastAlert("error", response.data.error || "Error en la actualización");
      return false;
    } catch (error) {
      ToastAlert("error", "Error de conexión");
      console.error("Error:", error);
      return false;
    }
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
          className="btn-informativo"
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
        return row.estado === 1 ? (
          <BadgeComponent
            label={"Resuelto"}
            icon={<CheckCheckIcon className="text-auto" />}
            variant={"success"}
          />
        ) : (
          <BadgeComponent
            label={"Pendiente"}
            icon={<Clock1 className="text-auto" />}
            variant={"warning"}
          />
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
      <TablasGenerales datos={filteredSolicitudes} columnas={columns} />

      <ModalRight
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Detalles de la Solicitud"
        width={"700px"}
        hideFooter={false}
        cancelText="Cerrar"
        submitText={infoSolicitud?.estado === 1 ? "Atendido" : "Cambiar estado"}
        onSubmit={
          infoSolicitud?.estado === 1 ? undefined : handleQuestionEstado
        }
        submitIcon={
          infoSolicitud?.estado === 1 ? (
            <CheckCheckIcon size={16} className="me-1" />
          ) : (
            <GitCompareIcon size={16} className="me-1" />
          )
        }
        submitButtonClassName={
          infoSolicitud?.estado === 1 ? "" : "btn-cambiar-estado"
        }
        isSubmitDisabled={infoSolicitud?.estado === 1}
      >
        {() => <ModalDetallesSolicitud data={infoSolicitud} />}
      </ModalRight>

      <ModalGeneral
        show={modalQuestion}
        mensaje="¿Cambiar estado a Atendido?"
        handleAccion={handleCambiarEstado}
        handleCloseModal={() => setModalQuestion(false)}
      />
    </div>
  );
}
