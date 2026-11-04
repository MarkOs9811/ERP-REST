import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";

import {
  AlertOctagon,
  Calendar,
  Calendar1,
  PenIcon,
  Square,
  SquaresExclude,
  TextIcon,
} from "lucide-react";
import { Button } from "../ui/button";

export function AgregarEvento() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      attendees: [""],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attendees",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/crear-evento", data);
      const result = response.data;

      if (response.data.success) {
        ToastAlert("success", "Evento Creado correctamente");
        queryClient.invalidateQueries(["eventos"]);

        if (result.htmlLink) {
          window.open(result.htmlLink, "_blank");
        }
      } else {
        ToastAlert("error", "Ocurrió un error al crear");
      }
    } catch (error) {
      console.error("Error:", error);
      ToastAlert("error", "Error:", error);
      ToastAlert("error", "Necesario inciar sesion nuevamente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-transparent">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="event-form bg-transparent"
      >
        {/* Sección de detalles principales */}
        <div className="event-section mb-4 p-3 bg-transparent">
          <h6 className="section-title mb-3">
            <i className="bi bi-card-text me-2"></i>
            Detalles del evento
          </h6>

          <div className="mb-3">
            <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold">
              Título del evento *
            </label>
            <div className="flex w-full items-stretch">
              <span className="inline-flex items-center rounded-md border-input bg-muted px-3 text-sm text-muted-foreground">
                <PenIcon className="text-auto" />
              </span>
              <input
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.summary ? "border-destructive focus-visible:ring-destructive" : ""}`}
                type="text"
                placeholder="Ej: Reunión de equipo"
                {...register("summary", {
                  required: "El título es obligatorio",
                })}
              />
            </div>
            {errors.summary && (
              <div className="text-sm text-destructive flex items-center">
                <AlertOctagon />
                {errors.summary.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold">
              Descripción
            </label>
            <div className="flex w-full items-stretch">
              <span className="inline-flex rounded-md border-input bg-muted px-3 text-sm text-muted-foreground items-start">
                <TextIcon className="text-auto" />
              </span>
              <textarea
                className="h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                rows="3"
                placeholder="Agrega detalles importantes..."
                {...register("description")}
              />
            </div>
          </div>
        </div>

        {/* Sección de fecha/hora */}
        <div className="event-section mb-4 p-3 bg-trasnparent">
          <h6 className="section-title mb-3">
            <i className="bi bi-clock me-2"></i>
            Fecha y hora
          </h6>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-full md:col-span-6">
              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold">
                Inicio *
              </label>
              <div className="flex w-full items-stretch">
                <span className="inline-flex items-center rounded-md border-input bg-muted px-3 text-sm text-muted-foreground">
                  <Calendar1 className="text-auto" />
                </span>
                <input
                  type="datetime-local"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.start ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("start", {
                    required: "La fecha de inicio es obligatoria",
                  })}
                />
              </div>
              {errors.start && (
                <div className="text-sm text-destructive flex items-center">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {errors.start.message}
                </div>
              )}
            </div>

            <div className="col-span-full md:col-span-6">
              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold">
                Fin *
              </label>
              <div className="flex w-full items-stretch">
                <span className="inline-flex items-center rounded-md border-input bg-muted px-3 text-sm text-muted-foreground">
                  <Calendar1 className="text-auto" />
                </span>
                <input
                  type="datetime-local"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.end ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("end", {
                    required: "La fecha de fin es obligatoria",
                  })}
                />
              </div>
              {errors.end && (
                <div className="text-sm text-destructive flex items-center">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {errors.end.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de invitados */}
        <div className="event-section mb-4 p-3 bg-trasnparent">
          <h6 className="section-title mb-3">
            <i className="bi bi-people me-2"></i>
            Invitados
          </h6>

          <div className="guest-list">
            {fields.map((item, index) => (
              <div key={item.id} className="guest-item mb-2">
                <div className="flex w-full items-stretch">
                  <span className="inline-flex items-center rounded-md border-input bg-muted px-3 text-sm text-muted-foreground">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="email"
                    className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.attendees?.[index]
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    placeholder="correo@ejemplo.com"
                    {...register(`attendees.${index}`, {
                      required: "El correo es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico inválido",
                      },
                    })}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="shadow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-destructive bg-background text-destructive hover:bg-destructive/10"
                      variant="destructive"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  )}
                </div>
                {errors.attendees?.[index] && (
                  <div className="text-sm text-destructive flex items-center">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {errors.attendees[index].message}
                  </div>
                )}
              </div>
            ))}

            <Button
              type="button"
              onClick={() => append("")}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground mt-2"
              variant="default"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Agregar invitado
            </Button>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="grid">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="btn-guardar py-2 w-full"
            variant="default"
          >
            {isSubmitting ? (
              <>
                <span
                  className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creando evento...
              </>
            ) : (
              <>
                <i className="bi bi-calendar-check me-2"></i>
                Guardar
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
