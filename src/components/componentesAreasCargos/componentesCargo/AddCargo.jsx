import { useEffect } from "react";
import {
  handlePrecioInput,
  validatePrecio,
} from "../../../hooks/InputHandlers";
import { useQuery } from "@tanstack/react-query";
import { GetRoles } from "../../../service/accionesAreasCargos/GetRoles";

export function AddCargo({
  onSubmit,
  errors,
  register,
  watch,
  setValue,
  trigger,
}) {
  const salario = watch("salario");

  const {
    data: roles = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: GetRoles,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (salario && validatePrecio(salario) === true) {
      const pagoHora = Number(salario) / 192; // ejemplo 192 horas/mes
      setValue("pagoPorHoras", pagoHora.toFixed(2), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      if (trigger) trigger("pagoPorHoras"); // para forzar validación si tienes trigger
    } else {
      setValue("pagoPorHoras", "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      if (trigger) trigger("pagoPorHoras");
    }
  }, [salario, setValue, trigger]);

  return (
    <form onSubmit={onSubmit} className="p-3" noValidate>
      {/* Nombre */}
      <div className="mb-3">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Nombre del Cargo
        </label>
        <input
          type="text"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("nombre", {
            required: "Este campo es obligatorio",
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, // solo letras y espacios
              message: "El nombre solo debe contener letras y espacios",
            },
          })}
        />
        {errors.nombre && (
          <div className="text-sm text-destructive">
            {errors.nombre.message}
          </div>
        )}
      </div>

      {/* Salario */}
      <div className="mb-3">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Salario
        </label>
        <input
          type="text"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.salario ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("salario", {
            required: "El salario es obligatorio",
            validate: validatePrecio,
          })}
          onInput={handlePrecioInput}
        />
        {errors.salario && (
          <div className="text-sm text-destructive">
            {errors.salario.message}
          </div>
        )}
      </div>

      {/* Pago por Hora */}
      <div className="mb-3">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Pago por Hora
        </label>
        <input
          type="text"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.pagoPorHoras ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("pagoPorHoras", {
            required: "El pago por hora es obligatorio",
            validate: validatePrecio,
          })}
          onInput={handlePrecioInput}
          readOnly
        />
        {errors.pagoPorHoras && (
          <div className="text-sm text-destructive">
            {errors.pagoPorHoras.message}
          </div>
        )}
      </div>
      {/* Roles */}
      <div className="mb-3 p-3 rounded">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Selecciona los Roles
        </label>
        <div className="relative w-full text-sm rounded-md border-border bg-secondary p-4 text-secondary-foreground flex flex-col">
          <small>Recuerde que no todos los modulos estan disponibles.</small>
          <small>Están sujetos al plan de su empresa.</small>
        </div>

        {roles.map((role) => (
          <div className="flex items-center gap-2" key={role.id}>
            <input
              type="checkbox"
              id={`role-${role.id}`}
              value={role.id}
              className="size-4 shrink-0 rounded border-input accent-primary"
              {...register("rolerCar", {
                validate: (value) =>
                  (value && value.length > 0) ||
                  "Debes seleccionar al menos un rol",
              })}
            />
            <label
              className="text-sm font-medium mx-2"
              htmlFor={`role-${role.id}`}
            >
              {role.nombre}
            </label>
          </div>
        ))}
        {errors.rolerCar && (
          <div className="text-sm text-destructive block">
            {errors.rolerCar.message}
          </div>
        )}
      </div>
    </form>
  );
}
