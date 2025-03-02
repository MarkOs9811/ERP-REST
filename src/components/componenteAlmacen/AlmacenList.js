import {
  faEdit,
  faPlus,
  faPowerOff,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import { toast } from "react-toastify";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import { Modal } from "react-bootstrap";
import { AlmacenStockAdd } from "./AlmacenStockAdd";
import axiosInstance from "../../api/AxiosInstance";
import customDataTableStyles from "../../css/estilosComponentesTable/DataTableStyles";
import { Cargando } from "../componentesReutilizables/Cargando";
import { ArrowRedoOutline } from "react-ionicons";

export function AlmacenList({ search, updateList }) {
  const [almacen, setAlmacen] = useState([]);
  const [filterAlmacen, setFilteredAlmacen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchAlmacen = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/almacen");
      if (response.data.success) {
        setAlmacen(response.data.data);
        setFilteredAlmacen(response.data.data);
      } else {
        setError("No se pudo obtener los usuarios");
      }
    } catch (err) {
      setError("Hubo un error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlmacen();
  }, [updateList]);

  // FUNCION PARA FILTRAR BUSQEUDA DE DATOS EN ALMACEN
  useEffect(() => {
    const result = almacen.filter((producto) => {
      const { nombre, marca, precioUnit, categoria, unidad, proveedor } =
        producto;

      // Convierte el texto de búsqueda a minúsculas para comparación insensible a mayúsculas
      const searchLower = search.toLowerCase();

      // Filtra los productos basándose en los campos relevantes
      return (
        (marca && marca.toLowerCase().includes(searchLower)) ||
        (nombre && nombre.toLowerCase().includes(searchLower)) ||
        (precioUnit &&
          String(precioUnit).toLowerCase().includes(searchLower)) ||
        (categoria?.nombre &&
          categoria.nombre.toLowerCase().includes(searchLower)) ||
        (unidad?.nombre && unidad.nombre.toLowerCase().includes(searchLower)) ||
        (proveedor?.nombre &&
          proveedor.nombre.toLowerCase().includes(searchLower))
      );
    });

    setFilteredAlmacen(result);
  }, [search, almacen]);

  if (loading) return <Cargando />;
  if (error) return <p>{error}</p>;

  // PARA ACTUALIZAR CUANDO SE HAGA CUALQUIER MOVIMIENTO
  const handleAlmacenUpdated = () => {
    fetchAlmacen();
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
        fetchAlmacen();
        return true;
      } else {
        toast.error("Ocurrió un error al desactivar");
        fetchAlmacen();
        return false;
      }
    } catch (error) {
      toast.error("Error en la conexión");
      fetchAlmacen();
      return false;
    }
  };
  // funcion para activar el producto CON LA API
  const handleActivarProductoSi = async (idActivo) => {
    try {
      const response = await axiosInstance.post(`/almacen/activar/${idActivo}`);
      if (response.data.success) {
        toast.success("Producto activado correctamente");
        fetchAlmacen();
        return true;
      } else {
        toast.error("Ocurrió un error al activar");
        fetchAlmacen();
        return false;
      }
    } catch (error) {
      toast.error("Error en la conexión");
      fetchAlmacen();
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
                <button className=" btn-editar me-2">
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
                >
                  <ArrowRedoOutline color={"auto"} />
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
    <div>
      <DataTable
        className="tablaGeneral"
        columns={columns}
        data={filterAlmacen}
        pagination
        responsive
        dense
        fixedHeader
        customStyles={customDataTableStyles}
        conditionalRowStyles={conditionalRowStyles}
        fixedHeaderScrollHeight="500px"
        striped={true}
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Todos",
        }}
      />

      {/* // modal para agregar stock */}
      <Modal show={isModalOpen} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agrega Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Pasa el producto seleccionado como prop */}
          <AlmacenStockAdd
            handleCloseModal={handleCloseModal}
            producto={idProductoEdit}
            onAlmacenUpdate={handleAlmacenUpdated}
          />
        </Modal.Body>
      </Modal>

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
    </div>
  );
}
