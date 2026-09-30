import React from "react";
import { Briefcase, Calendar, Clock } from "lucide-react";

export function Paso2Laborales({
  register,
  errors,
  setValue,
  contratoList,
  areasList,
  cargosList,
  horariosList,
}) {
  const handleCargoChange = (event) => {
    const selected = event.target.selectedOptions[0];
    const salario = selected.dataset.salario;
    const pagoPorHora = (parseFloat(salario) / 30 / 8).toFixed(2);
    setValue("salario", salario);
    setValue("pagoPorHora", pagoPorHora);
  };

  return (
    <div className="card p-4 border">
      <h5 className="mb-4" style={{ color: "#15669c" }}>
        Paso 2: Detalles del contrato
      </h5>

      <div className="mb-3">
        <label className="form-label small fw-semi-bold text-muted">
          <Briefcase size={16} className="me-1" /> Tipo Contrato
        </label>
        <select
          className={`form-select ${errors.contrato ? "is-invalid" : ""}`}
          {...register("contrato", { required: "Requerido" })}
        >
          <option value="">Seleccione...</option>
          {contratoList?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        {errors.contrato && (
          <div className="invalid-feedback">{errors.contrato.message}</div>
        )}
      </div>

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label small fw-semi-bold text-muted">
            <Calendar size={16} className="me-1" /> Inicio Contrato
          </label>
          <input
            className={`form-control ${errors.fecha_contrato ? "is-invalid" : ""}`}
            type="date"
            {...register("fecha_contrato", { required: "Requerido" })}
          />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label small fw-semi-bold text-muted">
            <Calendar size={16} className="me-1" /> Fin Contrato
          </label>
          <input
            className={`form-control ${errors.fecha_fin_contrato ? "is-invalid" : ""}`}
            type="date"
            {...register("fecha_fin_contrato", { required: "Requerido" })}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semi-bold text-muted">
          <Briefcase size={16} className="me-1" /> Área
        </label>
        <select
          className={`form-select ${errors.area ? "is-invalid" : ""}`}
          {...register("area", { required: "Requerido" })}
        >
          <option value="">Seleccione...</option>
          {areasList?.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label small fw-semi-bold text-muted">
            <Briefcase size={16} className="me-1" /> Cargo
          </label>
          <select
            className={`form-select ${errors.cargo ? "is-invalid" : ""}`}
            {...register("cargo", { required: "Requerido" })}
            onChange={handleCargoChange}
          >
            <option value="">Seleccione...</option>
            {cargosList?.map((c) => (
              <option key={c.id} value={c.id} data-salario={c.salario}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 mb-3">
          <label className="form-label small fw-semi-bold text-muted">
            <Clock size={16} className="me-1" /> Horario
          </label>
          <select
            className={`form-select ${errors.horario ? "is-invalid" : ""}`}
            {...register("horario", { required: "Requerido" })}
          >
            <option value="">Seleccione...</option>
            {horariosList?.map((h) => (
              <option key={h.id} value={h.id}>
                {h.horaEntrada} - {h.horaSalida}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-6">
          <label className="form-label small fw-semi-bold text-muted">
            S/. Salario base
          </label>
          <input
            className="form-control bg-light"
            placeholder="Salario base"
            {...register("salario")}
            readOnly
          />
        </div>
        <div className="col-6">
          <label className="form-label small fw-semi-bold text-muted">
            S/. Pago por Hora
          </label>
          <input
            className="form-control bg-light"
            placeholder="Pago por Hora"
            {...register("pagoPorHora")}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
