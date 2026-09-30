import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../../api/AxiosInstance";
import ToastAlert from "../../../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";

export function FormularioBonificacion({
  onClose,
  dataBoni,
  datosToEditar = null,
}) {
  const [loadingSave, setLoadingSave] = useState(false);
  const queryClient = useQueryClient();

  // Esto sigue siendo correcto: dataBoni activa el modo edición
  const isEditMode = Boolean(dataBoni);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    // <-- ¡CAMBIO AQUÍ! Usamos 'datosToEditar' para los valores
    defaultValues: {
      nombre: datosToEditar?.nombre || "",
      descripcion: datosToEditar?.descripcion || "",
      monto: datosToEditar?.monto || 0,
    },
  });

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      let response;
      const toastMessage = isEditMode
        ? "Se actualizó correctamente"
        : "Se registró correctamente";

      if (isEditMode) {
        // <-- ¡CAMBIO AQUÍ! Usamos el ID de 'datosToEditar'
        // ¡Asegúrate de que 'datosToEditar.id_bonificacion' sea el ID correcto!
        response = await axiosInstance.put(
          `/bonificaciones/editar/${datosToEditar.id}`, // <-- ¡Verifica este ID!
          data
        );
      } else {
        response = await axiosInstance.post("/bonificaciones", data);
      }

      if (response.data.success) {
        ToastAlert("success", toastMessage);
        queryClient.invalidateQueries(["bonificaciones"]);
        setLoadingSave(false);
        onClose();
      }
    } catch (error) {
      setLoadingSave(false);
      const errorMessage = error.response?.data?.message || error.message;
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
          type="submit"
          className="btn-guardar"
          title={
            isEditMode ? "Actualizar bonificación" : "Guardar bonificación"
          }
          disabled={loadingSave}
        >
          {loadingSave ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <span>{isEditMode ? "Actualizar" : "Guardar"}</span>
          )}
        </button>
      </div>
    </form>
  );
}
