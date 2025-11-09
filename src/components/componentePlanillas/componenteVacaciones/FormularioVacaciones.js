import { Controller } from "react-hook-form";
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";

export function FormularioVacaciones({
  onSubmitVaca,
  handleUsuarioSelect,
  removeUsuario,
  empleadosSeleccionados,
  control,
  errors,
  usuarios,
  isLoadingUsuarios,
  BASE_URL,
  calcularDiasTotales, // Función para calcular los días totales
  onClose,
}) {
  console.log("ERRORES DEL FORMULARIO:", errors);
  return (
    <form id="agregarVacacionesForm" onSubmit={onSubmitVaca}>
      <small className="text-info">Selecciona un empleado</small>
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
          {empleadosSeleccionados.map((usuario) => (
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
        {/* Fecha Inicio */}
        <div className="form-floating mb-3">
          <Controller
            name="fechaInicio"
            control={control}
            rules={{ required: "La fecha de inicio es obligatoria" }}
            render={({ field }) => (
              <input
                type="date"
                className={`form-control ${
                  errors.fechaInicio ? "is-invalid" : ""
                }`}
                id="fechaInicio"
                {...field}
              />
            )}
          />
          <label htmlFor="fechaInicio" className="form-label">
            Fecha Inicio
          </label>
          {errors.fechaInicio && (
            <div className="invalid-feedback">{errors.fechaInicio.message}</div>
          )}
        </div>

        {/* Fecha Fin */}
        <div className="form-floating mb-3">
          <Controller
            name="fechaFin"
            control={control}
            rules={{ required: "La fecha de fin es obligatoria" }}
            render={({ field }) => (
              <input
                type="date"
                className={`form-control ${
                  errors.fechaFin ? "is-invalid" : ""
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
          <label htmlFor="fechaFin" className="form-label">
            Fecha Fin
          </label>
          {errors.fechaFin && (
            <div className="invalid-feedback">{errors.fechaFin.message}</div>
          )}
        </div>

        {/* Días Totales */}
        <div className="form-floating mb-3">
          <Controller
            name="diasTotales"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                className="form-control"
                id="diasTotales"
                {...field}
                readOnly
              />
            )}
          />
          <label htmlFor="diasTotales" className="form-label">
            Días Totales
          </label>
        </div>

        {/* Observaciones */}
        <div className="form-floating mb-3">
          <Controller
            name="observaciones"
            control={control}
            render={({ field }) => (
              <textarea
                className={`form-control ${
                  errors.observaciones ? "is-invalid" : ""
                }`}
                id="observaciones"
                {...field}
                placeholder="Observaciones"
                style={{ height: "100px" }}
              ></textarea>
            )}
          />
          <label htmlFor="observaciones" className="form-label">
            Observaciones
          </label>
          {errors.observaciones && (
            <div className="invalid-feedback">
              {errors.observaciones.message}
            </div>
          )}
        </div>
      </div>
      <div className="d-flex gap-2 p-3 border-top">
        <button type="button" className="btn-cerrar-modal" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn-guardar">
          Registrar vacaciones
        </button>
      </div>
    </form>
  );
}
