import { useForm } from "react-hook-form";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import RippleWrapper from "../componentesReutilizables/RippleWrapper";
import { FileTextIcon } from "lucide-react";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function FormularioReporte({
  titulo,
  onSubmit,
  isLoading,
  tipo,
  estadoIntegracionGoogle,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="col-lg-4 col-sm-12">
      <div className="card border shadow-sm h-100 p-0">
        <div className="card-header py-2 px-3 border-bottom bg-light">
          <p className="h6 mb-0">{titulo}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body py-3 px-3">
            <input
              type="hidden"
              defaultValue={tipo}
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
                    validate: (value) =>
                      value <= getTodayDate() || "La fecha no puede ser futura",
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
          <div className="card-footer px-3 bg-white border-top d-flex justify-content-end">
            <>
              {estadoIntegracionGoogle?.estado === 1 ? (
                <RippleWrapper className="p-0">
                  <BotonAnimado
                    type="submit"
                    loading={isLoading}
                    className="btn-realizarPedido rounded-none btn-sm px-3 h6 py-2"
                    icon={
                      !isLoading ? <FileTextIcon className="me-1" /> : undefined
                    }
                  >
                    {isLoading ? "Generando..." : "Generar Reporte"}
                  </BotonAnimado>
                </RippleWrapper>
              ) : (
                <small className="text-muted">
                  No disponible, inicie sesión con su cuenta de Google
                </small>
              )}
            </>
          </div>
        </form>
      </div>
    </div>
  );
}
