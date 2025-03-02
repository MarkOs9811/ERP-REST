import { useCallback, useEffect, useState } from "react";
import axiosInstanceJava from "../../api/AxiosInstanceJava";
import DataTable from "react-data-table-component";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";
import {
  CheckmarkDoneOutline,
  DocumentTextOutline,
  HourglassOutline,
} from "react-ionicons";
import { getVentas } from "../../service/ObtenerVentasDetalle";
import { useEstadoAsyn } from "../../hooks/EstadoAsync";
import { Cargando } from "../componentesReutilizables/Cargando";

export function ListVentas({ search }) {
  const [listVentas, setListVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const rowColors = ["#1dae79", "#d34242", "#4c7d9a", "#ff9800"]; // Colores alternados

  // para poner colores random a la tabla borde
  const conditionalRowStyles = [
    {
      when: (row) => row,
      style: (row) => {
        const index = row.id % rowColors.length; // Alterna colores según el ID
        return {
          borderLeftColor: rowColors[index],
        };
      },
    },
  ];
  const fetchVentas = useCallback(async () => {
    const result = await getVentas();
    if (result.success) {
      setListVentas(result.data);
      setFilteredVentas(result.data);
    } else {
      setHasError(true); // Activar estado de error
    }
  }, []);

  const { loading, error, execute } = useEstadoAsyn(fetchVentas);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!hasError) {
      execute();
    }
  }, []); // Se detiene si ocurre un error

  useEffect(() => {
    // Verifica si el campo de búsqueda está vacío
    if (!search) {
      setFilteredVentas(listVentas); // Si no hay búsqueda, muestra todas las ventas
      return;
    }

    const searchLower = search.toLowerCase(); // Convierte el texto de búsqueda a minúsculas

    // Filtra las ventas basándose en los campos relevantes
    const result = listVentas.filter((venta) => {
      const { id, documento, total, metodoPago, user, fechaVenta } = venta;

      return [
        id && String(id), // ID de la venta
        documento === "B" ? "Boleta" : documento === "F" ? "Factura" : "Otro", // Comprobante
        total && `S/. ${total.toFixed(2)}`, // Total
        metodoPago?.nombre, // Método de pago
        user?.email, // Usuario
        fechaVenta, // Fecha de venta
      ]
        .filter(Boolean) // Elimina valores nulos o indefinidos
        .some((field) => field.toLowerCase().includes(searchLower)); // Comprueba si incluye el texto de búsqueda
    });

    setFilteredVentas(result); // Actualiza la lista filtrada
  }, [search, listVentas]);

  const handleDetallesVenta = (id) => {
    alert(id);
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      center: true,
    },
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
      wrap: true,
      center: true,
    },
    {
      name: "Total",
      selector: (row) => `S/. ${parseFloat(row.total).toFixed(2)}`, // Redondear el total a 2 decimales
      sortable: true,
      wrap: true,
      center: true,
    },

    {
      name: "Metodo ",
      selector: (row) => row.metodoPago?.nombre,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Usuario",
      selector: (row) => row.user?.email,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fechaVenta,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Estado",
      selector: (row) => (
        <small
          className={`alert p-1  d-flex justify-content-center align-items-center gap-1 ${
            row.estado === 0 ? "alert-warning text-dark" : "alert-success"
          }`}
          style={{ textAlign: "center", margin: "auto" }} // Asegura un centrado adicional si es necesario
        >
          {row.estado === 0 ? (
            <>
              <HourglassOutline color={"auto"} height="16px" width="16px" />
              Pendiente
            </>
          ) : (
            <>
              <CheckmarkDoneOutline color={"auto"} height="16px" width="16px" />
              Pagado
            </>
          )}
        </small>
      ),
      sortable: true,
      wrap: true,
      center: true,
    },

    {
      name: "Detalles",
      cell: (row) => {
        const { id } = row;
        return (
          <button className="btn " onClick={() => handleDetallesVenta(row.id)}>
            <DocumentTextOutline color={"auto"} />
          </button>
        );
      },
      sortable: true,
      wrap: true,
      center: true,
    },
  ];
  return (
    <div className="card">
      {loading && <Cargando />}
      {error && <div className="error">{error}</div>}{" "}
      <DataTable
        className="tablaGeneral"
        columns={columns}
        data={filteredVentas || []}
        pagination
        responsive
        dense
        fixedHeader
        customStyles={customDataTableStyles}
        fixedHeaderScrollHeight="500px"
        striped={true}
        conditionalRowStyles={conditionalRowStyles}
        //selectableRows={true} //con este se activa un check  porc ada fila selccionble
        //selectableRowsHighlight={true} //resaltar la fila selecionada

        // onRowClicked={(row) => console.log(row)} para ejecutar cuandos e hace click en cada fila
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
