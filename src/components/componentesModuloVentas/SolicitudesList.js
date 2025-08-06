import { useEffect, useState } from "react";
import { GetMisSolicitudes } from "../../service/GetMisSolicitudes";
import { useEstadoAsyn } from "../../hooks/EstadoAsync";
import { Cargando } from "../componentesReutilizables/Cargando";
import { useCallback } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";

import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { CheckCheck } from "lucide-react";

export function SolicitudesList({ search }) {
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [filterSolicitudes, setFilterSolicitudes] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const resultado = misSolicitudes.filter((items) => {
      const { usuario, producto, categoria } = items;
      const searchLower = search?.toLowerCase();

      const usuarioNombreCompleto = `${
        usuario?.empleado?.persona?.nombre || ""
      } ${usuario?.empleado?.persona?.apellidos || ""}`.toLowerCase();

      const productoName = producto?.nombreCaja?.toLowerCase() || "";
      const cat = categoria?.nombre?.toLowerCase() || "";
      return (
        usuarioNombreCompleto.includes(searchLower) ||
        productoName.includes(searchLower) ||
        cat.includes(searchLower)
      );
    });

    setFilterSolicitudes(resultado);
  }, [search, misSolicitudes]);

  const fetchMisSolicitudes = useCallback(async () => {
    try {
      const result = await GetMisSolicitudes();
      if (result.success) {
        setFilterSolicitudes(result.data);
        setMisSolicitudes(result.data);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Error en fetchCajas:", error);
      setHasError(true);
    }
  }, []);
  const { loading, error, execute } = useEstadoAsyn(fetchMisSolicitudes);

  useEffect(() => {
    if (!hasError) {
      execute();
    }
  }, []);

  if (loading) {
    return <Cargando />;
  }
  if (error) {
    return (
      <div className="error-message">
        <h2>Error:</h2>
        <pre>{error.message || "Error al cargar"}</pre>
      </div>
    );
  }

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => {
        const { estado } = row;
        return (
          <div className="d-flex justify-content-around py-2">
            {estado == 0 ? (
              <>
                <button className="btn-editar me-2" title="Editar Solicitud">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="btn-eliminar me-2"
                  title="Eliminar Solicitud"
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </>
            ) : (
              <button className="btn btn-guardar w-100">
                <CheckCheck color={"auto"} />
                Revisada
              </button>
            )}
          </div>
        );
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Producto",
      selector: (row) => row.nombre_producto,
      sortable: true,
      wrap: true,
    },
    {
      name: "Cantidad",
      selector: (row) => row.cantidad,
      sortable: true,
      wrap: true,
    },
    {
      name: "Medida",
      selector: (row) => row.unidad?.nombre,
      sortable: true,
    },
    {
      name: "Categoria",
      selector: (row) => row.categoria?.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Marca",
      selector: (row) => row.marcaProd,
      sortable: true,
      wrap: true,
    },
    {
      name: "Solicitante",
      selector: (row) =>
        row.usuario?.empleado?.persona?.nombre +
        " " +
        row.usuario?.empleado?.persona?.apellidos,
      sortable: true,
      wrap: true,
    },
    {
      name: "Area",
      selector: (row) => row.area.nombre,
      sortable: true,
      wrap: true,
    },
  ];
  return (
    <div>
      <TablasGenerales datos={filterSolicitudes} columnas={columns} />
    </div>
  );
}
