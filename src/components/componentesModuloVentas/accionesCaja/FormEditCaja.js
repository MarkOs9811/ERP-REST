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
        <label className="form-label small text-muted">Nombre de la caja</label>
        <input
          type="text"
          className={`form-control ${errors.nombreCaja ? "is-invalid" : ""}`}
          {...register("nombreCaja", {
            required: "Este campo es obligatorio",
            pattern: {
              value: /^[a-zA-Z0-9\s]+$/,
              message: "Solo se permiten letras y números",
            },
          })}
        />
        {errors.nombreCaja && (
          <div className="invalid-feedback">{errors.nombreCaja.message}</div>
        )}
      </div>
    </form>
  );
}
