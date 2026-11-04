import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import { GetPeriodosNomina } from "../../../service/accionesPlanilla/GetPeriodosNomina";
import { CondicionCarga } from "../../componentesReutilizables/CondicionCarga";
import { useMemo, useState } from "react";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { FormularioGenerarPeriodo } from "./formulariosAjustes/FormularioGenerarPeriodo";
import { FormularioEditarPeriodo } from "./formulariosAjustes/FormularioEditarPeriodo";
import ModalAlertQuestion from "../../componenteToast/ModalAlertQuestion";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import {
  BtnEditar,
  BtnEliminar,
} from "../../componentesReutilizables/BotonesAccion";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary">
            Pendiente
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-emerald-600">
            Abierto
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-amber-500 text-foreground">
            En Validación
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-destructive">
            Cerrado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-muted text-foreground">
            Desconocido
          </span>
        );
    }
  };

  // --- LÓGICA DE BORRADO SEGURO (ANTI-HUECOS) ---
  const ultimoCorteReal = useMemo(() => {
    if (!dataPeriodo || dataPeriodo.length === 0) {
      return null; // DB Vacía
    }
    const ultimoPeriodo = [...dataPeriodo].sort(
      (a, b) => new Date(b.fecha_fin) - new Date(a.fecha_fin),
    )[0];
    return ultimoPeriodo.fecha_fin;
  }, [dataPeriodo]);

  // 1. Encontramos el ID del ÚLTIMO periodo cronológico
  const ultimoPeriodoCronologicoId = useMemo(() => {
    if (!dataPeriodo || dataPeriodo.length === 0) return null;

    // Ordenamos por fecha_inicio más reciente
    const ultimoPeriodo = [...dataPeriodo].sort(
      (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio),
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
        <BtnEditar
          disabled={!puedeEditar}
          onClick={() => {
            setModalEditarPeriodo(true);
            setDataPeriodoEdit(row);
          }}
          title={
            !puedeEditar
              ? "No se puede editar un periodo en proceso o cerrado"
              : "Editar Período"
          }
        />
        <BtnEliminar
          disabled={!puedeEliminar}
          onClick={() => {
            setModalQuestionDelete(true);
            setDataPeriodoEdit(row);
          }}
          title={titleEliminar}
        />
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
      <Card className="py-2">
        <CardHeader className="flex justify-between items-center">
          <h5>Configuración de Periodos de Planilla</h5>
          <div className="flex ms-auto gap-2">
            {/* <button className="btn btn-sm btn-success"> + Nuevo Periodo</button> */}
            <Button
              className="btn-principal"
              onClick={() => setModalGenerarPeriodo(true)}
              variant="default"
            >
              Generar periodos del año
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TablasGenerales columnas={columnas} datos={dataPeriodo} />
        </CardContent>
      </Card>

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
