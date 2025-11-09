import { Controller } from "react-hook-form";
import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";
import { validatePrecio } from "../../../hooks/InputHandlers";

export function FormularioAdelantoSueldo({
  onSubmit,
  handleUsuarioSelect,
  removeUsuario,
  empleadosSeleccionados,
  control,
  errors,
  usuarios,
  isLoadingUsuarios,
  BASE_URL,
  onClose,
}) {
  return (
    <form id="agregarAdelantoSueldoForm" onSubmit={onSubmit}>
      <small className="text-info">Selecciona uno o más empleados</small>
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

      <div className="row g-2">
        <div className="col-md-6 col-sm-12">
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
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="form-floating mb-3">
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
                  className={`form-control ${errors.monto ? "is-invalid" : ""}`}
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
            <label htmlFor="monto" className="form-label">
              Monto
            </label>
            {errors.monto && (
              <div className="invalid-feedback">{errors.monto.message}</div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className="form-floating mb-3">
          <Controller
            name="descripcion"
            control={control}
            rules={{ required: "La descripción es obligatoria" }}
            render={({ field }) => (
              <textarea
                {...field}
                className={`form-control ${
                  errors.descripcion ? "is-invalid" : ""
                }`}
                placeholder="Descripción"
                style={{ height: "100px" }}
              ></textarea>
            )}
          />
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion.message}</div>
          )}
        </div>

        <div className="form-floating mb-3">
          <Controller
            name="documento"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                className="form-control"
                id="documento"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={(e) => {
                  field.onChange(e.target.files); // Pasar el FileList al formulario
                }}
              />
            )}
          />
          <label htmlFor="documento" className="form-label">
            Documento (opcional)
          </label>
        </div>
      </div>
      <div className="d-flex  border-top p-3 gap-2">
        <button type="button" className="btn-cerrar-modal" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn-guardar ">
          Registrar
        </button>
      </div>
    </form>
  );
}
