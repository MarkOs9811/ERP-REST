import DataTable from "react-data-table-component";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";

export function TablasGenerales({ columnas, datos }) {
  return (
    <div>
      <DataTable
        className="tablaGeneral"
        columns={columnas}
        data={datos}
        pagination
        responsive
        dense
        fixedHeader
        customStyles={customDataTableStyles}
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
