import {
  faEdit,
  faPlus,
  faPowerOff,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAlmacen } from "../../service/serviceAlmacen/GetAlmacen";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import { toast } from "react-toastify";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import { Modal } from "react-bootstrap";
import { AlmacenStockAdd } from "./AlmacenStockAdd";
import axiosInstance from "../../api/AxiosInstance";
import { Cargando } from "../componentesReutilizables/Cargando";
import { TablasGenerales } from "../componentesReutilizables/TablasGenerales";
import { Redo } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalRight from "../componentesReutilizables/ModalRight";
import { FormularioEditarAlmacen } from "./FormularioEditarAlmacen";

export function AlmacenList({ search, updateList }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [almacen, setAlmacen] = useState([]);
  const [filterAlmacen, setFilteredAlmacen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dataAlmance, setDataAlmance] = useState([]);
  const [modalEditarAlmacen, setModalEditarAlmacen] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmTrue, setShowConfirmTrue] = useState(false);

  const [activoIdDelete, setActivoIdDelete] = useState(null);
  const [nombreActivoToDelete, setNombreActivoToDelete] = useState(null);

  const [productoIdActivar, setProductoIdActivar] = useState(null);
  const [nombreActivoToActive, setNombreActivoToActive] = useState(null);

  const [idProductoEdit, setProductoEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // REPLACE manual fetch with react-query
  const {
    data: almacenData = [],
    isLoading: isLoadingAlmacen,
    isError: isErrorAlmacen,
    refetch: refetchAlmacen,
  } = useQuery({
    queryKey: ["almacen"],
    queryFn: GetAlmacen,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // sync react-query data into local state (used for filtering)
  useEffect(() => {
    // normalizar almacenData a un array seguro
    const list = Array.isArray(almacenData)
      ? almacenData
      : almacenData?.data ?? [];
    setAlmacen(list);
    setFilteredAlmacen(list);
  }, [almacenData]);

  // FUNCION PARA FILTRAR BUSQEUDA DE DATOS EN ALMACEN
  useEffect(() => {
    // seguridad: asegurarnos que almacen sea array
    if (!Array.isArray(almacen)) {
      setFilteredAlmacen([]);
      return;
    }

    const q = String(search || "")
      .trim()
      .toLowerCase();
    if (!q) {
      setFilteredAlmacen(almacen);
      return;
    }

    const result = almacen.filter((producto) => {
      const { nombre, marca, precioUnit, categoria, unidad, proveedor } =
        producto;

      return (
        (marca && marca.toLowerCase().includes(q)) ||
        (nombre && nombre.toLowerCase().includes(q)) ||
        (precioUnit && String(precioUnit).toLowerCase().includes(q)) ||
        (categoria?.nombre && categoria.nombre.toLowerCase().includes(q)) ||
        (unidad?.nombre && unidad.nombre.toLowerCase().includes(q)) ||
        (proveedor?.nombre && proveedor.nombre.toLowerCase().includes(q))
      );
    });

    setFilteredAlmacen(result);
  }, [search, almacen]);

  if (isLoadingAlmacen) return <Cargando />;
  if (isErrorAlmacen) return <p>Error al cargar datos de almacén</p>;

  // PARA ACTUALIZAR CUANDO SE HAGA CUALQUIER MOVIMIENTO
  const handleAlmacenUpdated = () => {
    // invalidar o refetch para actualizar la lista
    queryClient.invalidateQueries({ queryKey: ["almacen"] });
    // o refetchAlmacen(); // equivalente
  };
  // para llamar al modal para confirmar
  const handleEliminarProducto = (id, nombre) => {
    setShowConfirm(true);
    setActivoIdDelete(id);
    setNombreActivoToDelete(nombre);
  };
  // PARA CERRAR EL MODAL DE ELIMINAR
  const handleCloseModalQuestionEliminar = () => {
    setShowConfirm(false);
    setActivoIdDelete(null);
    setNombreActivoToDelete(null);
  };
  // =======================================================================
  // PARA LLAMR A LA FUNCION DE ACTIVAR MODAL
  const handleActivarProducto = (id, nombre) => {
    setShowConfirmTrue(true);
    setProductoIdActivar(id);
    setNombreActivoToActive(nombre);
  };
  // PARA CERRAR EL MODAL DE ACTIVAR PRODUCTO
  const handleCloseModalQuestionActivar = () => {
    setShowConfirmTrue(false);
    setProductoIdActivar(null);
    setNombreActivoToActive(null);
  };

  // FUNCION ES PARA ELIMINAR CON LA API
  const handleEliminarProductoSi = async (idActivo) => {
    try {
      const response = await axiosInstance.post(
        `/almacen/eliminar/${idActivo}`
      );
      if (response.data.success) {
        toast.success("Activo desactivado correctamente");
        queryClient.invalidateQueries({ queryKey: ["almacen"] });
        return true;
      } else {
        toast.error("Ocurrió un error al desactivar");
        return false;
      }
    } catch (error) {
      toast.error("Error en la conexión");
      return false;
    }
  };
  // funcion para activar el producto CON LA API
  const handleActivarProductoSi = async (idActivo) => {
    try {
      const response = await axiosInstance.post(`/almacen/activar/${idActivo}`);
      if (response.data.success) {
        toast.success("Producto activado correctamente");
        queryClient.invalidateQueries({ queryKey: ["almacen"] });
        return true;
      } else {
        toast.error("Ocurrió un error al activar");
        return false;
      }
    } catch (error) {
      toast.error("Error en la conexión");
      return false;
    }
  };

  // enviando ID PARA AGREGAR STOCK
  const handleAddStockModal = (data) => {
    setIsModalOpen(true);
    setProductoEdit(data);
  };

  // Cerrar el modal AGREGAR sTOCK
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductoEdit(null);
  };

  // ARMANDO ALS COLUMNAS
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Acciones",
      cell: (row) => {
        const { estado } = row;

        return (
          <div className="d-flex justify-content-around py-2">
            {estado == 1 ? (
              <>
                <button
                  className=" btn-add-stock me-2"
                  onClick={() => handleAddStockModal(row)}
                  title="Ingresar Stock"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <button
                  className=" btn-editar me-2"
                  onClick={() => {
                    setDataAlmance(row);
                    setModalEditarAlmacen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="btn-eliminar me-2"
                  onClick={() => handleEliminarProducto(row.id, row.nombre)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
                <button
                  className=" btn btn-transferir-directo me-2"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Transferir Producto"
                  onClick={() => navigate("/almacen/transferencia")}
                >
                  <Redo className="text-auto" />
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-success"
                onClick={() => handleActivarProducto(row.id, row.nombre)}
              >
                <FontAwesomeIcon icon={faPowerOff} />
              </button>
            )}
          </div>
        );
      },
      wrap: true,
      sortable: true,
      ignoreRowClick: true,
      center: true,
    },
    {
      name: "Producto",
      selector: (row) => row.nombre || "No disponible",
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: "Marca",
      selector: (row) => row.marca || "no disponible",
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => {
        const stock = row.cantidad;
        return (
          <div>
            {stock <= 5 ? (
              <>
                <span className="badge bg-danger">{stock}</span>
              </>
            ) : (
              <span className="badge bg-success">{stock}</span>
            )}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Precio Uni",
      selector: (row) => "S/." + row.precioUnit || "No disponible",
      sortable: true,
      wrap: true,
    },
    {
      name: "Medida",
      selector: (row) => row.unidad.nombre || "No disponible",
      sortable: true,
      wrap: true,
    },
    {
      name: "Categoria",
      selector: (row) => row.categoria.nombre || "Categoria no disponible",
      sortable: true,
      wrap: true,
    },
    {
      name: "Proveedor",
      selector: (row) => row.proveedor.nombre || "Proveedor no disponible",
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <div className="h-100">
      <TablasGenerales columnas={columns} datos={filterAlmacen} />
      <ModalRight
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={"Agregar Stock al Producto"}
        hideFooter={true}
      >
        {({ hanldeClose }) => (
          <AlmacenStockAdd
            handleCloseModal={hanldeClose}
            producto={idProductoEdit}
            onAlmacenUpdate={handleAlmacenUpdated}
          />
        )}
      </ModalRight>

      <ModalAlertQuestion
        show={showConfirm}
        idEliminar={activoIdDelete}
        nombre={nombreActivoToDelete}
        tipo={"producto"}
        handleEliminar={handleEliminarProductoSi}
        handleCloseModal={handleCloseModalQuestionEliminar}
      />

      <ModalAlertActivar
        show={showConfirmTrue}
        idActivar={productoIdActivar}
        nombre={nombreActivoToActive}
        tipo="producto"
        handleActivar={handleActivarProductoSi}
        handleCloseModal={handleCloseModalQuestionActivar}
      />

      <ModalRight
        isOpen={modalEditarAlmacen}
        onClose={() => setModalEditarAlmacen(false)}
        title={"Editar Producto de Almacén"}
        width="50%"
        hideFooter
      >
        {({ handleClose }) => (
          <FormularioEditarAlmacen data={dataAlmance} onCancel={handleClose} />
        )}
      </ModalRight>
    </div>
  );
}
