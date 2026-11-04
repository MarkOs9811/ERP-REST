import DataTable from "react-data-table-component";

const estilosTabla = {
  table: {
    style: {
      backgroundColor: "var(--card)",
      color: "var(--card-foreground)",
    },
  },
  tableWrapper: {
    style: {
      backgroundColor: "var(--card)",
    },
  },
  responsiveWrapper: {
    style: {
      maxWidth: "100%",
      overflowX: "auto",
    },
  },
  headRow: {
    style: {
      backgroundColor: "var(--muted)",
      borderBottomColor: "var(--border)",
      color: "var(--foreground)",
      minHeight: "3rem",
    },
  },
  headCells: {
    style: {
      color: "var(--muted-foreground)",
      fontSize: "0.75rem",
      fontWeight: 600,
    },
  },
  rows: {
    style: {
      backgroundColor: "var(--card)",
      borderBottomColor: "var(--border)",
      color: "var(--card-foreground)",
      minHeight: "3.25rem",
    },
    stripedStyle: {
      backgroundColor: "var(--muted)",
    },
    highlightOnHoverStyle: {
      backgroundColor: "var(--accent)",
      color: "var(--accent-foreground)",
    },
  },
  cells: {
    style: {
      color: "var(--card-foreground)",
    },
  },
  pagination: {
    style: {
      backgroundColor: "var(--card)",
      borderTopColor: "var(--border)",
      color: "var(--muted-foreground)",
    },
    pageButtonsStyle: {
      backgroundColor: "transparent",
      color: "var(--foreground)",
      fill: "var(--foreground)",
    },
  },
  noData: {
    style: {
      backgroundColor: "var(--card)",
      color: "var(--muted-foreground)",
      padding: "2rem",
    },
  },
  progress: {
    style: {
      backgroundColor: "var(--card)",
      color: "var(--muted-foreground)",
    },
  },
};

export function TablasGenerales({
  columnas,
  datos,
  // Nuevos props para soportar Backend y Loading
  cargando = false,
  paginacionServer = false,
  totalRegistros = 0,
  alCambiarPagina = () => {},
}) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden bg-card text-card-foreground">
      <DataTable
        className="tablaGeneral"
        columns={columnas}
        data={datos}
        responsive
        dense
        fixedHeader
        striped
        highlightOnHover
        customStyles={estilosTabla}
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
          <div className="px-4 py-8 text-sm text-muted-foreground">
            No hay datos para mostrar
          </div>
        }
      />
    </div>
  );
}
