import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import "../../css/estilosComponentePlatos/estilosCategoria.css";
import ToastAlert from "../../components/componenteToast/ToastAlert";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { CategoriaEditar } from "./CategoriaEditar";
import { Modal } from "react-bootstrap";
import { useTooltips } from "../../hooks/UseToolTips";
import { GetCategoriaPlatos } from "../../service/accionesPlatos/GetCategoriaPlatos";
import { useQuery } from "@tanstack/react-query";
import { Cargando } from "../componentesReutilizables/Cargando";
import ModalRight from "../componentesReutilizables/ModalRight";
import { useForm } from "react-hook-form";

export function CategoriaList() {
  const [categoria, setCategoria] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAddCategoria, setModalAddCategoria] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const {
    data: categoriasList = [],
    isLoading: loadingCategorias,
    isError: errorCategorias,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: GetCategoriaPlatos,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useTooltips(categoria);

  // Filtrar las categorías basadas en la búsqueda
  const filteredCategorias = categoriasList.filter((cat) =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar el registro de una nueva categoría
  const handleRegisterCategoria = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/gestionPlatos/registerCategoria",
        { nombre: data.nombre }
      );

      if (response.data.success) {
        ToastAlert("success", "Categoría registrada exitosamente");
        reset();
        setModalAddCategoria(false);
      } else {
        ToastAlert(
          "error",
          response.data.message || "Error al registrar la categoría"
        );
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          ToastAlert(
            "error",
            error.response.data.message ||
              "El nombre de la categoría ya existe."
          );
        } else if (status === 500) {
          ToastAlert(
            "error",
            "Ocurrió un error en el servidor. Inténtalo más tarde."
          );
        } else {
          ToastAlert("error", "Ocurrió un error inesperado.");
        }
      } else {
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
      const response = await axiosInstance.get(
        `/gestionPlatos/deleteCategoria/${idCat}`
      );

      if (response.data.success) {
        ToastAlert("success", "Categoria eliminada");
        return true;
      } else {
        ToastAlert("error", "Error al eliminar");
        return false;
      }
    } catch (error) {
      ToastAlert("error", "Error de conexion");
      return false;
    }
  };

  const handleActivarCategoria = async (idCat) => {
    try {
      const response = await axiosInstance.get(
        `/gestionPlatos/activarCategoria/${idCat}`
      );
      if (response.data.success) {
        ToastAlert("success", response.data.message);
        return true;
      } else {
        ToastAlert("error", response.data.message);
        return false;
      }
    } catch (error) {
      ToastAlert("error", error.data.message);
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
    // getCategorias();
  };

  return (
    <div className="card p-0 shadow-sm h-100">
      <div className="card-header d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Categorías</h5>
        <button
          className="btn btn-agregar-categoria btn-sm rounded-pill px-2 text-white"
          onClick={() => setModalAddCategoria(true)}
        >
          Nuevo <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-3 mx-4">
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
      <div className="list-group card-body p-3">
        {loadingCategorias ? (
          <div className="text-center p-4">
            <Cargando />
          </div>
        ) : errorCategorias ? (
          <div className="text-center p-4 text-danger">
            <p>Error al cargar los platos.</p>
          </div>
        ) : (
          filteredCategorias.map((categoria) => (
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
                  <span className="ms-2">
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
                  <button
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Activar Categoria"
                    className="btn text-success btn-sm"
                    onClick={() =>
                      handleActivar(categoria.id, categoria.nombre)
                    }
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para agregar nueva categoría */}
      <ModalRight
        isOpen={modalAddCategoria}
        onClose={() => setModalAddCategoria(false)}
        hideFooter={true}
        title={"Nueva Categoría"}
      >
        <form
          className="card gap-3 border-0 h-100"
          onSubmit={handleSubmit(handleRegisterCategoria)}
        >
          <div className="modal-body mb-3">
            <label htmlFor="nombreCategoria" className="form-label">
              Nombre de la categoría
            </label>
            <input
              type="text"
              id="nombreCategoria"
              className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
              {...register("nombre", { required: "El nombre es obligatorio" })}
              placeholder="Ej: Bebidas, Postres, etc."
              autoFocus
            />
            {errors.nombre && (
              <div className="invalid-feedback">{errors.nombre.message}</div>
            )}
          </div>
          <div className="modal-footer gap-2 ">
            <button
              type="button"
              className="btn-cerrar-modal"
              onClick={() => {
                reset();
                setModalAddCategoria(false);
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              Guardar
            </button>
          </div>
        </form>
      </ModalRight>

      {/* // modal para editar un CATEGORIA */}
      <Modal show={isModalOpen} onHide={handleCloseEditarCat} centered>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
