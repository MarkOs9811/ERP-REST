import DataTable from "react-data-table-component";
import getCustomDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";

export function TablasGenerales({
  columnas,
  datos,
  // Nuevos props para soportar Backend y Loading
  cargando = false,
  paginacionServer = false,
  totalRegistros = 0,
  alCambiarPagina = () => {},
}) {
  const isDark = document.body.classList.contains("dark-theme");

  return (
    <div className="fw-tabla-wrapper">
      <DataTable
        className="tablaGeneral"
        columns={columnas}
        data={datos}
        responsive
        dense
        fixedHeader
        striped={true} // <-- ESTO ACTIVA EL INTERCALADO
        highlightOnHover={true}
        customStyles={getCustomDataTableStyles(isDark)}
        // --- ESTADO DE CARGA ---
        progressPending={cargando}
        // --- CONFIGURACIÓN DE PAGINACIÓN ---
        pagination
        paginationServer={paginacionServer} // True = Backend, False = Frontend
        paginationTotalRows={totalRegistros}
        onChangePage={alCambiarPagina}
        // -----------------------------------
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Todos",
        }}
        noDataComponent={
          <div className="fw-table-no-data">No hay datos para mostrar</div>
        }
      />
    </div>
  );
}
