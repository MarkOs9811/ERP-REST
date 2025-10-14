import { useEffect } from "react";
import { validatePrecio } from "../../../hooks/InputHandlers";
import { useQuery } from "@tanstack/react-query";
import { GetRoles } from "../../../service/accionesAreasCargos/GetRoles";

export function AddArea({
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
        <label className="form-label small text-muted">Nombre del Area</label>
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
    </form>
  );
}
