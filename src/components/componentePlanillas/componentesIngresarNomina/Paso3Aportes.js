import React from "react";
import { CondicionCarga } from "../../componentesReutilizables/CondicionCarga";

export function Paso3Aportes({
  register,
  deduccionesList,
  loadingDeducciones,
  errorDeducciones,
  bonificacionesList,
  loadingDBonificaciones,
  errorBonificaciones,
}) {
  return (
    <div className="card p-4 border">
      <h5 className="mb-4" style={{ color: "#15669c" }}>
        Paso 3: Aportes, Deducciones y Bonificaciones
      </h5>
      <div className="row">
        <CondicionCarga
          isLoading={loadingDeducciones}
          isError={errorDeducciones}
        >
          <div className="col-md-6 mb-4">
            <label className="fw-bold mb-3 border-bottom pb-2 d-block">
              Deducciones
            </label>
            {deduccionesList?.map((d) => {
              const isEssalud = d.nombre === "ESSALUD";
              return (
                <div className="form-check mb-2" key={d.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={d.id}
                    {...register("deducciones")}
                    id={`deduccion_${d.id}`}
                    onChange={(e) => {
                      const checkboxes = document.querySelectorAll(
                        'input.form-check-input[type="checkbox"][data-group="deducciones"]',
                      );
                      if (!isEssalud) {
                        checkboxes.forEach((cb) => {
                          if (
                            cb !== e.target &&
                            cb.dataset.nombre !== "ESSALUD"
                          ) {
                            cb.checked = false;
                          }
                        });
                      }
                    }}
                    data-group="deducciones"
                    data-nombre={d.nombre}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`deduccion_${d.id}`}
                  >
                    {d.nombre}
                  </label>
                </div>
              );
            })}
          </div>
        </CondicionCarga>

        <CondicionCarga
          isLoading={loadingDBonificaciones}
          isError={errorBonificaciones}
        >
          <div className="col-md-6 mb-4">
            <label className="fw-bold mb-3 border-bottom pb-2 d-block">
              Bonificación
            </label>
            {bonificacionesList?.map((d) => (
              <div className="form-check mb-2" key={d.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={d.id}
                  {...register("bonificaciones")}
                  id={`bonificaciones${d.id}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`bonificaciones${d.id}`}
                >
                  {d.nombre}
                </label>
              </div>
            ))}
          </div>
        </CondicionCarga>
      </div>
    </div>
  );
}
