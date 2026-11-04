import { Controller } from "react-hook-form";
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import { validatePrecio } from "../../../hooks/InputHandlers";
import { Button } from "../../ui/button";

export function FormularioAdelantoSueldo({
  onSubmit,
  handleUsuarioSelect,
  removeUsuario,
  empleadosSeleccionados,
  control,
  errors,
  usuarios,
  isLoadingUsuarios,
  onClose,
}) {
  return (
    <form id="agregarAdelantoSueldoForm" onSubmit={onSubmit}>
      <small className="text-sky-600 dark:text-sky-400">
        Selecciona uno o más empleados
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
          {empleadosSeleccionados?.map((usuario) => (
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

      <div className="grid grid-cols-12 gap-2">
        <div className="md:col-span-6 col-span-full">
          <div className="mb-3">
            <label
              htmlFor="fecha"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Fecha
            </label>
            <Controller
              name="fecha"
              control={control}
              rules={{ required: "La fecha es obligatoria" }}
              render={({ field }) => (
                <input
                  type="date"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.fecha ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  id="fechaTrabajar"
                  {...field}
                />
              )}
            />

            {errors.fecha && (
              <div className="text-sm text-destructive">
                {errors.fecha.message}
              </div>
            )}
          </div>
        </div>
        <div className="md:col-span-6 col-span-full">
          <div className="mb-3">
            <label
              htmlFor="monto"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Monto
            </label>
            <Controller
              name="monto"
              control={control}
              rules={{
                required: "El monto es obligatorio",
                validate: validatePrecio, // Validación personalizada
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.monto ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  onInput={(event) => {
                    event.target.value = event.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1"); // Restringir entrada
                    field.onChange(event); // Actualizar el estado del formulario
                  }}
                  placeholder="Monto"
                />
              )}
            />

            {errors.monto && (
              <div className="text-sm text-destructive">
                {errors.monto.message}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className="mb-3">
          <label
            htmlFor="descripcion"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Descripción
          </label>
          <Controller
            name="descripcion"
            control={control}
            rules={{ required: "La descripción es obligatoria" }}
            render={({ field }) => (
              <textarea
                {...field}
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.descripcion
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                placeholder="Descripción"
                style={{ height: "100px" }}
              ></textarea>
            )}
          />

          {errors.descripcion && (
            <div className="text-sm text-destructive">
              {errors.descripcion.message}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label
            htmlFor="documento"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Documento (opcional)
          </label>
          <Controller
            name="documento"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                id="documento"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={(e) => {
                  field.onChange(e.target.files); // Pasar el FileList al formulario
                }}
              />
            )}
          />
        </div>
      </div>
      <div className="flex border-t p-3 gap-2">
        <Button
          type="button"
          className="btn-cerrar"
          onClick={onClose}
          variant="default"
        >
          Cancelar
        </Button>
        <Button type="submit" className="btn-guardar" variant="default">
          Registrar
        </Button>
      </div>
    </form>
  );
}
