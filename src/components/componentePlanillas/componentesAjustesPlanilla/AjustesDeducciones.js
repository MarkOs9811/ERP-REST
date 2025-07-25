import {
  AddOutline,
  DocumentTextOutline,
  PencilOutline,
  RemoveCircleOutline,
  TrashOutline,
} from "react-ionicons";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import { GetDeducciones } from "../../../service/GetDeducciones";
import { useQuery } from "@tanstack/react-query";
import { Cargando } from "../../componentesReutilizables/Cargando";
import { right } from "@popperjs/core";

export function AjustesDeducciones() {
  const {
    data: deducciones,
    isLoading: loadingDeducciones,
    isError: errorDeducciones,
    error: errorDeduccionesMessage,
  } = useQuery({
    queryFn: GetDeducciones,
    queryKey: ["deducciones"],
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (loadingDeducciones)
    return (
      <p>
        <Cargando />
      </p>
    );
  if (errorDeducciones) return <p>Error: {errorDeduccionesMessage}</p>;

  const columnas = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "50px",
    },
    {
      name: "Nombre del concepto",
      selector: (row) => row.nombre,
      sortable: true,
      grow: 1,
    },
    {
      name: "%",
      selector: (row) => "S/. " + row.porcentaje,
      sortable: true,
      grow: 0,
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
      grow: 1,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="d-flex justify-content-center">
          <button className=" btn-editar mx-1" title="Editar">
            <PencilOutline className="" color={"auto"} />
          </button>
          <button className="btn-eliminar" title="Eliminar">
            <TrashOutline className="" color={"auto"} />
          </button>
        </div>
      ),
      sortable: true,
      grow: 1,
      right: true,
    },
  ];
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <h4 className=" mb-0">
          <RemoveCircleOutline color={"auto"} /> Deducciones
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
        <TablasGenerales columnas={columnas} datos={deducciones} />
      </div>
    </div>
  );
}
