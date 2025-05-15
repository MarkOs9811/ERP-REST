import { useQuery } from "@tanstack/react-query";
import { GetHorarios } from "../../../service/GetHorarios";
import { Cargando } from "../../componentesReutilizables/Cargando";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import {
  AddOutline,
  CheckmarkOutline,
  DocumentTextOutline,
  PencilOutline,
  TimeOutline,
  TrashOutline,
} from "react-ionicons";

export function AjustesHorario() {
  const {
    data: horarios,
    isLoading: loadingHorarios,
    isError: errorHorarios,
    error: errorHorariosMessage,
  } = useQuery({
    queryKey: ["horarios"],
    queryFn: GetHorarios,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (loadingHorarios) {
    return (
      <div className=" text-primary" role="status">
        <Cargando />
      </div>
    );
  }
  if (errorHorarios) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar los horarios: {errorHorariosMessage.message}
      </div>
    );
  }

  const columnas = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      grow: 0,
    },
    {
      name: "Hora Entrada",
      selector: (row) => row.horaEntrada,
      sortable: true,
    },
    {
      name: "Hora Salida",
      selector: (row) => row.horaSalida,
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row) => (
        <div>
          {row.estado === 1 ? (
            <div className="badge bg-success text-white">Activo</div>
          ) : (
            <div className="badge bg-danger text-white">Inactivo</div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="d-flex justify-content-center">
          {/* Botón Editar */}
          <button className=" btn-editar btn-sm" title="Editar">
            <PencilOutline color={"auto"} />
          </button>

          {/* Botón Eliminar o Activar */}
          {row.estado === 1 ? (
            <button className="btn-eliminar btn-sm ms-2" title="Eliminar">
              <TrashOutline color={"auto"} />
            </button>
          ) : (
            <button className="btn btn-success btn-sm ms-2" title="Activar">
              <CheckmarkOutline color={"autof"} />
            </button>
          )}
        </div>
      ),
      right: true,
      sortable: true,
    },
  ];
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <h4 className=" mb-0">
          <TimeOutline color={"auto"} /> Horarios
        </h4>
        <div className="d-flex ms-auto mx-2">
          <input type="text" placeholder="Buscar..." className="form-control" />
        </div>
        <button className="btn btn-sm btn-outline-dark" title="Reporte">
          <DocumentTextOutline className="me-1" color={"auto"} />
          Reporte
        </button>
        <button className="btn btn-sm btn-outline-dark mx-2" title="Agregar">
          <AddOutline className="" color={"auto"} />
        </button>
      </div>
      <div className="card-body p-0">
        <TablasGenerales columnas={columnas} datos={horarios} />
      </div>
    </div>
  );
}
