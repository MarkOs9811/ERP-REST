import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import axiosInstanceJava from "../../api/AxiosInstanceJava";
import "../../css/estilosComponentePlatos/estilosCategoria.css";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { CategoriaEditar } from "./CategoriaEditar";
import { Modal } from "react-bootstrap";
import { useTooltips } from "../../hooks/UseToolTips";

export function CategoriaList() {
  const [categoria, setCategoria] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoria, setNewCategoria] = useState({ nombre: "" });

  // INICIALIZANDO TOLOLTIPS
  // Obtener las categorías desde la API

  // const getCategorias = async () => {
  //   try {
  //     const response = await axiosInstance.get("gestionPlatos/getCategoria");
  //     if (response.data.data) {
  //       setCategoria(response.data.data);
  //     } else {
  //       console.log("Error al obtener las categorias");
  //     }
  //   } catch (error) {
  //     console.error("Error de conexión", error);
  //   }
  // };

  //   EJEMPLO CONSUMIENDO MI API CREADA CON SPRING BOOT
  const getCategorias = async () => {
    try {
      const response = await axiosInstanceJava.get("/categorias"); // La URL base ya está configurada
      if (response.data.success) {
        const categorias = response.data.data.map((categoria) => ({
          ...categoria,
          estado: parseInt(categoria.estado, 10), // Convertir 'estado' a número
        }));
        setCategoria(categorias);
      } else {
        console.log("Error al obtener las categorías");
      }
    } catch (error) {
      console.error("Error de conexión", error);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  useTooltips(categoria);
  // Filtrar las categorías basadas en la búsqueda
  const filteredCategorias = categoria.filter((cat) =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar el registro de una nueva categoría
  const handleRegisterCategoria = async () => {
    try {
      const response = await axiosInstance.post(
        "/gestionPlatos/registerCategoria",
        newCategoria
      );

      if (response.data.success) {
        setCategoria([...categoria, response.data.data]); // Actualiza la lista con la nueva categoría
        setNewCategoria({ nombre: "" }); // Resetea el formulario
        ToastAlert("success", "Categoría registrada exitosamente");
      } else {
        // Si hay un mensaje específico en la respuesta, lo mostramos
        ToastAlert(
          "error",
          response.data.message || "Error al registrar la categoría"
        );
      }
    } catch (error) {
      // Verifica si el error viene con una respuesta de la API
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          // Errores de validación o datos incorrectos
          ToastAlert(
            "error",
            error.response.data.message ||
              "El nombre de la categoría ya existe."
          );
        } else if (status === 500) {
          // Error interno del servidor
          ToastAlert(
            "error",
            "Ocurrió un error en el servidor. Inténtalo más tarde."
          );
        } else {
          ToastAlert("error", "Ocurrió un error inesperado.");
        }
      } else {
        // Error de conexión u otro problema fuera del control del servidor
        ToastAlert("error", "Error de conexión. Por favor, verifica tu red.");
      }
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [idCategoria, setIdCategoria] = useState(null);
  const [nameCategoria, setNameCategoria] = useState(null);

  const [showConfirmActivar, setShowConfirmActivar] = useState(false);
  const [idCatActive, setIdCatActive] = useState(null);
  const [categoriaToActive, setCategoriaToActive] = useState(null);

  // LLAMANDO FUNCION PARA ELIMINAR UNA CATEGORIA
  const handleEliminarCat = (idCategoria, nombre) => {
    setShowConfirm(true);
    setIdCategoria(idCategoria);
    setNameCategoria(nombre);
  };

  const handleCloseModalQuestionEliminar = () => {
    setShowConfirm(false);
    setIdCategoria(null);
    setNameCategoria(null);
  };

  const handleActivar = (idCategoria, nombre) => {
    setShowConfirmActivar(true);
    setIdCatActive(idCategoria);
    setCategoriaToActive(nombre);
  };

  const handleCloseModalActivar = () => {
    setShowConfirmActivar(false);
    setIdCategoria(null);
    setCategoriaToActive(null);
  };

  const handleEliminarCategoria = async (idCat) => {
    try {
      // Realiza la solicitud POST para cambiar el estado del usuario
      const response = await axiosInstance.get(
        `/gestionPlatos/deleteCategoria/${idCat}`
      );

      if (response.data.success) {
        ToastAlert("success", "Categoria eliminada");
        getCategorias();
        return true;
      } else {
        ToastAlert("error", "Error al eliminar");
        getCategorias();
        return false; // Error al cambiar el estado
      }
    } catch (error) {
      ToastAlert("error", "Error de conexion");
      getCategorias();
      return false; // Error en la conexión
    }
  };

  const handleActivarCategoria = async (idCat) => {
    try {
      const response = await axiosInstance.get(
        `/gestionPlatos/activarCategoria/${idCat}`
      );
      if (response.data.success) {
        ToastAlert("success", response.data.message);
        getCategorias();
        return true;
      } else {
        ToastAlert("error", response.data.message);
        getCategorias();
        return false;
      }
    } catch (error) {
      ToastAlert("error", error.data.message);
      getCategorias();
      return false;
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataCat, setDataCat] = useState(false);

  const handleOpenEditarCat = (data) => {
    setDataCat(data);
    setIsModalOpen(true);
  };

  const handleCloseEditarCat = () => {
    setDataCat(null);
    setIsModalOpen(false);
  };

  const handleCategoriaActualizar = () => {
    getCategorias();
  };

  return (
    <div className="card p-0">
      <div className="card-header d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Categorías</h5>
        {/* Botón para abrir el modal */}
        <button
          className="btn btn-agregar-categoria btn-sm rounded-pill px-2 text-white"
          data-bs-toggle="modal"
          data-bs-target="#modalNuevaCategoria"
        >
          Nuevo <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control rounded-pill ps-4 mx-2"
            placeholder="Buscar categoría..."
            aria-label="Buscar categoría"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="position-absolute end-0 me-4"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          />
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="list-group">
        {filteredCategorias.map((categoria) => (
          <div
            className="d-flex justify-content-between align-items-center borderInferior p-3"
            key={categoria.id}
          >
            <div className="d-flex flex-column justify-content-center">
              <div className="d-flex align-items-center">
                <div
                  className={`rounded-circle ${
                    categoria.estado === 1
                      ? "categoriaActiva"
                      : "categoriaFalse"
                  }`}
                ></div>
                <span>
                  {categoria.nombre.charAt(0).toUpperCase() +
                    categoria.nombre.slice(1)}
                </span>
              </div>
              <span className="badge bg-light text-dark rounded-pill mt-1">
                5 platos
              </span>
            </div>
            <div className="ms-auto">
              <button
                type="button"
                className="btn text-secondary btn-sm me-2"
                onClick={() => handleOpenEditarCat(categoria)}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>

              {categoria.estado === 1 ? (
                // Botón de eliminar si estado es 1
                <button
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Eliminar Categoria"
                  className="btn text-danger btn-sm"
                  onClick={() =>
                    handleEliminarCat(categoria.id, categoria.nombre)
                  }
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              ) : (
                // Botón de activar si estado no es 1
                <button
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Activar Categoria"
                  className="btn text-success btn-sm"
                  onClick={() => handleActivar(categoria.id, categoria.nombre)}
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para agregar nueva categoría */}
      <div
        className="modal fade"
        id="modalNuevaCategoria"
        tabIndex="-1"
        aria-labelledby="modalNuevaCategoriaLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content border-0 ">
            <div className="modal-header">
              <h5 className="modal-title" id="modalNuevaCategoriaLabel">
                Nueva Categoría
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="nombreCategoria"
                  className="form-control"
                  placeholder=" "
                  value={newCategoria.nombre}
                  onChange={(e) =>
                    setNewCategoria({ ...newCategoria, nombre: e.target.value })
                  }
                />
                <label htmlFor="nombreCategoria" className="form-label">
                  Nombre de la categoría
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-cerrar-modal"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-guardar"
                onClick={handleRegisterCategoria}
                data-bs-dismiss="modal"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* // modal para editar un CATEGORIA */}
      <Modal show={isModalOpen} onHide={handleCloseEditarCat} centered>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Pasa handleCloseModal como prop a CATEGORIA */}
          <CategoriaEditar
            handleCloseModal={handleCloseEditarCat}
            dataCategoria={dataCat}
            onCategoriaUpdate={handleCategoriaActualizar}
          />
        </Modal.Body>
      </Modal>

      {/* Modal pregunta de eliminar */}
      <ModalAlertQuestion
        show={showConfirm}
        idEliminar={idCategoria}
        nombre={nameCategoria}
        tipo={"categoria"}
        handleEliminar={handleEliminarCategoria}
        handleCloseModal={handleCloseModalQuestionEliminar}
      />
      <ModalAlertActivar
        show={showConfirmActivar}
        idActivar={idCatActive}
        nombre={categoriaToActive}
        tipo={"categoria"}
        handleActivar={handleActivarCategoria}
        handleCloseModal={handleCloseModalActivar}
      />
    </div>
  );
}
