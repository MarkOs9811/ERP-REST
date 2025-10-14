import { PlusIcon } from "lucide-react";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";

const Categorias = ({ categorias, onToggle }) => {
  const [modalAddMetodoPago, setModalAddCategoria] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSubmitMetodo = async (data) => {
    try {
      const response = await axiosInstance.post("/categorias", {
        nombre: data.nombre,
      });
      if (response.data.success) {
        ToastAlert("success", "Categoria agregado");
        setModalAddCategoria(false);
        reset();
        queryClient.invalidateQueries(["metodosPago"]);
      } else {
        ToastAlert("error", "No se pudo agregar el Categoria");
      }
    } catch (error) {
      ToastAlert("error", "Error al agregar el Categoria");
      console.error("Error al agregar el Categoria:", error);
    }
  };
  return (
    <div className="col-md-12">
      <div className="card shadow-sm border h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <p className="card-title mb-0 h5">Categorías</p>
            <button
              className="btn btn-light"
              title="Agregar Categoría"
              onClick={() => setModalAddCategoria(true)}
            >
              <PlusIcon className="text-auto" />
            </button>
          </div>
          <ul className="list-group border-0 mt-3">
            {categorias.map((cat) => (
              <li
                key={cat.id}
                className="list-group-item border-0 d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{cat.nombre}</h6>
                  <small className="text-muted">
                    <div
                      className={`badge ${
                        cat.estado == 1
                          ? "bg-success text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {cat.estado == 1 ? "Activo" : "Desactivado"}
                    </div>
                  </small>
                </div>
                <div className="form-switch">
                  <input
                    type="checkbox"
                    checked={cat.estado == 1}
                    onChange={() => onToggle(cat.id)}
                    className="form-check-input"
                    id={`categoriaCheck${cat.id}`}
                    style={{
                      width: 40,
                      height: 22,
                      cursor: "pointer",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ModalRight
        isOpen={modalAddMetodoPago}
        onClose={() => setModalAddCategoria(false)}
        title="Agregar Categoria"
        hideFooter={true}
      >
        <div className="card d-flex h-100">
          <form
            className="card-body row g-3"
            onSubmit={handleSubmit(handleSubmitMetodo)}
          >
            <div className="col-12">
              <label className="form-label">Nombre del la categoria</label>
              <input
                type="text"
                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  maxLength: {
                    value: 20,
                    message: "El nombre no debe exceder los 20 caracteres",
                  },
                })}
                placeholder="Ej: Dulces, electrodomesticos."
                autoFocus
              />
              {errors.nombre && (
                <div className="invalid-feedback">{errors.nombre.message}</div>
              )}
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn-guardar">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </ModalRight>
    </div>
  );
};

export default Categorias;
