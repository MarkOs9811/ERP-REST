import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Clock, HeartHandshake } from "lucide-react";
import { PutData } from "../../service/CRUD/PutData";
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
      className="flex flex-col h-full p-4"
      style={{ overflowY: "auto" }}
    >
      {/* HORARIOS Y DÍAS DE ATENCIÓN (NUEVO) */}
      <h6 className="font-bold mb-3 text-foreground border-b pb-2">
        Horario de Atención de la Sede
      </h6>

      {/* Días de la semana */}
      <div className="mb-3">
        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
          Días de Operación
        </label>
        <div className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map((dia) => (
            <div className="inline-flex items-center gap-2 m-0" key={dia}>
              <input
                className="size-4 shrink-0 rounded border-input accent-primary"
                type="checkbox"
                id={`edit-dia-${dia}`}
                value={dia}
                {...register("dias_atencion", {
                  required: "Selecciona al menos un día",
                })}
              />
              <label
                className="font-medium text-sm"
                htmlFor={`edit-dia-${dia}`}
              >
                {dia.substring(0, 3)}
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
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            Hora Apertura
          </label>
          <div className="flex w-full items-stretch">
            <span className="inline-flex items-center rounded-md border-input px-3 text-sm text-muted-foreground bg-background">
              <Clock size={16} className="text-muted-foreground" />
            </span>
            <input
              type="time"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.hora_apertura ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("hora_apertura", { required: "Obligatorio" })}
            />
          </div>
          {errors.hora_apertura && (
            <span className="text-destructive text-sm">
              {errors.hora_apertura.message}
            </span>
          )}
        </div>

        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            Hora Cierre
          </label>
          <div className="flex w-full items-stretch">
            <span className="inline-flex items-center rounded-md border-input px-3 text-sm text-muted-foreground bg-background">
              <Clock size={16} className="text-muted-foreground" />
            </span>
            <input
              type="time"
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.hora_cierre ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("hora_cierre", { required: "Obligatorio" })}
            />
          </div>
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
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            Costo Base (S/)
          </label>
          <div className="flex w-full items-stretch">
            <span
              className="inline-flex items-center rounded-md border-input px-3 text-sm bg-background text-muted-foreground font-bold"
              style={{ fontSize: "0.9rem" }}
            >
              S/
            </span>
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
          </div>
          {errors.costo_base_delivery && (
            <span className="text-destructive text-sm">
              {errors.costo_base_delivery.message}
            </span>
          )}
        </div>

        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            Costo Prioridad (S/)
          </label>
          <div className="flex w-full items-stretch">
            <span
              className="inline-flex items-center rounded-md border-input px-3 text-sm bg-background text-muted-foreground font-bold"
              style={{ fontSize: "0.9rem" }}
            >
              S/
            </span>
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
          {errors.costo_prioridad && (
            <span className="text-destructive text-sm">
              {errors.costo_prioridad.message}
            </span>
          )}
        </div>
      </div>

      {/* TIEMPOS ESTIMADOS (ETA) */}
      <h6 className="font-bold mb-3 text-foreground border-b pb-2">
        Tiempo de Entrega Estimado
      </h6>
      <div className="grid grid-cols-12 gap-3 mb-4">
        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            Minutos Min
          </label>
          <div className="flex w-full items-stretch">
            <span className="inline-flex items-center rounded-md border-input px-3 text-sm text-muted-foreground bg-background">
              <Clock size={16} className="text-muted-foreground" />
            </span>
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
          {errors.tiempo_min && (
            <span className="text-destructive text-sm">
              {errors.tiempo_min.message}
            </span>
          )}
        </div>

        <div className="col-span-6">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
            Minutos Max
          </label>
          <div className="flex w-full items-stretch">
            <span className="inline-flex items-center rounded-md border-input px-3 text-sm text-muted-foreground bg-background">
              <Clock size={16} className="text-muted-foreground" />
            </span>
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
          </div>
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
        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground text-sm">
          Lista de montos (S/)
        </label>
        <div className="flex w-full items-stretch mb-1">
          <span className="inline-flex items-center rounded-md border-input px-3 text-sm text-muted-foreground bg-background">
            <HeartHandshake size={16} className="text-muted-foreground" />
          </span>
          <input
            type="text"
            className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Ej: 2, 3, 5"
            {...register("propinasInput")}
          />
        </div>
        <small
          className="text-muted-foreground block"
          style={{ fontSize: "0.80rem" }}
        >
          Ingresa los montos separados por comas. Déjalo en blanco para ocultar
          módulos de propinas.
        </small>
      </div>

      {/* Controles del Footer */}
      <div className="mt-auto flex justify-end gap-2 border-t p-3">
        <Button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={isSubmitting}
          variant="default"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="btn-guardar"
          disabled={isSubmitting}
          variant="default"
        >
          {isSubmitting ? "Actualizando..." : "Actualizar Configuración"}
        </Button>
      </div>
    </form>
  );
}
