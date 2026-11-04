import { Controller } from "react-hook-form";
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import { Button } from "../../ui/button";

export function FormularioVacaciones({
  onSubmitVaca,
  handleUsuarioSelect,
  removeUsuario,
  empleadosSeleccionados,
  control,
  errors,
  usuarios,
  isLoadingUsuarios,
  calcularDiasTotales, // Función para calcular los días totales
  onClose,
}) {
  console.log("ERRORES DEL FORMULARIO:", errors);
  return (
    <form id="agregarVacacionesForm" onSubmit={onSubmitVaca}>
      <small className="text-sky-600 dark:text-sky-400">
        Selecciona un empleado
      </small>
      <div className="mb-3">
        <label
          htmlFor="empleado"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Empleado
        </label>
        <select
          className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.empleados ? "border-destructive focus-visible:ring-destructive" : ""}`}
          id="empleado"
          defaultValue=""
          onChange={handleUsuarioSelect}
        >
          <option value="" disabled>
            Seleccione un empleado
          </option>
          {isLoadingUsuarios ? (
            <option>Cargando empleados...</option>
          ) : (
            usuarios?.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {capitalizeFirstLetter(
                  usuario.empleado.persona.nombre.toLowerCase(),
                )}{" "}
                {capitalizeFirstLetter(
                  usuario.empleado.persona.apellidos.toLowerCase(),
                )}
              </option>
            ))
          )}
        </select>

        {errors.empleados && (
          <div className="text-sm text-destructive">
            Debe seleccionar al menos un empleado.
          </div>
        )}
      </div>

      {empleadosSeleccionados?.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {empleadosSeleccionados.map((usuario) => (
            <span
              key={usuario.id}
              className="rounded-full text-xs font-semibold transition-colors flex items-center p-2"
              style={{
                borderRadius: "20px",
                backgroundColor: "#e1f5ff",
                color: "#017c8e",
              }}
            >
              <span className="me-2">
                {capitalizeFirstLetter(
                  usuario.empleado.persona.nombre.toLowerCase(),
                )}{" "}
                {capitalizeFirstLetter(
                  usuario.empleado.persona.apellidos.toLowerCase(),
                )}
              </span>
              <Button
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 size-8 p-0 opacity-70 hover:opacity-100 btn-close-dark ms-2"
                aria-label="Eliminar"
                onClick={() => removeUsuario(usuario.id)}
                style={{ fontSize: "10px" }}
                variant="default"
              ></Button>
            </span>
          ))}
        </div>
      )}

      <div className="mb-3">
        {/* Fecha Inicio */}
        <div className="mb-3">
          <label
            htmlFor="fechaInicio"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Fecha Inicio
          </label>
          <Controller
            name="fechaInicio"
            control={control}
            rules={{ required: "La fecha de inicio es obligatoria" }}
            render={({ field }) => (
              <input
                type="date"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.fechaInicio
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                id="fechaInicio"
                {...field}
              />
            )}
          />

          {errors.fechaInicio && (
            <div className="text-sm text-destructive">
              {errors.fechaInicio.message}
            </div>
          )}
        </div>

        {/* Fecha Fin */}
        <div className="mb-3">
          <label
            htmlFor="fechaFin"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Fecha Fin
          </label>
          <Controller
            name="fechaFin"
            control={control}
            rules={{ required: "La fecha de fin es obligatoria" }}
            render={({ field }) => (
              <input
                type="date"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.fechaFin
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                id="fechaFin"
                {...field}
                onChange={(e) => {
                  field.onChange(e); // Actualizar el valor de fechaFin
                  calcularDiasTotales(); // Calcular los días totales
                }}
              />
            )}
          />

          {errors.fechaFin && (
            <div className="text-sm text-destructive">
              {errors.fechaFin.message}
            </div>
          )}
        </div>

        {/* Días Totales */}
        <div className="mb-3">
          <label
            htmlFor="diasTotales"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Días Totales
          </label>
          <Controller
            name="diasTotales"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                id="diasTotales"
                {...field}
                readOnly
              />
            )}
          />
        </div>

        {/* Observaciones */}
        <div className="mb-3">
          <label
            htmlFor="observaciones"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Observaciones
          </label>
          <Controller
            name="observaciones"
            control={control}
            render={({ field }) => (
              <textarea
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.observaciones
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                id="observaciones"
                {...field}
                placeholder="Observaciones"
                style={{ height: "100px" }}
              ></textarea>
            )}
          />

          {errors.observaciones && (
            <div className="text-sm text-destructive">
              {errors.observaciones.message}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 p-3">
        <Button
          type="button"
          className="btn-cerrar"
          onClick={onClose}
          variant="default"
        >
          Cancelar
        </Button>
        <Button type="submit" className="btn-guardar" variant="default">
          Registrar vacaciones
        </Button>
      </div>
    </form>
  );
}
