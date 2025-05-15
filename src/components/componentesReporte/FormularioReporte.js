import React from "react";
import { useForm } from "react-hook-form";
import { DocumentTextOutline } from "react-ionicons";
import { Spinner } from "react-bootstrap"; // Usamos un spinner de Bootstrap para el ícono de carga
import BotonAnimado from "../componentesReutilizables/BotonAnimado";
import RippleWrapper from "../componentesReutilizables/RippleWrapper";

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
      <div className="card border shadow-sm">
        <div className="card-header text-center p-3">
          <p className="h5">{titulo}</p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="hidden"
              defaultValue={tipo}
              {...register("tipo", {
                required: "El tipo de reporte es obligatorio",
              })}
            />

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
                    value <= getTodayDate() || "La fecha no puede ser futura",
                })}
              />
              <label htmlFor="fechaInicio">Fecha Inicio</label>
              {errors.fechaInicio && (
                <div className="invalid-feedback">
                  {errors.fechaInicio.message}
                </div>
              )}
            </div>
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
                    value <= getTodayDate() || "La fecha no puede ser futura",
                })}
              />
              <label htmlFor="fechaFin">Fecha Fin</label>
              {errors.fechaFin && (
                <div className="invalid-feedback">
                  {errors.fechaFin.message}
                </div>
              )}
            </div>
            <div className="d-grid w-50 p-3">
              <RippleWrapper className={"p-3"}>
                <BotonAnimado
                  type="submit"
                  loading={isLoading}
                  className="btn-realizarPedido w-100 h-100 p-2 h6"
                  icon={
                    isLoading ? undefined : <DocumentTextOutline color="auto" />
                  }
                >
                  {isLoading ? "Generando..." : "Generar Reporte"}
                </BotonAnimado>
              </RippleWrapper>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
