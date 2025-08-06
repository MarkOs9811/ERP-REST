import { useForm } from "react-hook-form";
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import RippleWrapper from "../componentesReutilizables/RippleWrapper";
import { FileText } from "lucide-react";

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
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="col-lg-4 col-sm-12">
      <div className="card border shadow-sm h-100 p-0">
        <div className="card-header p-3 border-bottom">
          <p className="h5">{titulo}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body">
            <input
              type="hidden"
              defaultValue={tipo}
              {...register("tipo", {
                required: "El tipo de reporte es obligatorio",
              })}
            />
            <div className="row g-3">
              <div className="col-lg-6 col-sm-12">
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    id="fechaInicio"
                    className={`form-control ${
                      errors.fechaInicio ? "is-invalid" : ""
                    }`}
                    {...register("fechaInicio", {
                      required: "La fecha de inicio es obligatoria",
                      validate: (value) =>
                        value <= getTodayDate() ||
                        "La fecha no puede ser futura",
                    })}
                  />
                  <label htmlFor="fechaInicio">Fecha Inicio</label>
                  {errors.fechaInicio && (
                    <div className="invalid-feedback">
                      {errors.fechaInicio.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    id="fechaFin"
                    className={`form-control ${
                      errors.fechaFin ? "is-invalid" : ""
                    }`}
                    {...register("fechaFin", {
                      required: "La fecha de fin es obligatoria",
                      validate: (value) =>
                        value <= getTodayDate() ||
                        "La fecha no puede ser futura",
                    })}
                  />
                  <label htmlFor="fechaFin">Fecha Fin</label>
                  {errors.fechaFin && (
                    <div className="invalid-feedback">
                      {errors.fechaFin.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex m-0 card-footer text-center justify-content-end ">
            <RippleWrapper className={"p-3"}>
              <BotonAnimado
                type="submit"
                loading={isLoading}
                className="btn-realizarPedido w-100 h-100 p-2 h6 ms-auto "
                icon={isLoading ? undefined : <FileText color="auto" />}
              >
                {isLoading ? "Generando..." : "Generar Reporte"}
              </BotonAnimado>
            </RippleWrapper>
          </div>
        </form>
      </div>
    </div>
  );
}
