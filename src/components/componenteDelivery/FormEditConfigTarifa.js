import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Clock, HeartHandshake } from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";

// Lista de días para renderizar los checkboxes
const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export function FormEditConfigTarifa({ onClose, configuracion }) {
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
      propinasInput: "",
      hora_apertura: "", // Nuevo
      hora_cierre: "", // Nuevo
      dias_atencion: [], // Nuevo
    },
  });

  useEffect(() => {
    if (configuracion) {
      // 1. Parsear propinas (de "[2,3,5]" a "2, 3, 5")
      let propinasStr = "";
      try {
        const propinas =
          typeof configuracion.propinas_sugeridas === "string"
            ? JSON.parse(configuracion.propinas_sugeridas)
            : configuracion.propinas_sugeridas || [];
        propinasStr = Array.isArray(propinas) ? propinas.join(", ") : "";
      } catch (e) {
        propinasStr = "";
      }

      // 2. Parsear días de atención (de '["Lunes","Martes"]' a ["Lunes", "Martes"])
      let diasArray = [];
      try {
        const dias =
          typeof configuracion.dias_atencion === "string"
            ? JSON.parse(configuracion.dias_atencion)
            : configuracion.dias_atencion || [];
        diasArray = Array.isArray(dias) ? dias : [];
      } catch (e) {
        // Si falla o es null, marcamos todos por defecto o lo dejamos vacío
        diasArray = DIAS_SEMANA;
      }

      // Resetear el formulario con los datos de la base de datos
      reset({
        costo_base_delivery: configuracion.costo_base_delivery || "",
        costo_prioridad: configuracion.costo_prioridad || "",
        tiempo_min: configuracion.tiempo_min || "",
        tiempo_max: configuracion.tiempo_max || "",
        propinasInput: propinasStr,
        // Asignar los nuevos campos asegurando que el formato de hora sea "HH:mm"
        hora_apertura: configuracion.hora_apertura
          ? configuracion.hora_apertura.substring(0, 5)
          : "09:00",
        hora_cierre: configuracion.hora_cierre
          ? configuracion.hora_cierre.substring(0, 5)
          : "22:00",
        dias_atencion: diasArray,
      });
    }
  }, [configuracion, reset]);

  const onSubmit = async (data) => {
    // Procesar propinas de "2,3,5" a [2,3,5]
    let propinasArray = [];
    if (data.propinasInput) {
      propinasArray = data.propinasInput
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n));
    }

    const payload = {
      sede_id: configuracion.idSede,
      costo_base_delivery: parseFloat(data.costo_base_delivery),
      costo_prioridad: parseFloat(data.costo_prioridad || 0),
      tiempo_min: parseInt(data.tiempo_min, 10),
      tiempo_max: parseInt(data.tiempo_max, 10),
      propinas_sugeridas: JSON.stringify(propinasArray),
      // NUEVOS CAMPOS:
      hora_apertura: data.hora_apertura,
      hora_cierre: data.hora_cierre,
      dias_atencion: JSON.stringify(data.dias_atencion),
    };

    // Usamos PutData apuntando a delivery/zona-tarifa/{id}
    const exito = await PutData(
      "delivery/zona-tarifa",
      configuracion.id,
      payload,
    );

    if (exito) {
      queryClient.invalidateQueries(["sedesConfiguracion"]);
      onClose();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="d-flex flex-column h-100 p-4"
      style={{ overflowY: "auto" }}
    >
      {/* HORARIOS Y DÍAS DE ATENCIÓN (NUEVO) */}
      <h6 className="fw-bold mb-3 text-dark border-bottom pb-2">
        Horario de Atención de la Sede
      </h6>

      {/* Días de la semana */}
      <div className="mb-3">
        <label className="form-label fw-medium text-dark small">
          Días de Operación
        </label>
        <div className="d-flex flex-wrap gap-2">
          {DIAS_SEMANA.map((dia) => (
            <div className="form-check form-check-inline m-0" key={dia}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`edit-dia-${dia}`}
                value={dia}
                {...register("dias_atencion", {
                  required: "Selecciona al menos un día",
                })}
              />
              <label
                className="form-check-label small"
                htmlFor={`edit-dia-${dia}`}
              >
                {dia.substring(0, 3)}
              </label>
            </div>
          ))}
        </div>
        {errors.dias_atencion && (
          <span className="text-danger small d-block mt-1">
            {errors.dias_atencion.message}
          </span>
        )}
      </div>

      {/* Horas */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label fw-medium text-dark small">
            Hora Apertura
          </label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Clock size={16} className="text-muted" />
            </span>
            <input
              type="time"
              className={`form-control ${errors.hora_apertura ? "is-invalid" : ""}`}
              {...register("hora_apertura", { required: "Obligatorio" })}
            />
          </div>
          {errors.hora_apertura && (
            <span className="text-danger small">
              {errors.hora_apertura.message}
            </span>
          )}
        </div>

        <div className="col-6">
          <label className="form-label fw-medium text-dark small">
            Hora Cierre
          </label>
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Clock size={16} className="text-muted" />
            </span>
            <input
              type="time"
              className={`form-control ${errors.hora_cierre ? "is-invalid" : ""}`}
              {...register("hora_cierre", { required: "Obligatorio" })}
            />
          </div>
          {errors.hora_cierre && (
            <span className="text-danger small">
              {errors.hora_cierre.message}
            </span>
          )}
        </div>
      </div>

      {/* TARIFAS */}
      <h6 className="fw-bold mb-3 mt-2 text-dark border-bottom pb-2">
        Tarifas de Delivery
      </h6>
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label fw-medium text-dark small">
            Costo Base (S/)
          </label>
          <div className="input-group shadow-sm">
            <span
              className="input-group-text bg-white text-muted fw-bold"
              style={{ fontSize: "0.9rem" }}
            >
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
          {errors.costo_base_delivery && (
            <span className="text-danger small">
              {errors.costo_base_delivery.message}
            </span>
          )}
        </div>

        <div className="col-6">
          <label className="form-label fw-medium text-dark small">
            Costo Prioridad (S/)
          </label>
          <div className="input-group shadow-sm">
            <span
              className="input-group-text bg-white text-muted fw-bold"
              style={{ fontSize: "0.9rem" }}
            >
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
          {errors.costo_prioridad && (
            <span className="text-danger small">
              {errors.costo_prioridad.message}
            </span>
          )}
        </div>
      </div>

      {/* TIEMPOS ESTIMADOS (ETA) */}
      <h6 className="fw-bold mb-3 text-dark border-bottom pb-2">
        Tiempo de Entrega Estimado
      </h6>
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label fw-medium text-dark small">
            Minutos Min
          </label>
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
          {errors.tiempo_min && (
            <span className="text-danger small">
              {errors.tiempo_min.message}
            </span>
          )}
        </div>

        <div className="col-6">
          <label className="form-label fw-medium text-dark small">
            Minutos Max
          </label>
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
          {errors.tiempo_max && (
            <span className="text-danger small">
              {errors.tiempo_max.message}
            </span>
          )}
        </div>
      </div>

      {/* PROPINAS SUGERIDAS */}
      <h6 className="fw-bold mb-3 text-dark border-bottom pb-2">
        Propinas Sugeridas (Opcional)
      </h6>
      <div className="mb-4">
        <label className="form-label fw-medium text-dark small">
          Lista de montos (S/)
        </label>
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
          Ingresa los montos separados por comas. Déjalo en blanco para ocultar
          módulos de propinas.
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
          {isSubmitting ? "Actualizando..." : "Actualizar Configuración"}
        </button>
      </div>
    </form>
  );
}
