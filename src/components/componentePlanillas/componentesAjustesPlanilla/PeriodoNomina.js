import { useQuery } from "@tanstack/react-query";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import { GetPeriodosNomina } from "../../../service/accionesPlanilla/GetPeriodosNomina";
import { Spinner, Alert, Button } from "react-bootstrap";
import { CondicionCarga } from "../../componentesReutilizables/CondicionCarga";
import { useMemo, useState } from "react";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { FormularioGenerarPeriodo } from "./FormularioGenerarPeriodo";

export function PeriodoNomina() {
  const [modalGenerarPeriodo, setModalGenerarPeriodo] = useState(false);
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
        return <span className="badge bg-dark">Cerrado</span>;
      default:
        return <span className="badge bg-light text-dark">Desconocido</span>;
    }
  };

  const renderAccionesCRUD = (row) => {
    // Solo se puede editar o eliminar si el periodo NO está cerrado
    const puedeModificar = row.estado !== 3;

    return (
      <>
        <Button variant="outline-primary" size="sm" disabled={!puedeModificar}>
          Editar
        </Button>{" "}
        <Button variant="outline-danger" size="sm" disabled={!puedeModificar}>
          Eliminar
        </Button>
      </>
    );
  };

  const ultimoCorteReal = useMemo(() => {
    if (!dataPeriodo || dataPeriodo.length === 0) {
      return null; // DB Vacía
    }

    const ultimoPeriodo = [...dataPeriodo].sort(
      (a, b) => new Date(b.fecha_fin) - new Date(a.fecha_fin)
    )[0];

    return ultimoPeriodo.fecha_fin; // Ej: "2025-10-27"
  }, [dataPeriodo]);

  // --- 🔴 AQUÍ ESTÁ LA CORRECCIÓN ---
  // Se cambió 'cell' por 'selector' en las columnas de datos simples.
  const columnas = [
    {
      name: "Id",
      selector: (row) => row.id, // <-- CORREGIDO (era cell)
      width: "60px",
      sortable: true,
    },
    {
      name: "Periodo",
      selector: (row) => row.nombrePeriodo, // <-- CORREGIDO (era cell)
      sortable: true,
    },
    {
      name: "Fecha Inicio",
      selector: (row) => row.fecha_inicio, // <-- CORREGIDO (era cell)
      sortable: true,
    },
    {
      name: "Fecha Fin (Corte)",
      selector: (row) => row.fecha_fin, // <-- CORREGIDO (era cell)
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row) => renderEstado(row.estado), // <-- CORRECTO (usa cell para custom)
      selector: (row) => row.estado, // <-- CORRECTO (usa selector para ordenar)
      sortable: true,
      center: true,
    },
    {
      name: "Acciones",
      cell: (row) => renderAccionesCRUD(row), // <-- CORRECTO (usa cell para botones)
      width: "180px",
    },
  ];
  // --- FIN DE LA CORRECCIÓN ---

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
    </CondicionCarga>
  );
}
