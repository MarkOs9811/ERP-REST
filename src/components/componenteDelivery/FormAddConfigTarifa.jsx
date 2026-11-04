import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Clock, HeartHandshake, CalendarDays } from "lucide-react";
import { PostData } from "../../service/CRUD/PostData";
import { Button } from "../ui/button";

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
      hora_apertura: "09:00", // Default
      hora_cierre: "22:00", // Default
      dias_atencion: DIAS_SEMANA, // Por defecto marcamos todos
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
      // NUEVOS CAMPOS:
      hora_apertura: data.hora_apertura,
      hora_cierre: data.hora_cierre,
      dias_atencion: JSON.stringify(data.dias_atencion), // Lo enviamos como string JSON
    };

    const exito = await PostData("delivery/zona-tarifa", payload);

    if (exito) {
      queryClient.invalidateQueries(["sedesConfiguracion"]);
      reset();
      onClose();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full p-4"
      style={{ overflowY: "auto" }}
    >
      {/* HORARIOS Y DÍAS DE ATENCIÓN (NUEVO) */}
      <h6 className="font-bold mb-3 text-foreground border-b pb-2">
        Horario de Atención de la Sede
      </h6>

      {/* Días de la semana */}
      <div className="mb-3">
        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm flex items-center gap-1">
          <CalendarDays size={16} className="text-muted-foreground" />
          Días de Operación
        </label>
        <div className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map((dia) => (
            <div className="inline-flex items-center gap-2 m-0" key={dia}>
              <input
                className="size-4 shrink-0 rounded border-input accent-primary"
                type="checkbox"
                id={`dia-${dia}`}
                value={dia}
                {...register("dias_atencion", {
                  required: "Selecciona al menos un día",
                })}
              />
              <label className="font-medium text-sm" htmlFor={`dia-${dia}`}>
                {dia.substring(0, 3)} {/* Muestra Lun, Mar, Mie, etc. */}
              </label>
            </div>
          ))}
        </div>
        {errors.dias_atencion && (
          <span className="text-destructive text-sm block mt-1">
            {errors.dias_atencion.message}
          </span>
        )}
      </div>

      {/* Horas */}
      <div className="grid grid-cols-12 gap-3 mb-4">
        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm flex items-center gap-1">
            <Clock size={16} className="text-muted-foreground" />
            Hora Apertura
          </label>
          <input
            type="time"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.hora_apertura ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("hora_apertura", { required: "Obligatorio" })}
          />
          {errors.hora_apertura && (
            <span className="text-destructive text-sm">
              {errors.hora_apertura.message}
            </span>
          )}
        </div>

        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm flex items-center gap-1">
            <Clock size={16} className="text-muted-foreground" />
            Hora Cierre
          </label>
          <input
            type="time"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.hora_cierre ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("hora_cierre", { required: "Obligatorio" })}
          />
          {errors.hora_cierre && (
            <span className="text-destructive text-sm">
              {errors.hora_cierre.message}
            </span>
          )}
        </div>
      </div>

      {/* TARIFAS */}
      <h6 className="font-bold mb-3 mt-2 text-foreground border-b pb-2">
        Tarifas de Delivery
      </h6>
      <div className="grid grid-cols-12 gap-3 mb-4">
        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm flex items-center gap-1">
            <span
              className="text-muted-foreground font-bold"
              style={{ fontSize: "0.9rem" }}
            >
              S/
            </span>
            Costo Base (S/)
          </label>
          <input
            type="number"
            step="0.01"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.costo_base_delivery ? "border-destructive focus-visible:ring-destructive" : ""}`}
            placeholder="Ej: 5.00"
            {...register("costo_base_delivery", {
              required: "Campo obligatorio",
              min: { value: 0, message: "Mínimo 0" },
            })}
          />
          {errors.costo_base_delivery && (
            <span className="text-destructive text-sm">
              {errors.costo_base_delivery.message}
            </span>
          )}
        </div>

        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm flex items-center gap-1">
            <span
              className="text-muted-foreground font-bold"
              style={{ fontSize: "0.9rem" }}
            >
              S/
            </span>
            Costo Prioridad (S/)
          </label>
          <input
            type="number"
            step="0.01"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.costo_prioridad ? "border-destructive focus-visible:ring-destructive" : ""}`}
            placeholder="Ej: 8.00"
            {...register("costo_prioridad", {
              min: { value: 0, message: "Mínimo 0" },
            })}
          />
        </div>
      </div>

      {/* TIEMPOS ESTIMADOS (ETA) */}
      <h6 className="font-bold mb-3 text-foreground border-b pb-2">
        Tiempo de Entrega Estimado
      </h6>
      <div className="grid grid-cols-12 gap-3 mb-4">
        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm flex items-center gap-1">
            <Clock size={16} className="text-muted-foreground" />
            Minutos Min
          </label>
          <input
            type="number"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.tiempo_min ? "border-destructive focus-visible:ring-destructive" : ""}`}
            placeholder="Ej: 30"
            {...register("tiempo_min", {
              required: "Obligatorio",
              min: { value: 1, message: "Mínimo 1" },
            })}
          />
        </div>

        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm flex items-center gap-1">
            <Clock size={16} className="text-muted-foreground" />
            Minutos Max
          </label>
          <input
            type="number"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.tiempo_max ? "border-destructive focus-visible:ring-destructive" : ""}`}
            placeholder="Ej: 45"
            {...register("tiempo_max", {
              required: "Obligatorio",
              validate: (value, formValues) =>
                parseInt(value) > parseInt(formValues.tiempo_min) ||
                "Debe ser mayor al mínimo",
            })}
          />
          {errors.tiempo_max && (
            <span className="text-destructive text-sm">
              {errors.tiempo_max.message}
            </span>
          )}
        </div>
      </div>

      {/* PROPINAS SUGERIDAS */}
      <h6 className="font-bold mb-3 text-foreground border-b pb-2">
        Propinas Sugeridas (Opcional)
      </h6>
      <div className="mb-4">
        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm flex items-center gap-1">
          <HeartHandshake size={16} className="text-muted-foreground" />
          Lista de montos (S/)
        </label>
        <input
          type="text"
          className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mb-1"
          placeholder="Ej: 2, 3, 5"
          {...register("propinasInput")}
        />
        <small
          className="text-muted-foreground block"
          style={{ fontSize: "0.80rem" }}
        >
          Ingresa los montos separados por comas. Déjalo en blanco para ocultar
          módulos de propinas.
        </small>
      </div>

      {/* Controles del Footer */}
      <div className="mt-auto flex justify-end gap-2 border-t pt-3 pb-1">
        <Button
          type="button"
          className="btn-cerrar rounded-full px-4"
          onClick={onClose}
          disabled={isSubmitting}
          variant="default"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="btn-guardar px-4"
          disabled={isSubmitting}
          variant="default"
        >
          {isSubmitting ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>
    </form>
  );
}
