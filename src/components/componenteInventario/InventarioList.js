import { useState, useEffect, useCallback } from "react";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";
import { useEstadoAsyn } from "../../hooks/EstadoAsync";
import { Cargando } from "../componentesReutilizables/Cargando";
import { GetInventario } from "../../service/GetInventario";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { AlertCircleOutline } from "react-ionicons";

export function InventarioList({ search }) {
  const [inventario, setInvetario] = useState([]);
  const [filterInventario, setFilterInventario] = useState([]);

  // Define los colores y estilos condicionales
  const rowColors = ["#1dae79", "#d34242", "#4c7d9a", "#ff9800"]; // Colores alternados
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

  const fetchInventario = useCallback(async () => {
    const result = await GetInventario();
    if (result.success) {
      setInvetario(result.data);
      setFilterInventario(result.data);
    } else {
      setHasError(true); // Si ocurre un error, lo manejamos aquí
    }
  }, []);

  const { loading, error, execute } = useEstadoAsyn(fetchInventario);
  const [hasError, setHasError] = useState(false); // Para manejar el estado de error

  // useEffect para ejecutar la función asíncrona cuando sea necesario
  useEffect(() => {
    if (!hasError) {
      execute();
    }
  }, []);

  // Filtro de búsqueda
  useEffect(() => {
    const resultado = inventario.filter((item) => {
      // Cambié el nombre de la variable 'inventario' a 'item' para evitar confusión
      const { nombre, marca, presentacion, descripcion, codigoProd } = item; // 'item' es el objeto de cada fila
      const searchLower = search.toLowerCase(); // Asegurándonos de que 'search' está en minúsculas
      return (
        (nombre && nombre.toLowerCase().includes(searchLower)) ||
        (marca && marca.toLowerCase().includes(searchLower)) ||
        (presentacion && presentacion.toLowerCase().includes(searchLower)) ||
        (descripcion && descripcion.toLowerCase().includes(searchLower)) ||
        (codigoProd && codigoProd.toLowerCase().includes(searchLower))
      );
    });
    setFilterInventario(resultado); // Establecemos los resultados filtrados en el estado
  }, [search, inventario]); // Esto depende tanto de 'search' como de 'inventario'

  // Definimos las columnas de la tabla
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Acciones",
      cell: (row) => {
        const { estado } = row;
        return (
          <div className="d-flex justify-content-around flex-wrap p-2">
            {estado == 1 ? (
              <>
                <button className="btn-editar me-2" title="Editar Producto">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button className="btn-eliminar">
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    title="Eliminar Producto"
                  />
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-success"
                title="Activar el producto"
                onClick={() => handleQuestionActivar(row.id, row.nombre)}
              >
                <FontAwesomeIcon icon={faPowerOff} />
              </button>
            )}
          </div>
        );
      },
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Codigo",
      selector: (row) => row.codigoProd,
      sortable: true,
      wrap: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Descripcion",
      selector: (row) => row.descripcion,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
      wrap: true,
      center: false,
    },

    {
      name: "F.Venc",
      selector: (row) => {
        const today = new Date();
        const oneMonthAhead = new Date(today);
        oneMonthAhead.setMonth(today.getMonth() + 1); // Fecha dentro de 1 mes
        const fechaVencimiento = new Date(row.fecha_vencimiento);

        // Determina si está por vencer, vencido o no
        const isNearExpiry =
          fechaVencimiento > today && fechaVencimiento <= oneMonthAhead;
        const isExpired = fechaVencimiento < today;

        return (
          <div>
            {isNearExpiry ? (
              <>
                <span className="d-flex flex-column align-items-start text-secondary">
                  <span>{row.fecha_vencimiento}</span>
                  <div className="d-flex align-items-center">
                    <small>
                      <AlertCircleOutline
                        color="grey"
                        size={20}
                        className="me-2"
                      />
                    </small>
                    <span>Por Vencer</span>
                  </div>
                </span>
              </>
            ) : isExpired ? (
              <>
                <span className="d-flex flex-column align-items-start text-danger">
                  <span>{row.fecha_vencimiento}</span>
                  <div className="d-flex align-items-center">
                    <small>
                      <AlertCircleOutline
                        color="red"
                        size={20}
                        className="me-2"
                      />
                    </small>
                    <span>Vencido</span>
                  </div>
                </span>
              </>
            ) : (
              <span className="text-success">{row.fecha_vencimiento}</span>
            )}
          </div>
        );
      },
      sortable: true,
      wrap: true,
      center: false,
    },

    {
      name: "Categoria",
      selector: (row) => row.categoria?.nombre,
      sortable: true,
      wrap: true,
      center: false,
    },

    {
      name: "U. Medida",
      selector: (row) => row.unidad?.nombre,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Precio",
      selector: (row) => row.precio,
      center: true,
      sortable: true,
      wrap: true,
    },
    // Aquí puedes agregar más columnas si lo necesitas
  ];

  // Si está cargando, mostramos el componente de carga
  if (loading) {
    return <Cargando />;
  }

  // Si hay un error, mostramos el mensaje de error
  if (error) {
    return (
      <div className="error-message">
        <h2>Error:</h2>
        <pre>{error.message || "Hubo un problema desconocido"}</pre>
      </div>
    );
  }

  // Renderizamos la tabla cuando todo está correcto
  return (
    <div>
      <DataTable
        className="tablaGeneral"
        columns={columns}
        data={filterInventario || []}
        pagination
        responsive
        dense
        fixedHeader
        customStyles={customDataTableStyles}
        fixedHeaderScrollHeight="600px"
        striped={true}
        conditionalRowStyles={conditionalRowStyles}
        paginationComponentOptions={{
          rowsPerPageText: "Filas por Pagina:",
          rangeSeparatorText: "de",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Todos",
        }}
      />
    </div>
  );
}
