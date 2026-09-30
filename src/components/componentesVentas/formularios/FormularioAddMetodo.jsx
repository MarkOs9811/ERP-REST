import { useForm } from "react-hook-form";

export function FormularioAddMetodo({ onClose, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombre: "",
    },
  });

  const submitFormulario = async (data) => {
    if (!onSubmit) return;
    const creado = await onSubmit(data);
    if (creado) {
      reset();
    }
  };

  return (
    <div className="p-3 bg-transparent">
      <form
        className="row g-3 align-content-start"
        onSubmit={handleSubmit(submitFormulario)}
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
          />
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre.message}</div>
          )}
        </div>

        <div className="col-12 d-flex justify-content-end align-items-center gap-2 mt-2">
          <button
            type="button"
            className="btn-cerrar-modal w-auto px-3"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-guardar w-auto px-3">
            {isLoading ? "Guardando..." : "Guardar Método"}
          </button>
        </div>
      </form>
    </div>
  );
}
