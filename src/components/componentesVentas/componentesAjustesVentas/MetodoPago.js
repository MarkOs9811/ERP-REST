import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import ModalRight from "../../componentesReutilizables/ModalRight";
import { useForm } from "react-hook-form";
import ToastAlert from "../../componenteToast/ToastAlert";
import axiosInstance from "../../../api/AxiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import ModalAlertQuestion from "../../componenteToast/ModalAlertQuestion";

const MetodoPago = ({ metodos, onToggle }) => {
  const [modalAddMetodoPago, setModalAddMetodoPago] = useState(false);
  const queryClient = useQueryClient();

  const [metodoQuestion, setModalQuestion] = useState(false);
  const [dataMetodo, setDataMetodo] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSubmitMetodo = async (data) => {
    try {
      const response = await axiosInstance.post("/metodos-pagos", {
        nombre: data.nombre,
      });
      if (response.data.success) {
        ToastAlert("success", "Método de pago agregado");
        setModalAddMetodoPago(false);
        reset();
        queryClient.invalidateQueries(["metodosPago"]);
      } else {
        ToastAlert("error", "No se pudo agregar el método de pago");
      }
    } catch (error) {
      ToastAlert("error", "Error al agregar el método de pago");
      console.error("Error al agregar el método de pago:", error);
    }
  };

  // METODO PAR ELIMINAR EL METODO

  const handleEliminarMetodo = async (id) => {
    try {
      const response = await axiosInstance.delete(`/metodos-pagos/${id}`);
      queryClient.invalidateQueries(["metodosPago"]);
      ToastAlert("success", response.data.message);
      return true;
    } catch (error) {
      const responseError = error.response?.data?.message || error.message;
      ToastAlert("error", "Error al eliminar el método: " + responseError);
      return false;
    }
  };
  return (
    <div className="col-md-4">
      <div className="card shadow-sm border">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="card-title mb-0 fw-bold">Métodos de Pago</h6>
            <button
              className="btn btn-light btn-sm"
              title="Agregar Método"
              onClick={() => setModalAddMetodoPago(true)}
            >
              <Plus className="text-auto" />
            </button>
          </div>
          <ul className="list-unstyled mt-3">
            {metodos.map((metodo) => (
              <li
                key={metodo.id}
                className="d-flex align-items-center justify-content-between mb-3 py-2 px-2 rounded bg-light"
              >
                <div>
                  <h6 className="mb-1">{metodo.nombre}</h6>
                  <small className="text-muted">Nº {metodo.id}</small>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn-eliminar rounded-5 "
                    onClick={() => {
                      setModalQuestion(true);
                      setDataMetodo(metodo);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                  <div
                    className="form-check form-switch m-0"
                    style={{ minWidth: 40 }}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`switch-metodo-${metodo.id}`}
                      checked={metodo.estado == 1}
                      onChange={() => onToggle(metodo.id)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ModalRight
        isOpen={modalAddMetodoPago}
        onClose={() => setModalAddMetodoPago(false)}
        title="Agregar Método de Pago"
        hideFooter={true}
      >
        <div className="card d-flex h-100 bg-transparent">
          <form
            className="card-body row g-3"
            onSubmit={handleSubmit(handleSubmitMetodo)}
          >
            <div className="col-12">
              <label className="form-label">Nombre del Método</label>
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
                placeholder="Ej: Efectivo, Tarjeta, etc."
                autoFocus
              />
              {errors.nombre && (
                <div className="invalid-feedback">{errors.nombre.message}</div>
              )}
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn-guardar">
                Guardar Método
              </button>
            </div>
          </form>
        </div>
      </ModalRight>

      <ModalAlertQuestion
        show={metodoQuestion}
        idEliminar={dataMetodo.id}
        nombre={dataMetodo.nombre}
        handleEliminar={handleEliminarMetodo}
        handleCloseModal={() => setModalQuestion(false)}
        tipo={"Metodo"}
        pregunta="¿Estás seguro de eliminar este"
      />
    </div>
  );
};

export default MetodoPago;
