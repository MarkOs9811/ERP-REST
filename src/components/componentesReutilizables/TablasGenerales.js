import DataTable from "react-data-table-component";
import getCustomDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";

export function TablasGenerales({ columnas, datos, conditionalRowStyles }) {
  const isDark = document.body.classList.contains("dark-theme"); // O usa tu contexto de tema
  return (
    <div>
      <DataTable
        className="tablaGeneral"
        columns={columnas}
        data={datos}
        pagination
        responsive
        conditionalRowStyles={conditionalRowStyles}
        dense
        fixedHeader
        striped={true}
        customStyles={getCustomDataTableStyles(isDark)}
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
