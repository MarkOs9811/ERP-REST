import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axiosInstance from "../../api/AxiosInstance";

import ToastAlert from "../../components/componenteToast/ToastAlert";
import ModalAlertQuestion from "../componenteToast/ModalAlertQuestion";
import ModalAlertActivar from "../componenteToast/ModalAlertActivar";
import { CategoriaEditar } from "./CategoriaEditar";
import { GetCategoriaPlatos } from "../../service/accionesPlatos/GetCategoriaPlatos";
import { useQuery } from "@tanstack/react-query";
import { Cargando } from "../componentesReutilizables/Cargando";
import ModalRight from "../componentesReutilizables/ModalRight";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import {
  BtnEditar,
  BtnEliminar,
} from "../componentesReutilizables/BotonesAccion";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

  // Filtrar las categorías basadas en la búsqueda
  const filteredCategorias = categoriasList.filter((cat) =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Manejar el registro de una nueva categoría
  const handleRegisterCategoria = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/gestionPlatos/registerCategoria",
        { nombre: data.nombre },
      );

      if (response.data.success) {
        ToastAlert("success", "Categoría registrada exitosamente");
        reset();
        setModalAddCategoria(false);
      } else {
        ToastAlert(
          "error",
          response.data.message || "Error al registrar la categoría",
        );
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          ToastAlert(
            "error",
            error.response.data.message ||
              "El nombre de la categoría ya existe.",
          );
        } else if (status === 500) {
          ToastAlert(
            "error",
            "Ocurrió un error en el servidor. Inténtalo más tarde.",
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
        `/gestionPlatos/deleteCategoria/${idCat}`,
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
        `/gestionPlatos/activarCategoria/${idCat}`,
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
    <Card className="p-0 h-full">
      <CardHeader className="border-0 flex justify-between items-center mb-2">
        <h4 className="mb-0">Categorías</h4>
        <div className="flex">
          <Button
            className="bg-foreground text-background shadow-sm hover:bg-foreground/90 inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-xs rounded-full px-2"
            onClick={() => setModalAddCategoria(true)}
            variant="default"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nuevo
          </Button>
        </div>
      </CardHeader>

      {/* Buscador */}
      <div className="mb-3 mx-4">
        <div className="flex w-full items-stretch">
          <input
            type="text"
            className="h-9 w-full border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-full ps-4 mx-2"
            placeholder="Buscar categoría..."
            aria-label="Buscar categoría"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute right-0 me-4"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          />
        </div>
      </div>

      {/* Lista de categorías */}
      <CardContent className="p-3">
        {loadingCategorias ? (
          <div className="text-center p-4">
            <Cargando />
          </div>
        ) : errorCategorias ? (
          <div className="text-center p-4 text-destructive">
            <p>Error al cargar los platos.</p>
          </div>
        ) : (
          filteredCategorias.map((categoria) => (
            <div
              className="flex justify-between items-center borderInferior p-3"
              key={categoria.id}
            >
              <div className="flex flex-col justify-center">
                <div className="flex items-center">
                  <div
                    className={`rounded-full ${
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
              </div>

              <div className="ms-auto">
                <BtnEditar
                  onClick={() => handleOpenEditarCat(categoria)}
                  title="Editar Categoría"
                />

                {categoria.estado == 1 ? (
                  <BtnEliminar
                    onClick={() =>
                      handleEliminarCat(categoria.id, categoria.nombre)
                    }
                    title="Eliminar Categoría"
                  />
                ) : (
                  <Button
                    title="Activar Categoría"
                    className="btn-activar"
                    onClick={() =>
                      handleActivar(categoria.id, categoria.nombre)
                    }
                    variant="default"
                  >
                    <Check size={18} />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>

      {/* Modal para agregar nueva categoría */}
      <ModalRight
        isOpen={modalAddCategoria}
        onClose={() => setModalAddCategoria(false)}
        hideFooter={true}
        title={"Nueva Categoría"}
      >
        {({ handleClose }) => (
          <Card asChild>
            <form
              className="gap-3 border-0 h-full bg-transparent p-3"
              onSubmit={handleSubmit(handleRegisterCategoria)}
            >
              <div className="p-4 mb-3">
                <label
                  htmlFor="nombreCategoria"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  id="nombreCategoria"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                  placeholder="Ej: Bebidas, Postres, etc."
                  autoFocus
                />
                {errors.nombre && (
                  <div className="text-sm text-destructive">
                    {errors.nombre.message}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end border-t p-4 gap-2">
                <Button
                  type="button"
                  className="btn-cerrar-modal"
                  onClick={() => {
                    reset();
                    handleClose();
                  }}
                  variant="default"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="btn-guardar" variant="default">
                  Guardar
                </Button>
              </div>
            </form>
          </Card>
        )}
      </ModalRight>

      {/* // modal para editar un CATEGORIA */}
      <ModalRight
        title={"Editar categoria"}
        isOpen={isModalOpen}
        onClose={handleCloseEditarCat}
        hideFooter={true}
      >
        {({ handleClose }) => (
          <CategoriaEditar
            handleCloseModal={handleClose}
            dataCategoria={dataCat}
            onCategoriaUpdate={handleCategoriaActualizar}
          />
        )}
      </ModalRight>

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
    </Card>
  );
}
