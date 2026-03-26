import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Clock, HeartHandshake } from "lucide-react";
import { PostData } from "../../service/CRUD/PostData";

export function FormAddConfigTarifa({ onClose, sedeId }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      costo_base_delivery: "",
      costo_prioridad: "",
      tiempo_min: "",
      tiempo_max: "",
      propinasInput: "2, 3, 5", // Default
    },
  });

  const onSubmit = async (data) => {

    let propinasArray = [];
    if (data.propinasInput) {
      propinasArray = data.propinasInput
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n));
    }

    const payload = {
      sede_id: sedeId,
      costo_base_delivery: parseFloat(data.costo_base_delivery),
      costo_prioridad: parseFloat(data.costo_prioridad || 0),
      tiempo_min: parseInt(data.tiempo_min, 10),
      tiempo_max: parseInt(data.tiempo_max, 10),
      propinas_sugeridas: JSON.stringify(propinasArray),
    };

    const exito = await PostData("delivery/zona-tarifa", payload);

    if (exito) {
      queryClient.invalidateQueries(["sedesConfiguracion"]);
      reset();
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column h-100 p-4">
      {/* TARIFAS */}
      <h6 className="fw-bold mb-3 mt-2 text-dark border-bottom pb-2">Tarifas de Delivery</h6>
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label fw-medium text-dark small">Costo Base (S/)</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white text-muted fw-bold" style={{ fontSize: "0.9rem" }}>
              S/
            </span>
            <input
              type="number"
              step="0.01"
              className={`form-control ${errors.costo_base_delivery ? "is-invalid" : ""}`}
              placeholder="Ej: 5.00"
              {...register("costo_base_delivery", {
                required: "Campo obligatorio",
                min: { value: 0, message: "Mínimo 0" },
              })}
            />
          </div>
          {errors.costo_base_delivery && <span className="text-danger small">{errors.costo_base_delivery.message}</span>}
        </div>

        <div className="col-6">
          <label className="form-label fw-medium text-dark small">Costo Prioridad (S/)</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white text-muted fw-bold" style={{ fontSize: "0.9rem" }}>
              S/
            </span>
            <input
              type="number"
              step="0.01"
              className={`form-control ${errors.costo_prioridad ? "is-invalid" : ""}`}
              placeholder="Ej: 8.00"
              {...register("costo_prioridad", {
                min: { value: 0, message: "Mínimo 0" },
              })}
            />
          </div>
          {errors.costo_prioridad && <span className="text-danger small">{errors.costo_prioridad.message}</span>}
        </div>
      </div>

      {/* TIEMPOS ESTIMADOS (ETA) */}
      <h6 className="fw-bold mb-3 text-dark border-bottom pb-2">Tiempo de Entrega Estimado</h6>
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label fw-medium text-dark small">Minutos Min</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Clock size={16} className="text-muted" />
            </span>
            <input
              type="number"
              className={`form-control ${errors.tiempo_min ? "is-invalid" : ""}`}
              placeholder="Ej: 30"
              {...register("tiempo_min", {
                required: "Obligatorio",
                min: { value: 1, message: "Mínimo 1" },
              })}
            />
          </div>
          {errors.tiempo_min && <span className="text-danger small">{errors.tiempo_min.message}</span>}
        </div>

        <div className="col-6">
          <label className="form-label fw-medium text-dark small">Minutos Max</label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Clock size={16} className="text-muted" />
            </span>
            <input
              type="number"
              className={`form-control ${errors.tiempo_max ? "is-invalid" : ""}`}
              placeholder="Ej: 45"
              {...register("tiempo_max", {
                required: "Obligatorio",
                validate: (value, formValues) =>
                  parseInt(value) > parseInt(formValues.tiempo_min) ||
                  "Debe ser mayor al mínimo",
              })}
            />
          </div>
          {errors.tiempo_max && <span className="text-danger small">{errors.tiempo_max.message}</span>}
        </div>
      </div>

      {/* PROPINAS SUGERIDAS */}
      <h6 className="fw-bold mb-3 text-dark border-bottom pb-2">Propinas Sugeridas (Opcional)</h6>
      <div className="mb-4">
        <label className="form-label fw-medium text-dark small">Lista de montos (S/)</label>
        <div className="input-group shadow-sm mb-1">
          <span className="input-group-text bg-white">
            <HeartHandshake size={16} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: 2, 3, 5"
            {...register("propinasInput")}
          />
        </div>
        <small className="text-muted d-block" style={{ fontSize: "0.80rem" }}>
          Ingresa los montos separados por comas. Déjalo en blanco para ocultar módulos de propinas.
        </small>
      </div>

      {/* Controles del Footer */}
      <div className="mt-auto d-flex justify-content-end gap-2 border-top p-3">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-guardar" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Configuración"}
        </button>
      </div>
    </form>
  );
}
