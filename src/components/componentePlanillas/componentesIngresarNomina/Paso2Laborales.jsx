import React from "react";
import { Briefcase, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <Card className="p-4 border">
      <h5 className="mb-4" style={{ color: "#15669c" }}>
        Paso 2: Detalles del contrato
      </h5>

      <div className="mb-3">
        <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm fw-semi-bold text-muted-foreground">
          <Briefcase size={16} className="me-1" /> Tipo Contrato
        </label>
        <select
          className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.contrato ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
          <div className="text-sm text-destructive">
            {errors.contrato.message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-6 mb-3">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm fw-semi-bold text-muted-foreground">
            <Calendar size={16} className="me-1" /> Inicio Contrato
          </label>
          <input
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.fecha_contrato ? "border-destructive focus-visible:ring-destructive" : ""}`}
            type="date"
            {...register("fecha_contrato", { required: "Requerido" })}
          />
        </div>
        <div className="col-span-6 mb-3">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm fw-semi-bold text-muted-foreground">
            <Calendar size={16} className="me-1" /> Fin Contrato
          </label>
          <input
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.fecha_fin_contrato ? "border-destructive focus-visible:ring-destructive" : ""}`}
            type="date"
            {...register("fecha_fin_contrato", { required: "Requerido" })}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm fw-semi-bold text-muted-foreground">
          <Briefcase size={16} className="me-1" /> Área
        </label>
        <select
          className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.area ? "border-destructive focus-visible:ring-destructive" : ""}`}
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

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-6 mb-3">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm fw-semi-bold text-muted-foreground">
            <Briefcase size={16} className="me-1" /> Cargo
          </label>
          <select
            className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.cargo ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
        <div className="col-span-6 mb-3">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm fw-semi-bold text-muted-foreground">
            <Clock size={16} className="me-1" /> Horario
          </label>
          <select
            className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.horario ? "border-destructive focus-visible:ring-destructive" : ""}`}
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

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-6">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm fw-semi-bold text-muted-foreground">
            S/. Salario base
          </label>
          <input
            className="h-9 w-full rounded-md border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-muted"
            placeholder="Salario base"
            {...register("salario")}
            readOnly
          />
        </div>
        <div className="col-span-6">
          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm fw-semi-bold text-muted-foreground">
            S/. Pago por Hora
          </label>
          <input
            className="h-9 w-full rounded-md border-input px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-muted"
            placeholder="Pago por Hora"
            {...register("pagoPorHora")}
            readOnly
          />
        </div>
      </div>
    </Card>
  );
}
