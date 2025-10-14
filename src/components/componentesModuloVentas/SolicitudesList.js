import { useEffect, useState } from "react";
import { GetMisSolicitudes } from "../../service/GetMisSolicitudes";
import { useEstadoAsyn } from "../../hooks/EstadoAsync";
import { Cargando } from "../componentesReutilizables/Cargando";
import { useCallback } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";

import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { CheckCheck } from "lucide-react";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import ModalRight from "../componentesReutilizables/ModalRight";
import { FormEditarSolicitud } from "./FormEditarSolicitud";

export function SolicitudesList({ search }) {
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [filterSolicitudes, setFilterSolicitudes] = useState([]);
  const [hasError, setHasError] = useState(false);

  const [alertEliminar, setAlertEliminar] = useState(false);
  const [dataSolicitud, setDatoSolicitud] = useState([]);
  const [modalEditarSoli, setModalEditarSoli] = useState(false);

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

  const hanldeEliminarSoli = async (id) => {
    try {
      const response = await axiosInstance.delete(`/solicitudes/${id}`);
      if (response.data.success) {
        await execute();
        ToastAlert("success", "Solicitud eliminada con exito");
        return true;
      } else {
        ToastAlert("error", "Ocurrió un error al eliminar la solicitud");
        return false;
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión", error);
      console.error("Error al eliminar la solicitud:", error);
      return false;
    }
  };

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
                <button
                  className="btn-editar me-2"
                  title="Editar Solicitud"
                  onClick={() => {
                    setModalEditarSoli(true);
                    setDatoSolicitud(row);
                  }}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="btn-eliminar me-2"
                  title="Eliminar Solicitud"
                  onClick={() => {
                    setAlertEliminar(true);
                    setDatoSolicitud(row);
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </>
            ) : (
              <button className="btn btn-guardar w-100">
                <CheckCheck className="text-auto" />
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
      name: "estado",
      cell: (row) => {
        const { estado } = row;
        return estado == 1 ? (
          <span className="badge bg-success m-2">
            <small>Resuelta</small>
          </span>
        ) : (
          <span className="badge bg-warning m-2 text-dark">
            <small>Pendiente</small>
          </span>
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

      <ModalAlertQuestion
        show={alertEliminar}
        idEliminar={dataSolicitud?.id}
        handleCloseModal={() => setAlertEliminar(false)}
        handleEliminar={hanldeEliminarSoli}
        tipo={"solicitud"}
        nombre={dataSolicitud?.nombre_producto}
      />
      <ModalRight
        isOpen={modalEditarSoli}
        onClose={() => setModalEditarSoli(false)}
        title={"Editar Solicitud"}
        hideFooter={true}
        width={"650px"}
      >
        {({ handleClose }) => (
          <FormEditarSolicitud
            dataSolicitud={dataSolicitud}
            onClose={handleClose}
          />
        )}
      </ModalRight>
    </div>
  );
}
