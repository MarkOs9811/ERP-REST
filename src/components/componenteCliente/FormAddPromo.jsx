import { useForm } from "react-hook-form";

export function FormAddPromo({ formId, onSubmitHandler }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo: "cupon",
      estado: true,
    },
  });

  const tipoCampana = watch("tipo");

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="grid grid-cols-12 gap-3">
        {/* Fila 1: Nombre y Tipo */}
        <div className="col-span-full md:col-span-8">
          <label className="text-sm font-bold">Nombre de Campaña</label>
          <input
            type="text"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("nombre", { required: "El nombre es obligatorio" })}
            placeholder="Ej. Promo Verano"
          />
          {errors.nombre && (
            <span className="text-destructive text-sm">
              {errors.nombre.message}
            </span>
          )}
        </div>
        <div className="col-span-full md:col-span-4">
          <label className="text-sm font-bold">Tipo</label>
          <select
            className="h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register("tipo")}
          >
            <option value="cupon">Cupón</option>
            {/* Opciones futuras */}
            <option value="puntos" disabled>
              Puntos (Próximamente)
            </option>
          </select>
        </div>

        {/* Fila 2: Configuración del Cupón */}
        {tipoCampana === "cupon" && (
          <>
            <div className="col-span-full md:col-span-4">
              <label className="text-sm font-bold">Código</label>
              <input
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 uppercase ${errors.codigo_cupon ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("codigo_cupon", { required: "Código requerido" })}
                placeholder="VERANO20"
              />
            </div>
            <div className="col-span-full md:col-span-4">
              <label className="text-sm font-bold">Tipo Descuento</label>
              <select
                className="h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register("tipo_descuento")}
              >
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="monto_fijo">Monto Fijo (S/)</option>
              </select>
            </div>
            <div className="col-span-full md:col-span-4">
              <label className="text-sm font-bold">Valor</label>
              <input
                type="number"
                step="0.01"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.valor_descuento ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("valor_descuento", { required: true, min: 0.1 })}
                placeholder="0.00"
              />
            </div>
          </>
        )}

        {/* Fila 3: Límites de la Campaña (NUEVO) */}
        <div className="col-span-full md:col-span-6">
          <label className="text-sm font-bold">Monto Mínimo Compra (S/)</label>
          <input
            type="number"
            step="0.01"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.monto_minimo_compra ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("monto_minimo_compra", {
              min: { value: 0, message: "No puede ser negativo" },
            })}
            placeholder="Opcional. Ej: 50.00"
          />
          {errors.monto_minimo_compra && (
            <span className="text-destructive text-sm">
              {errors.monto_minimo_compra.message}
            </span>
          )}
        </div>
        <div className="col-span-full md:col-span-6">
          <label className="text-sm font-bold">Límite de Usos Totales</label>
          <input
            type="number"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.limite_uso ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("limite_uso", {
              min: { value: 1, message: "Mínimo 1 uso" },
            })}
            placeholder="Opcional. Ej: 100"
          />
          {errors.limite_uso && (
            <span className="text-destructive text-sm">
              {errors.limite_uso.message}
            </span>
          )}
        </div>

        {/* Fila 4: Vigencia */}
        <div className="col-span-full md:col-span-6">
          <label className="text-sm font-bold">Fecha Inicio</label>
          <input
            type="date"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.fecha_inicio ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("fecha_inicio", { required: true })}
          />
        </div>
        <div className="col-span-full md:col-span-6">
          <label className="text-sm font-bold">Fecha Fin</label>
          <input
            type="date"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.fecha_fin ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("fecha_fin", { required: true })}
          />
        </div>
      </div>
    </form>
  );
}
