import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";
import "../../css/EstilosIncidenciasEventos.css";

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
    <div className="card p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="event-form">
        {/* Sección de detalles principales */}
        <div className="event-section mb-4 p-3 bg-light ">
          <h6 className="section-title mb-3">
            <i className="bi bi-card-text me-2"></i>
            Detalles del evento
          </h6>

          <div className="mb-3">
            <label className="form-label fw-bold">Título del evento *</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-pencil-square"></i>
              </span>
              <input
                className={`form-control ${errors.summary ? "is-invalid" : ""}`}
                type="text"
                placeholder="Ej: Reunión de equipo"
                {...register("summary", {
                  required: "El título es obligatorio",
                })}
              />
            </div>
            {errors.summary && (
              <div className="invalid-feedback d-flex align-items-center">
                <i className="bi bi-exclamation-circle me-2"></i>
                {errors.summary.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Descripción</label>
            <div className="input-group">
              <span className="input-group-text align-items-start">
                <i className="bi bi-text-paragraph"></i>
              </span>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Agrega detalles importantes..."
                {...register("description")}
              />
            </div>
          </div>
        </div>

        {/* Sección de fecha/hora */}
        <div className="event-section mb-4 p-3 bg-light ">
          <h6 className="section-title mb-3">
            <i className="bi bi-clock me-2"></i>
            Fecha y hora
          </h6>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Inicio *</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-calendar"></i>
                </span>
                <input
                  type="datetime-local"
                  className={`form-control ${errors.start ? "is-invalid" : ""}`}
                  {...register("start", {
                    required: "La fecha de inicio es obligatoria",
                  })}
                />
              </div>
              {errors.start && (
                <div className="invalid-feedback d-flex align-items-center">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {errors.start.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Fin *</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-calendar"></i>
                </span>
                <input
                  type="datetime-local"
                  className={`form-control ${errors.end ? "is-invalid" : ""}`}
                  {...register("end", {
                    required: "La fecha de fin es obligatoria",
                  })}
                />
              </div>
              {errors.end && (
                <div className="invalid-feedback d-flex align-items-center">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {errors.end.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de invitados */}
        <div className="event-section mb-4 p-3 bg-light ">
          <h6 className="section-title mb-3">
            <i className="bi bi-people me-2"></i>
            Invitados
          </h6>

          <div className="guest-list">
            {fields.map((item, index) => (
              <div key={item.id} className="guest-item mb-2">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.attendees?.[index] ? "is-invalid" : ""
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
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn btn-outline-danger"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
                {errors.attendees?.[index] && (
                  <div className="invalid-feedback d-flex align-items-center">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {errors.attendees[index].message}
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => append("")}
              className="btn btn-outline-primary mt-2"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Agregar invitado
            </button>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="d-grid">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-guardar py-2 w-100"
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
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
          </button>
        </div>
      </form>
    </div>
  );
}
