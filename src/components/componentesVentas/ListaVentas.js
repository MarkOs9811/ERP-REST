import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import DataTable from "react-data-table-component";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";
import {
  CheckmarkDoneOutline,
  DocumentTextOutline,
  HourglassOutline,
} from "react-ionicons";
import { Cargando } from "../componentesReutilizables/Cargando";

export function ListVentas({ search }) {
  const rowColors = ["#1dae79", "#d34242", "#4c7d9a", "#ff9800"];

  // React Query: obtener ventas con `useQuery`
  const {
    data: listVentas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
  });

  // Estado para la lista filtrada
  const [filteredVentas, setFilteredVentas] = useState([]);

  // Filtrado cuando cambia `search` o `listVentas`
  useEffect(() => {
    if (!search) {
      setFilteredVentas(listVentas);
      return;
    }

    const searchLower = search.toLowerCase();
    const result = listVentas.filter((venta) => {
      const { id, documento, total, metodoPago, user, fechaVenta } = venta;
      return [
        id && String(id),
        documento === "B" ? "Boleta" : documento === "F" ? "Factura" : "Otro",
        total && `S/. ${total.toFixed(2)}`,
        metodoPago?.nombre,
        user?.email,
        fechaVenta,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchLower));
    });

    setFilteredVentas(result);
  }, [search, listVentas]);

  const handleDetallesVenta = (id) => {
    alert(id);
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, center: true },
    {
      name: "Comprobante",
      selector: (row) => (
        <span
          className={`badge ${
            row.documento === "B"
              ? "bg-success"
              : row.documento === "F"
              ? "bg-primary"
              : "bg-secondary"
          }`}
        >
          {row.documento === "B"
            ? "Boleta"
            : row.documento === "F"
            ? "Factura"
            : "Otro"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Total",
      selector: (row) => `S/. ${parseFloat(row.total).toFixed(2)}`,
      sortable: true,
      center: true,
    },
    {
      name: "Metodo",
      selector: (row) => row.metodoPago?.nombre,
      sortable: true,
    },
    {
      name: "Usuario",
      selector: (row) => row.user?.email,
      sortable: true,
      center: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fechaVenta,
      sortable: true,
      center: true,
    },
    {
      name: "Estado",
      selector: (row) => (
        <small
          className={`alert p-1 d-flex justify-content-center align-items-center gap-1 ${
            row.estado === 0 ? "alert-warning text-dark" : "alert-success"
          }`}
        >
          {row.estado === 0 ? (
            <>
              <HourglassOutline height="16px" width="16px" /> Pendiente
            </>
          ) : (
            <>
              <CheckmarkDoneOutline height="16px" width="16px" /> Pagado
            </>
          )}
        </small>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Detalles",
      cell: (row) => (
        <button className="btn" onClick={() => handleDetallesVenta(row.id)}>
          <DocumentTextOutline />
        </button>
      ),
      sortable: true,
      center: true,
    },
  ];

  return (
    <div className="card">
      {isLoading && <Cargando />}
      {isError && <div className="error">Error al cargar ventas</div>}
      <DataTable
        className="tablaGeneral"
        columns={columns}
        data={filteredVentas}
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
