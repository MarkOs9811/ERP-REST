import React from "react";
import { useForm } from "react-hook-form";
import { DocumentTextOutline } from "react-ionicons";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function FormularioReporte({ titulo, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="col-lg-4 col-sm-12">
      <div className="card border shadow-sm">
        <div className="card-header text-center p-3 ">
          <p className="h5">{titulo}</p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className="d-grid">
              <button type="submit" className="btn-guardar">
                <DocumentTextOutline color={"auto"} /> Generar Reporte
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
