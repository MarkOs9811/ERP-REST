import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../api/AxiosInstance";
import ToastAlert from "../../../componenteToast/ToastAlert";

export function FormularioHorario({ onClose, isEdit, dataEdit = null }) {
  const [loadingSave, setLoadingSave] = useState(false);
  const queryClient = useQueryClient();

  // 1. Determinamos si estamos en modo edición
  const isEditMood = Boolean(isEdit);

  const {
    register,
    handleSubmit,
    watch, // <-- Importamos 'watch' para validar la hora de salida
    formState: { errors },
  } = useForm({
    mode: "onChange",
    // 2. Valores por defecto dinámicos
    defaultValues: {
      // Los inputs type="time" esperan un string "HH:mm"
      horaEntrada: dataEdit?.horaEntrada || "",
      horaSalida: dataEdit?.horaSalida || "",
    },
  });

  // 3. Observamos la hora de entrada para validación
  const horaEntradaValue = watch("horaEntrada");

  // 4. Lógica de envío (Submit)
  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      let response;
      const toastMessage = isEditMood
        ? "Horario actualizado correctamente"
        : "Horario registrado correctamente";

      if (isEditMood) {
        // ¡Asegúrate de que 'dataEdit.id_horario' sea el ID correcto!
        response = await axiosInstance.put(
          `/horarios/${dataEdit.id}`, // <-- ¡Verifica este endpoint/ID!
          data
        );
      } else {
        response = await axiosInstance.post("/horarios", data); // <-- ¡Verifica este endpoint!
      }

      if (response.data.success) {
        ToastAlert("success", toastMessage);
        queryClient.invalidateQueries(["horarios"]); // <-- Invalidamos cache de horarios
        setLoadingSave(false);
        onClose();
      }
    } catch (error) {
      setLoadingSave(false);
      const errorMessage = error.response?.data?.message || error.message;
      ToastAlert("error", errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      {/* Campo Hora Entrada */}
      <div className="mb-3">
        <label htmlFor="horaEntrada" className="form-label small">
          Hora de Entrada
        </label>
        <input
          id="horaEntrada"
          type="time" // <-- Input de tipo TIEMPO
          className={`form-control ${errors.horaEntrada ? "is-invalid" : ""}`}
          {...register("horaEntrada", {
            required: "La hora de entrada es obligatoria",
          })}
        />
        {errors.horaEntrada && (
          <div className="invalid-feedback">{errors.horaEntrada.message}</div>
        )}
      </div>

      {/* Campo Hora Salida */}
      <div className="mb-3">
        <label htmlFor="horaSalida" className="form-label small">
          Hora de Salida
        </label>
        <input
          id="horaSalida"
          type="time" // <-- Input de tipo TIEMPO
          className={`form-control ${errors.horaSalida ? "is-invalid" : ""}`}
          {...register("horaSalida", {
            required: "La hora de salida es obligatoria",
            // Validación personalizada:
            validate: (value) =>
              value > horaEntradaValue ||
              "La hora de salida debe ser posterior a la hora de entrada",
          })}
        />
        {errors.horaSalida && (
          <div className="invalid-feedback">{errors.horaSalida.message}</div>
        )}
      </div>

      <hr className="my-4" />

      {/* 6. Botones dinámicos */}
      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          title="Cerrar formulario"
        >
          Cancelar
        </button>
        <button
          type="Submit"
          className="btn-guardar"
          title={isEditMood ? "Actualizar horario" : "Guardar horario"}
          disabled={loadingSave}
        >
          {loadingSave ? (
            <span className="load"></span>
          ) : (
            <span>{isEditMood ? "Actualizar" : "Guardar"}</span>
          )}
        </button>
      </div>
    </form>
  );
}
