import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";

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
        className="grid grid-cols-12 gap-3 align-content-start"
        onSubmit={handleSubmit(submitFormulario)}
      >
        <div className="col-span-full">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Nombre del Método
          </label>
          <input
            type="text"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
            <div className="text-sm text-destructive">
              {errors.nombre.message}
            </div>
          )}
        </div>

        <div className="col-span-full flex justify-end items-center gap-2 mt-2">
          <Button
            type="button"
            className="btn-cerrar-modal w-auto px-3"
            onClick={onClose}
            disabled={isLoading}
            variant="default"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-guardar w-auto px-3"
            variant="default"
          >
            {isLoading ? "Guardando..." : "Guardar Método"}
          </Button>
        </div>
      </form>
    </div>
  );
}
