import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../../api/AxiosInstance"; // Ajusta esta ruta
import ToastAlert from "../../../componenteToast/ToastAlert"; // Ajusta esta ruta
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../../ui/button";

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
          data,
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
        <label
          htmlFor="nombre"
          className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
        >
          Nombre (Concepto)
        </label>
        <input
          id="nombre"
          type="text"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("nombre", {
            required: "El nombre es obligatorio",
          })}
        />
        {errors.nombre && (
          <div className="text-sm text-destructive">
            {errors.nombre.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label
          htmlFor="porcentaje"
          className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
        >
          Porcentaje ({porcentajeValue || 0}%)
        </label>
        <input
          type="range"
          className="w-full accent-primary"
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
          className={`w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs mt-2 ${
            errors.porcentaje
              ? "border-destructive focus-visible:ring-destructive"
              : ""
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
          <div className="text-sm text-destructive block">
            {errors.porcentaje.message}
          </div>
        )}
      </div>

      <hr className="my-4" />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          title="Cerrar formulario"
          variant="default"
        >
          Cancelar
        </Button>
        <Button
          type="Submit"
          className="btn-guardar"
          title={isEditMood ? "Actualizar deducción" : "Guardar deducción"}
          disabled={loadingSave}
          variant="default"
        >
          {loadingSave ? (
            <span
              className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 border"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <span>{isEditMood ? "Actualizar" : "Guardar"}</span>
          )}
        </Button>
      </div>
    </form>
  );
}
