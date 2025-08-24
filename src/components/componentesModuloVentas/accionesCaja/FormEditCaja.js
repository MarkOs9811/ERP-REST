// FormAddCaja.jsx
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { GetSedes } from "../../../service/accionesAreasCargos/GetSedes";

export function FormEditCaja({ onSubmit, register, errors, data, setValue }) {
  const {
    data: sedes = [],
    isLoading: loadingSedes,
    error: errorSedes,
  } = useQuery({
    queryKey: ["sedes"],
    queryFn: GetSedes,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (data && sedes.length > 0) {
      setValue("nombreCaja", data?.nombreCaja || "");
      // Busca la sede en la lista de sedes y selecciona su id
      const sedeId = data?.sedes?.id || "";
      setValue("sedes", sedeId);
    }
  }, [data, sedes, setValue]);

  return (
    <form onSubmit={onSubmit}>
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
      <div>
        <label className="form-label small text-muted">Sede</label>
        <select
          className={`form-select ${errors.sede ? "is-invalid" : ""}`}
          {...register("sedes", {
            required: "Seleccione una sede",
          })}
        >
          <option value="">Seleccione una sede...</option>
          {loadingSedes ? (
            <option value="">Cargando sedes...</option>
          ) : errorSedes ? (
            <option value="">Error al cargar sedes</option>
          ) : (
            sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre}
              </option>
            ))
          )}
        </select>
        {errors.sede && (
          <div className="invalid-feedback">{errors.sede.message}</div>
        )}
      </div>
    </form>
  );
}
