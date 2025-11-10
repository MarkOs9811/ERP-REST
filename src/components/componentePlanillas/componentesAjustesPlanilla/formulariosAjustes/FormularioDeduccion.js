import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../../api/AxiosInstance"; // Ajusta esta ruta
import ToastAlert from "../../../componenteToast/ToastAlert"; // Ajusta esta ruta
import { useQueryClient } from "@tanstack/react-query";

export function FormularioDeduccion({ onClose, isEdit, dataEdit = null }) {
  const [loadingSave, setLoadingSave] = useState(false);
  const queryClient = useQueryClient();

  const isEditMood = Boolean(isEdit);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombre: dataEdit?.nombre || "",

      porcentaje: dataEdit ? dataEdit.porcentaje * 100 : 0,
    },
  });

  const porcentajeValue = watch("porcentaje");

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      let response;
      const toastMessage = isEditMood
        ? "Se actualizó correctamente"
        : "Se registró correctamente";

      if (isEditMood) {
        response = await axiosInstance.put(
          `/deducciones/editar/${dataEdit.id}`,
          data
        );
      } else {
        response = await axiosInstance.post("/deducciones", data);
      }

      if (response.data.success) {
        ToastAlert("success", toastMessage);
        queryClient.invalidateQueries(["deducciones"]);
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
      {/* ...el resto de tu JSX está perfecto... */}
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
        <label htmlFor="porcentaje" className="form-label small">
          Porcentaje ({porcentajeValue || 0}%)
        </label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="100"
          step="0.01"
          id="porcentaje"
          {...register("porcentaje", {
            required: "El porcentaje es obligatorio",
            valueAsNumber: true,
            min: {
              value: 0.01,
              message: "El porcentaje debe ser mayor a 0",
            },
            max: {
              value: 100,
              message: "El porcentaje no puede ser mayor a 100",
            },
          })}
        />
        <input
          type="number"
          className={`form-control form-control-sm mt-2 ${
            errors.porcentaje ? "is-invalid" : ""
          }`}
          min="0"
          max="100"
          step="0.01"
          {...register("porcentaje", {
            required: "El porcentaje es obligatorio",
            valueAsNumber: true,
            min: { value: 0.01, message: "El porcentaje debe ser mayor a 0" },
            max: {
              value: 100,
              message: "El porcentaje no puede ser mayor a 100",
            },
          })}
        />
        {errors.porcentaje && (
          <div className="invalid-feedback d-block">
            {errors.porcentaje.message}
          </div>
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
          title={isEditMood ? "Actualizar deducción" : "Guardar deducción"}
          disabled={loadingSave}
        >
          {loadingSave ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <span>{isEditMood ? "Actualizar" : "Guardar"}</span>
          )}
        </button>
      </div>
    </form>
  );
}
