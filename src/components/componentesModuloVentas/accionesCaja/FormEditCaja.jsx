import { useEffect } from "react";

export function FormEditCaja({ onSubmit, register, errors, data, setValue }) {
  // PONER POR DEFECTO EL NOMBRE DE LA CAJA EN EL INPUT CUANDO SE ABRE EL MODAL DE EDITAR CAJA
  useEffect(() => {
    if (data) {
      setValue("nombreCaja", data.nombreCaja);
    }
  }, [data, setValue]);

  return (
    <form onSubmit={onSubmit} className="p-3">
      <div className="mb-3">
        <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-muted-foreground">
          Nombre de la caja
        </label>
        <input
          type="text"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombreCaja ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("nombreCaja", {
            required: "Este campo es obligatorio",
            pattern: {
              value: /^[a-zA-Z0-9\s]+$/,
              message: "Solo se permiten letras y números",
            },
          })}
        />
        {errors.nombreCaja && (
          <div className="text-sm text-destructive">
            {errors.nombreCaja.message}
          </div>
        )}
      </div>
    </form>
  );
}
