import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import { GetPeriodosNomina } from "../../../service/accionesPlanilla/GetPeriodosNomina";
import { Spinner, Alert, Button, Modal } from "react-bootstrap";
import { CondicionCarga } from "../../componentesReutilizables/CondicionCarga";
import { useMemo, useState } from "react";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { FormularioGenerarPeriodo } from "./formulariosAjustes/FormularioGenerarPeriodo";
import { Pen, PenIcon, Trash } from "lucide-react";
import { FormularioEditarPeriodo } from "./formulariosAjustes/FormularioEditarPeriodo";
import ModalAlertQuestion from "../../componenteToast/ModalAlertQuestion";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";

export function PeriodoNomina() {
  const queryClient = useQueryClient();
  const [modalGenerarPeriodo, setModalGenerarPeriodo] = useState(false);

  const [modalEditarPeriodo, setModalEditarPeriodo] = useState(false);
  const [modalQuestionDelete, setModalQuestionDelete] = useState(false);

  const [dataPeriodoEdit, setDataPeriodoEdit] = useState([]);

  const {
    data: dataPeriodo = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listaPeriodosNomina"],
    queryFn: GetPeriodosNomina,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const renderEstado = (estado) => {
    switch (estado) {
      case 0:
        return <span className="badge bg-secondary">Pendiente</span>;
      case 1:
        return <span className="badge bg-success">Abierto</span>;
      case 2:
        return (
          <span className="badge bg-warning text-dark">En Validación</span>
        );
      case 3:
        return <span className="badge bg-danger">Cerrado</span>;
      default:
        return <span className="badge bg-light text-dark">Desconocido</span>;
    }
  };

  // --- LÓGICA DE BORRADO SEGURO (ANTI-HUECOS) ---
  const ultimoCorteReal = useMemo(() => {
    if (!dataPeriodo || dataPeriodo.length === 0) {
      return null; // DB Vacía
    }
    const ultimoPeriodo = [...dataPeriodo].sort(
      (a, b) => new Date(b.fecha_fin) - new Date(a.fecha_fin)
    )[0];
    return ultimoPeriodo.fecha_fin;
  }, [dataPeriodo]);

  // 1. Encontramos el ID del ÚLTIMO periodo cronológico
  const ultimoPeriodoCronologicoId = useMemo(() => {
    if (!dataPeriodo || dataPeriodo.length === 0) return null;

    // Ordenamos por fecha_inicio más reciente
    const ultimoPeriodo = [...dataPeriodo].sort(
      (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
    )[0];

    return ultimoPeriodo.id;
  }, [dataPeriodo]);
  // --- FIN LÓGICA DE BORRADO ---

  const renderAccionesCRUD = (row) => {
    // 2. APLICAMOS LA LÓGICA DE BORRADO
    // Regla para Editar: El usuario la dejó en "no cerrado"
    const puedeEditar = row.estado !== 3;

    // Regla para Eliminar (Anti-Huecos):
    const esPendiente = row.estado === 0;
    const esElUltimo = row.id === ultimoPeriodoCronologicoId;
    const puedeEliminar = esPendiente && esElUltimo; // Ambas deben ser ciertas

    let titleEliminar = "Eliminar Periodo";
    if (!esPendiente) {
      titleEliminar = "No se puede eliminar un periodo activo o cerrado.";
    } else if (!esElUltimo) {
      titleEliminar =
        "Error: Solo se puede eliminar el último periodo de la lista (para evitar huecos).";
    }

    return (
      <>
        <button
          className="btn-editar mx-2"
          disabled={!puedeEditar}
          onClick={() => {
            setModalEditarPeriodo(true);
            setDataPeriodoEdit(row);
          }}
          title={
            !puedeEditar
              ? "No se puede editar un periodo en proceso o cerrado"
              : "Editar Periodo"
          }
        >
          <Pen className="text-auto" size={"auto"} />
        </button>{" "}
        <button
          className="btn-eliminar"
          size="sm"
          disabled={!puedeEliminar} // <-- LÓGICA APLICADA
          title={titleEliminar} // <-- Título dinámico
          onClick={() => {
            setModalQuestionDelete(true);
            setDataPeriodoEdit(row);
          }}
        >
          <Trash className="text-auto" size={"auto"} />
        </button>
      </>
    );
  };

  // HANDLE PARA ELIMINAR EL PERIODO
  const handleEliminarPeriodo = async (id) => {
    try {
      // --- CORRECCIÓN DE RUTA ---
      // La ruta DELETE debe ser RESTful (llevar el ID en la URL)
      const response = await axiosInstance.delete(`/periodoNomina/${id}`);

      if (response.data.success) {
        ToastAlert("success", "Se eliminó correctamente");
        queryClient.invalidateQueries(["listaPeriodosNomina"]);
        setModalQuestionDelete(false);
      }
    } catch (error) {
      // --- CORRECCIÓN MANEJO DE ERRORES ---
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Muestra el error específico del backend (ej. "No se puede borrar...")
        ToastAlert("error", error.response.data.message);
      } else {
        ToastAlert("error", "Error de conexión o respuesta no válida.");
      }
    }
  };

  const columnas = [
    {
      name: "Id",
      selector: (row) => row.id,
      width: "60px",
      sortable: true,
    },
    {
      name: "Periodo",
      selector: (row) => row.nombrePeriodo,
      sortable: true,
    },
    {
      name: "Fecha Inicio",
      selector: (row) => row.fecha_inicio,
      sortable: true,
    },
    {
      name: "Fecha Fin (Corte)",
      selector: (row) => row.fecha_fin,
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row) => renderEstado(row.estado),
      selector: (row) => row.estado,
      sortable: true,
      center: true,
    },
    {
      name: "Acciones",
      cell: (row) => renderAccionesCRUD(row),
      width: "180px",
    },
  ];

  return (
    <CondicionCarga isLoading={isLoading} isError={isError}>
      <div className="card shadow-sm py-2">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Configuración de Periodos de Planilla</h5>
          <div className="d-flex ms-auto gap-2">
            <button className="btn btn-sm btn-success"> + Nuevo Periodo</button>
            <button
              className="btn btn-sm btn-dark"
              onClick={() => setModalGenerarPeriodo(true)}
            >
              Generar periodos del año
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <TablasGenerales columnas={columnas} datos={dataPeriodo} />
        </div>
      </div>

      {/* --- MODALES (Sin cambios) --- */}
      <ModalRight
        isOpen={modalGenerarPeriodo}
        onClose={() => setModalGenerarPeriodo(false)}
        title="Generar Periodo de pagos"
        subtitulo="Use esta herramienta para generar los periodos de nómina restantes del
          año o para un año futuro completo."
        hideFooter={true}
      >
        {({ handleClose }) => (
          <FormularioGenerarPeriodo
            onClose={handleClose}
            ultimoCorteReal={ultimoCorteReal}
          />
        )}
      </ModalRight>

      <ModalRight
        isOpen={modalEditarPeriodo}
        onClose={() => setModalEditarPeriodo(false)}
        title="Editar Periodo"
        subtitulo="Actualizar el periodo generado."
        hideFooter={true}
      >
        {({ handleClose }) => (
          <FormularioEditarPeriodo
            dataPeriodo={dataPeriodoEdit}
            onClose={handleClose}
          />
        )}
      </ModalRight>

      <ModalAlertQuestion
        show={modalQuestionDelete}
        idEliminar={dataPeriodoEdit.id}
        nombre={dataPeriodoEdit.nombrePeriodo}
        tipo={"periodo"}
        handleCloseModal={() => setModalQuestionDelete(false)}
        handleEliminar={handleEliminarPeriodo}
      />
    </CondicionCarga>
  );
}
