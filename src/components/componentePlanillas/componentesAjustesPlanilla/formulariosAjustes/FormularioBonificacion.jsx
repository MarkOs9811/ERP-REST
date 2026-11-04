import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../../api/AxiosInstance";
import ToastAlert from "../../../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../../ui/button";

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
          data,
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
          htmlFor="descripcion"
          className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
        >
          Descripción
        </label>
        <input
          id="descripcion"
          type="text"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.descripcion ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("descripcion", {
            required: "La descripción es obligatoria",
          })}
        />
        {errors.descripcion && (
          <div className="text-sm text-destructive">
            {errors.descripcion.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label
          htmlFor="monto"
          className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
        >
          Monto
        </label>
        <input
          id="monto"
          type="number"
          step="0.01"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.monto ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
          <div className="text-sm text-destructive">{errors.monto.message}</div>
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
          type="submit"
          className="btn-guardar"
          title={
            isEditMode ? "Actualizar bonificación" : "Guardar bonificación"
          }
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
            <span>{isEditMode ? "Actualizar" : "Guardar"}</span>
          )}
        </Button>
      </div>
    </form>
  );
}
