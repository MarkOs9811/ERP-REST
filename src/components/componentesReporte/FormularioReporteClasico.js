import { useForm } from "react-hook-form";

// Función auxiliar para obtener la fecha de hoy en formato YYYY-MM-DD (hora local)
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function FormularioReporteClasico({
  titulo,
  onSubmit,
  isLoading,
  tipo,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo: tipo,
    },
  });

  return (
    <div className="col-lg-4 col-sm-12">
      <div className="card border shadow-sm h-100 p-0 py-2">
        <div className="card-header py-2 px-3 border-bottom ">
          <p className="h6 mb-0">{titulo}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body py-3 px-3">
            {/* Input oculto */}
            <input
              type="hidden"
              {...register("tipo", {
                required: "El tipo de reporte es obligatorio",
              })}
            />

            <div className="row g-2">
              <div className="col-6">
                <label htmlFor="fechaInicio" className="form-label small mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  className={`form-control form-control-sm ${
                    errors.fechaInicio ? "is-invalid" : ""
                  }`}
                  {...register("fechaInicio", {
                    required: "La fecha de inicio es obligatoria",
                    validate: (value) =>
                      value <= getTodayDate() || "La fecha no puede ser futura",
                  })}
                />
                {errors.fechaInicio && (
                  <div className="invalid-feedback">
                    {errors.fechaInicio.message}
                  </div>
                )}
              </div>

              <div className="col-6">
                <label htmlFor="fechaFin" className="form-label small mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  className={`form-control form-control-sm ${
                    errors.fechaFin ? "is-invalid" : ""
                  }`}
                  {...register("fechaFin", {
                    required: "La fecha de fin es obligatoria",
                    validate: (value, formValues) => {
                      if (value < formValues.fechaInicio) {
                        return "La fecha fin no puede ser anterior a la inicio";
                      }
                      if (value > getTodayDate()) {
                        return "La fecha no puede ser futura";
                      }
                      return true;
                    },
                  })}
                />
                {errors.fechaFin && (
                  <div className="invalid-feedback">
                    {errors.fechaFin.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card-footer bg-transparent border-top d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary px-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Generando...
                </>
              ) : (
                "Generar Reporte"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
