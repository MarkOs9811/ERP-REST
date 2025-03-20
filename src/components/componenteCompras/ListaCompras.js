import { useQuery } from "@tanstack/react-query";
import { GetCompras } from "../../service/GetCompras";
import DataTable from "react-data-table-component";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";
import {
  DocumentTextOutline,
  EyeOffOutline,
  TrashBinOutline,
} from "react-ionicons";

export function ListaCompras() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["compras"],
    queryFn: GetCompras,
  });

  if (isLoading) return <p>Cargando compras...</p>;
  if (error) return <p>Error al obtener las compras</p>;

  // Extraer compras de la data
  const compras = data?.compras || [];

  // Definir columnas
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
    },
    {
      name: "Usuario",
      selector: (row) =>
        row.usuario?.empleado?.persona?.nombre +
        " " +
        row.usuario?.empleado?.persona?.apellidos,
      sortable: true,
    },
    {
      name: "Proveedor",
      selector: (row) => row.proveedor?.nombre,
      sortable: true,
    },
    {
      name: "Monto",
      selector: (row) => {
        const monto = parseFloat(row.totalPagado);
        return isNaN(monto) ? "S/. 0.00" : `S/. ${monto.toFixed(2)}`;
      },
      sortable: true,
    },

    {
      name: "Fecha",
      selector: (row) => row.fecha_compra,
      sortable: true,
    },
    {
      name: "Observaciones",
      selector: (row) => row.observaciones || "N/A",
    },
    {
      name: "Estado",
      cell: (row) => (
        <span
          className="px-2 py-1 rounded text-white"
          style={{
            backgroundColor: row.estado === 1 ? "#4caf50" : "#ff9800",
          }}
        >
          {row.estado === 1 ? "Pagado" : "Pendiente"}
        </span>
      ),
      sortable: true,
    },

    {
      name: "Documento",
      cell: (row) => (
        <a href={row.documentoUrl} target="_blank" rel="noopener noreferrer">
          <DocumentTextOutline size={20} color="blue" />
        </a>
      ),
      width: "100px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          <button className="btn btn-primary">
            <EyeOffOutline size={16} />
          </button>
          <button className="btn btn-danger">
            <TrashBinOutline size={16} />
          </button>
        </div>
      ),
      width: "120px",
    },
  ];

  return (
    <div className="tabla-container">
      <DataTable
        className="tablaGeneral"
        columns={columns}
        data={compras}
        pagination
        responsive
        dense
        fixedHeader
        customStyles={customDataTableStyles}
        fixedHeaderScrollHeight="500px"
        striped={true}
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Todos",
        }}
      />
    </div>
  );
}
