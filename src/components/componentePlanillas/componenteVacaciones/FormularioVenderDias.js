import { capitalizeFirstLetter } from "../../../hooks/FirstLetterUp";

export function FormularioVenderDias({
  onSubmitVender,
  handleSubmit,
  vacacionesId,
  register,
  errors,
}) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  return (
    <form onSubmit={handleSubmit(onSubmitVender)}>
      {/* Mostrar la imagen del usuario */}
      <div className="card d-flex flex-row align-items-center p-3 border mb-3">
        {/* Imagen del usuario */}
        <div className="me-3">
          {vacacionesId.usuario?.fotoPerfil ? (
            <img
              src={`${BASE_URL}/storage/${vacacionesId.usuario.fotoPerfil}`}
              alt="Foto de perfil"
              className="rounded-circle"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                border: "4px solid rgb(194, 194, 194)",
                boxShadow: "0 0 5px rgba(13, 15, 17, 0.5)",
              }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
              style={{ width: "80px", height: "80px" }}
            >
              <p className="text-white mb-0">Sin Foto</p>
            </div>
          )}
        </div>

        {/* Nombre y apellidos */}
        <div className="text-center flex-grow-1">
          <h5 className="mb-1">
            {vacacionesId.usuario?.empleado?.persona?.nombre
              ? capitalizeFirstLetter(
                  vacacionesId.usuario.empleado.persona.nombre.toLowerCase()
                )
              : "Nombre no disponible"}
          </h5>
          <h6 className="text-muted">
            {vacacionesId.usuario?.empleado?.persona?.apellidos
              ? capitalizeFirstLetter(
                  vacacionesId.usuario.empleado.persona.apellidos.toLowerCase()
                )
              : "Apellidos no disponibles"}
          </h6>
          <small className="text-primary fw-bold">
            {vacacionesId.usuario?.empleado?.cargo?.nombre
              ? capitalizeFirstLetter(
                  vacacionesId.usuario.empleado.cargo.nombre.toLowerCase()
                )
              : "Cargo no disponible"}
          </small>
        </div>
      </div>
      <div className="card border p-3 mb-3">
        <div className="flex-grow-1">
          <h6 className="text-muted">
            <span> Dias Totales </span>
            {vacacionesId.dias_totales ? (
              <p className="fw-bold">{vacacionesId.dias_totales}</p>
            ) : (
              "Dias totales no disponibles"
            )}
          </h6>
          <h6 className="text-muted">
            <span> Dias Utilizados </span>
            {vacacionesId.dias_utilizados ? (
              <p className="fw-bold">{vacacionesId.dias_utilizados}</p>
            ) : (
              "Dias totales no disponibles"
            )}
          </h6>
          <h6 className="text-muted">
            <span> Dias Disponibles a vender </span>

            <p className="fw-bold">
              {vacacionesId.dias_totales - vacacionesId.dias_utilizados}
            </p>

            {vacacionesId.dias_totales - vacacionesId.dias_utilizados < 0
              ? "Dias totales no disponibles"
              : ""}
          </h6>
        </div>
      </div>

      {/* Input para los días a vender */}
      <div className="form-floating mb-3">
        <input
          type="number"
          className="form-control"
          id="diasVender"
          placeholder="Días a vender"
          {...register("diasVender", {
            required: "Debe ingresar los días a vender",
            min: { value: 1, message: "Debe vender al menos 1 día" },
          })}
        />
        <label htmlFor="diasVender">Días a vender</label>
        {errors.diasVender && (
          <div className="invalid-feedback">{errors.diasVender.message}</div>
        )}
        <small className="text-muted">
          Los dias a vender no deben superar los dias Totales
        </small>
      </div>

      {/* Botón para confirmar */}
      <button type="submit" className="btn-guardar p-3 w-100">
        Confirmar Venta
      </button>
    </form>
  );
}
