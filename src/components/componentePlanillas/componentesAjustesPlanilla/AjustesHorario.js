import { useQuery } from "@tanstack/react-query";
import { GetHorarios } from "../../../service/GetHorarios";
import { Cargando } from "../../componentesReutilizables/Cargando";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import {
  CheckCheck,
  FileText,
  Pencil,
  Plus,
  Timer,
  Trash2,
} from "lucide-react";

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
            <Pencil className="text-auto" size={"auto"} />
          </button>

          {/* Botón Eliminar o Activar */}
          {row.estado === 1 ? (
            <button className="btn-eliminar btn-sm ms-2" title="Eliminar">
              <Trash2 className="text-auto" size={"auto"} />
            </button>
          ) : (
            <button className="btn btn-success btn-sm ms-2" title="Activar">
              <CheckCheck color={"autof"} size={"auto"} />
            </button>
          )}
        </div>
      ),
      right: true,
      sortable: true,
    },
  ];
  return (
    <div className="card shadow-sm h-100 py-2">
      <div className="card-header d-flex justify-content-between align-items-center p-2 border-bottom">
        <h4 className=" mb-0">
          <Timer className="text-auto" /> Horarios
        </h4>
        <div className="d-flex ms-auto mx-2">
          <input type="text" placeholder="Buscar..." className="form-control" />
        </div>
        <button className="btn btn-sm btn-outline-dark" title="Reporte">
          <FileText className="me-1 text-auto" />
          Reporte
        </button>
        <button className="btn btn-sm btn-outline-dark mx-2" title="Agregar">
          <Plus className=" text-auto" />
        </button>
      </div>
      <div className="card-body p-0">
        <TablasGenerales columnas={columnas} datos={horarios} />
      </div>
    </div>
  );
}
