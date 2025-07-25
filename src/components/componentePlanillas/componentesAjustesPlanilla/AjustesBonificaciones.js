import { useQuery } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { GetBonificacion } from "../../../service/GetBonificacion";
import { Cargando } from "../../componentesReutilizables/Cargando";
import { TablasGenerales } from "../../componentesReutilizables/TablasGenerales";
import {
  AddOutline,
  CashOutline,
  CheckmarkOutline,
  DocumentTextOutline,
  PencilOutline,
  TrashOutline,
} from "react-ionicons";

export function AjustesBonificaciones() {
  const {
    data: bonificaciones,
    isLoading: loadingBonificaciones,
    isError: errorBonificaciones,
    error: errorBonificacionesMessage,
  } = useQuery({
    queryFn: GetBonificacion,
    queryKey: ["bonificaciones"],
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (loadingBonificaciones)
    return (
      <p>
        <Cargando />
      </p>
    );
  if (errorBonificaciones) return <p>Error: {errorBonificacionesMessage}</p>;

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
    },
    {
      name: "Monto",
      selector: (row) => "S/. " + row.monto,
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
          <CashOutline color={"auto"} /> Bonificaciones
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
        <TablasGenerales columnas={columnas} datos={bonificaciones} />
      </div>
    </div>
  );
}
