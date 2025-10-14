import { useState, useEffect, useCallback, useMemo } from "react";
import { useEstadoAsyn } from "../../hooks/EstadoAsync";
import { GetInventario } from "../../service/GetInventario";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { Alert } from "react-bootstrap";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import ModalRight from "../componentesReutilizables/ModalRight";
import { FormEditarInventario } from "./FormEditarInventario";
import { AlertCircle } from "lucide-react";

export function InventarioList({ search }) {
  const [inventario, setInvetario] = useState([]);
  const [filterInventario, setFilterInventario] = useState([]);
  const queryClient = useQueryClient();

  const [modalEdit, setModalEdit] = useState(false);
  const [questionEliminar, setQuestionEliminar] = useState(false);
  const [questionActivar, setQuestionActivar] = useState(false);
  const [dataProducto, setdataProducto] = useState([]);

  const fetchInventario = useCallback(async () => {
    const result = await GetInventario();
    if (result.success) {
      setInvetario(result.data);
      setFilterInventario(result.data);
    } else {
      setHasError(true); // Si ocurre un error, lo manejamos aquí
    }
  }, []);

  const {
    data: inventarioData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["inventario"],
    queryFn: GetInventario,
    select: (data) => (data.success ? data.data : []),
  });
  const { loading, error, execute } = useEstadoAsyn(fetchInventario);
  const [hasError, setHasError] = useState(false); // Para manejar el estado de error

  // useEffect para ejecutar la función asíncrona cuando sea necesario
  useEffect(() => {
    if (!hasError) {
      execute();
    }
  }, []);

  // Filtro de búsqueda
  const filteredInventario = useMemo(() => {
    if (!inventarioData) return [];

    return inventarioData.filter((item) => {
      const { nombre, marca, presentacion, descripcion, codigoProd } = item;
      const searchLower = search.toLowerCase();

      return (
        (nombre && nombre.toLowerCase().includes(searchLower)) ||
        (marca && marca.toLowerCase().includes(searchLower)) ||
        (presentacion && presentacion.toLowerCase().includes(searchLower)) ||
        (descripcion && descripcion.toLowerCase().includes(searchLower)) ||
        (codigoProd && codigoProd.toLowerCase().includes(searchLower))
      );
    });
  }, [search, inventarioData]);

  const handleOcultarProducto = async (id) => {
    try {
      const response = await axiosInstance.put(`/inventario/desactivar/${id}`);

      if (response.data.success) {
        ToastAlert("success", "Producto desactivado correctamente");
        queryClient.invalidateQueries(["inventario"]);
      } else {
        ToastAlert("error", "Ocurrió un error al desactivar");
      }
    } catch (error) {
      ToastAlert("Error", "Error de conexión" + error);
    }
  };
  const handleActivarProducto = async (id) => {
    try {
      const response = await axiosInstance.put(`/inventario/activar/${id}`);

      if (response.data.success) {
        ToastAlert("success", "Producto activado correctamente");
        queryClient.invalidateQueries(["inventario"]);
      } else {
        ToastAlert("error", "Ocurrió un error al activar");
      }
    } catch (error) {
      ToastAlert("Error", "Error de conexión" + error);
    }
  };

  const handleEliminarProducto = async (idProd) => {
    try {
      const response = await axiosInstance.delete(`/inventario/${idProd}`);

      if (response.data.success) {
        ToastAlert("success", "Producto eliminado correctamente");

        // Invalida la consulta para que se vuelva a cargar la tabla
        queryClient.invalidateQueries(["inventario"]);
      } else {
        ToastAlert("error", "Error al eliminar el producto");
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión", error.message);
    }
  };

  const handleActualizarProducto = async (idProd) => {
    try {
      const response = await axiosInstance.delete(`/inventario/${idProd}`);

      if (response.data.success) {
        ToastAlert("success", "Producto eliminado correctamente");

        // Invalida la consulta para que se vuelva a cargar la tabla
        queryClient.invalidateQueries(["inventario"]);
      } else {
        ToastAlert("error", "Error al eliminar el producto");
      }
    } catch (error) {
      ToastAlert("error", "Error de conexión", error.message);
    }
  };

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
                <button
                  className="btn-editar me-2"
                  title="Editar Producto"
                  onClick={() => {
                    setModalEdit(true);
                    setdataProducto(row);
                  }}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="btn-eliminar"
                  title="Eliminar el producto"
                  onClick={() => {
                    setQuestionEliminar(true);
                    setdataProducto(row);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    title="Eliminar Producto"
                  />
                </button>
                <button
                  className=" btn-desactivar ms-2"
                  onClick={() => {
                    setQuestionEliminar(true);
                    setdataProducto(row);
                  }}
                  title="Ocultar producto"
                >
                  <FontAwesomeIcon icon={faEyeSlash} />
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-success"
                title="Activar el producto"
                onClick={() => {
                  setQuestionActivar(true);
                  setdataProducto(row);
                }}
              >
                <FontAwesomeIcon icon={faEye} />
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
                      <AlertCircle className="text-auto me-2" size={20} />
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
                      <AlertCircle className="me-2 text-auto" size={20} />
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
  // Paso 3: Renderizado
  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar el inventario</div>;

  // Renderizamos la tabla cuando todo está correcto
  return (
    <div>
      <TablasGenerales datos={filteredInventario} columnas={columns} />

      <ModalAlertQuestion
        show={questionEliminar}
        tipo={"Producto"}
        nombre={dataProducto.nombre}
        pregunta="¿Estas seguro de eliminar "
        idEliminar={dataProducto.id}
        handleCloseModal={() => setQuestionEliminar(false)}
        handleEliminar={handleEliminarProducto}
      />
      <ModalAlertQuestion
        show={questionEliminar}
        tipo={"Producto"}
        pregunta="¿Estas seguro de desactivar "
        nombre={dataProducto.nombre}
        idEliminar={dataProducto.id}
        handleCloseModal={() => setQuestionEliminar(false)}
        handleEliminar={handleOcultarProducto}
      />

      <ModalAlertActivar
        show={questionActivar}
        tipo={"Producto"}
        nombre={dataProducto.nombre}
        idActivar={dataProducto.id}
        handleCloseModal={() => setQuestionActivar(false)}
        handleActivar={handleActivarProducto}
      />

      <ModalRight
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        title="Editar Producto"
        hideFooter={true}
      >
        {({ handleClose }) => (
          <FormEditarInventario data={dataProducto} onCancel={handleClose} />
        )}
      </ModalRight>
    </div>
  );
}
