import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../../api/AxiosInstance";
import ToastAlert from "../../../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";

export function FormularioAddBonificaciones({ onClose }) {
  const [loadingSave, setLoadingSave] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange", // Validación en tiempo real
    defaultValues: {
      nombre: "",
      descripcion: "",
      monto: 0,
    },
  });

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      const response = await axiosInstance.post("/bonificaciones", data);
      if (response.data.success) {
        ToastAlert("success", "Se registro correctamente");
        queryClient.invalidateQueries(["bonificaciones"]);
        setLoadingSave(false);
        onClose();
      }
    } catch (error) {
      setLoadingSave(false);
      const errorMessage = error.response?.data?.message || error.message;

      // Mostramos el error que venga, sea cual sea
      ToastAlert("error", errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label small">
          Nombre (Concepto)
        </label>
        <input
          id="nombre"
          type="text"
          className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
          {...register("nombre", {
            required: "El nombre es obligatorio",
          })}
        />
        {errors.nombre && (
          <div className="invalid-feedback">{errors.nombre.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label small">
          Descripción
        </label>
        <input
          id="descripcion"
          type="text"
          className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
          {...register("descripcion", {
            required: "La descripción es obligatoria",
          })}
        />
        {errors.descripcion && (
          <div className="invalid-feedback">{errors.descripcion.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="monto" className="form-label small">
          Monto
        </label>
        <input
          id="monto"
          type="number"
          step="0.01"
          className={`form-control ${errors.monto ? "is-invalid" : ""}`}
          {...register("monto", {
            required: "El monto es obligatorio",
            valueAsNumber: true,
            min: {
              value: 0.01,
              message: "El monto debe ser mayor a 0",
            },
          })}
        />
        {errors.monto && (
          <div className="invalid-feedback">{errors.monto.message}</div>
        )}
      </div>

      <hr className="my-4" />

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          title="Cerrar formulario"
        >
          Cancelar
        </button>
        <button
          type="Submit"
          className="btn-guardar"
          title="Guardar bonificación"
          disabled={loadingSave}
        >
          {loadingSave ? <span className="load"></span> : <span>Guardar</span>}
        </button>
      </div>
    </form>
  );
}
