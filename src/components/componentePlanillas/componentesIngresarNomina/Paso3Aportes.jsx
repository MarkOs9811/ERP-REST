import React from "react";
import { CondicionCarga } from "../../componentesReutilizables/CondicionCarga";
import { Card } from "@/components/ui/card";


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
    <Card className="p-4 border">
      <h5 className="mb-4" style={{ color: "#15669c" }}>
        Paso 3: Aportes, Deducciones y Bonificaciones
      </h5>
      <div className="grid grid-cols-12 gap-3">
        <CondicionCarga
          isLoading={loadingDeducciones}
          isError={errorDeducciones}
        >
          <div className="col-span-full md:col-span-6 mb-4">
            <label className="font-bold mb-3 border-b pb-2 block">
              Deducciones
            </label>
            {deduccionesList?.map((d) => {
              const isEssalud = d.nombre === "ESSALUD";
              return (
                <div className="flex items-center gap-2 mb-2" key={d.id}>
                  <input
                    className="size-4 shrink-0 rounded border-input accent-primary"
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
                    className="text-sm font-medium"
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
          <div className="col-span-full md:col-span-6 mb-4">
            <label className="font-bold mb-3 border-b pb-2 block">
              Bonificación
            </label>
            {bonificacionesList?.map((d) => (
              <div className="flex items-center gap-2 mb-2" key={d.id}>
                <input
                  className="size-4 shrink-0 rounded border-input accent-primary"
                  type="checkbox"
                  value={d.id}
                  {...register("bonificaciones")}
                  id={`bonificaciones${d.id}`}
                />
                <label
                  className="text-sm font-medium"
                  htmlFor={`bonificaciones${d.id}`}
                >
                  {d.nombre}
                </label>
              </div>
            ))}
          </div>
        </CondicionCarga>
      </div>
    </Card>
  );
}
