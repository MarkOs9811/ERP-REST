import { Controller } from "react-hook-form";
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";

export function FormularioAddHorasExtras({
  onSubmit,
  handleUsuarioSelect,
  removeUsuario,
  empleadosSeleccionados,
  control,
  errors,
  usuarios,
  isLoadingUsuarios,
  BASE_URL,
}) {
  return (
    <form id="agregarHorasExtrasForm" onSubmit={onSubmit}>
      <small className="text-info">Selecciona uno o mas empleados</small>
      <div className="form-floating mb-3">
        <select
          className={`form-select ${errors.empleados ? "is-invalid" : ""}`}
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
                  usuario.empleado.persona.nombre.toLowerCase()
                )}{" "}
                {capitalizeFirstLetter(
                  usuario.empleado.persona.apellidos.toLowerCase()
                )}
              </option>
            ))
          )}
        </select>
        <label htmlFor="empleado" className="form-label">
          Empleado
        </label>
        {errors.empleados && (
          <div className="invalid-feedback">
            Debe seleccionar al menos un empleado.
          </div>
        )}
      </div>

      {empleadosSeleccionados?.length > 0 && (
        <div className="mb-3 d-flex flex-wrap gap-2">
          {empleadosSeleccionados?.map((usuario) => (
            <span
              key={usuario.id}
              className="badge d-flex align-items-center p-2"
              style={{
                borderRadius: "20px",
                backgroundColor: "#e1f5ff",
                color: "#017c8e",
              }}
            >
              <img
                src={
                  `${BASE_URL}/storage/${usuario.fotoPerfil}` ||
                  "/default-avatar.png"
                }
                alt="Foto del empleado"
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px" }}
              />
              <span className="me-2">
                {capitalizeFirstLetter(
                  usuario.empleado.persona.nombre.toLowerCase()
                )}{" "}
                {capitalizeFirstLetter(
                  usuario.empleado.persona.apellidos.toLowerCase()
                )}
              </span>
              <button
                type="button"
                className="btn-close btn-close-dark ms-2"
                aria-label="Eliminar"
                onClick={() => removeUsuario(usuario.id)}
                style={{ fontSize: "10px" }}
              ></button>
            </span>
          ))}
        </div>
      )}

      <div className="mb-3">
        <div className="form-floating mb-3">
          <Controller
            name="fecha"
            control={control}
            rules={{ required: "La fecha es obligatoria" }}
            render={({ field }) => (
              <input
                type="date"
                className={`form-control ${errors.fecha ? "is-invalid" : ""}`}
                id="fechaTrabajar"
                {...field}
              />
            )}
          />
          <label htmlFor="fecha" className="form-label">
            Fecha
          </label>
          {errors.fecha && (
            <div className="invalid-feedback">{errors.fecha.message}</div>
          )}
        </div>
        <div className="form-floating mb-3">
          <Controller
            name="horas_trabajadas"
            control={control}
            rules={{
              required: "Las horas trabajadas son obligatorias",
              min: { value: 1, message: "Debe ingresar al menos 1 hora" },
            }}
            render={({ field }) => (
              <input
                type="number"
                className={`form-control ${
                  errors.horas_trabajadas ? "is-invalid" : ""
                }`}
                id="horas_trabajadas"
                {...field}
              />
            )}
          />
          <label htmlFor="horas_trabajadas" className="form-label">
            Horas por Trabajar
          </label>
          {errors.horas_trabajadas && (
            <div className="invalid-feedback">
              {errors.horas_trabajadas.message}
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="btn-guardar p-3">
        Registrar
      </button>
    </form>
  );
}
