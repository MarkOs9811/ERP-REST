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
        <label className="form-label">Nombre del Cargo</label>
        <input
          type="text"
          className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
          {...register("nombre", {
            required: "Este campo es obligatorio",
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, // solo letras y espacios
              message: "El nombre solo debe contener letras y espacios",
            },
          })}
        />
        {errors.nombre && (
          <div className="invalid-feedback">{errors.nombre.message}</div>
        )}
      </div>

      {/* Salario */}
      <div className="mb-3">
        <label className="form-label">Salario</label>
        <input
          type="text"
          className={`form-control ${errors.salario ? "is-invalid" : ""}`}
          {...register("salario", {
            required: "El salario es obligatorio",
            validate: validatePrecio,
          })}
          onInput={handlePrecioInput}
        />
        {errors.salario && (
          <div className="invalid-feedback">{errors.salario.message}</div>
        )}
      </div>

      {/* Pago por Hora */}
      <div className="mb-3">
        <label className="form-label">Pago por Hora</label>
        <input
          type="text"
          className={`form-control ${errors.pagoPorHoras ? "is-invalid" : ""}`}
          {...register("pagoPorHoras", {
            required: "El pago por hora es obligatorio",
            validate: validatePrecio,
          })}
          onInput={handlePrecioInput}
          readOnly
        />
        {errors.pagoPorHoras && (
          <div className="invalid-feedback">{errors.pagoPorHoras.message}</div>
        )}
      </div>
      {/* Roles */}
      <div className="mb-3 p-3 border rounded">
        <label className="form-label">Selecciona los Roles</label>
        {roles.map((role) => (
          <div className="form-check" key={role.id}>
            <input
              type="checkbox"
              id={`role-${role.id}`}
              value={role.id}
              className="form-check-input "
              {...register("rolerCar", {
                validate: (value) =>
                  (value && value.length > 0) ||
                  "Debes seleccionar al menos un rol",
              })}
            />
            <label
              className="form-check-label mx-2"
              htmlFor={`role-${role.id}`}
            >
              {role.nombre}
            </label>
          </div>
        ))}
        {errors.rolerCar && (
          <div className="invalid-feedback d-block">
            {errors.rolerCar.message}
          </div>
        )}
      </div>
    </form>
  );
}
