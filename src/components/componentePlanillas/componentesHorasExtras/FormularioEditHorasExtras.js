import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { User, Calendar, Clock, DollarSign, FileText } from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
// (BotonMotionGeneral no se usa en este componente, así que lo quité)

export function FormularioEditHorasExtras({ onClose, dataHoraExtras }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // 'error' no se usa, pero lo dejamos por si lo usas luego

  useEffect(() => {
    if (dataHoraExtras) {
      reset({
        fecha: dataHoraExtras.fecha,
        horas_trabajadas: dataHoraExtras.horas_trabajadas,
        pagoTotal: dataHoraExtras.pagoTotal,
      });
    }
  }, [dataHoraExtras, reset]);

  const miOnSubmit = async (formData) => {
    setLoading(true);
    setError(false);
    try {
      const response = await axiosInstance.put(
        `/horas-extras/${dataHoraExtras.id}`,
        formData
      );

      ToastAlert("success", "Horas extras actualizadas correctamente");
      queryClient.invalidateQueries(["horasExtras"]);
      onClose();
    } catch (err) {
      setError(true);
      ToastAlert(
        "error",
        err.response?.data?.message || err.message || "Error al actualizar"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form p-4" onSubmit={handleSubmit(miOnSubmit)}>
      <div className="card p-3 mb-3 border bg-light">
        <label className="small fw-bold mb-1 d-flex align-items-center gap-1">
          <User size={16} /> Empleado
        </label>
        <span className="fs-6">
          {dataHoraExtras?.usuario?.empleado.persona.nombre}{" "}
          {dataHoraExtras?.usuario?.empleado.persona.apellidos}
        </span>
        <label className="small fw-bold mb-1 mt-2 d-flex align-items-center gap-1">
          <FileText size={16} /> Documento
        </label>
        <span className="fs-6">
          {dataHoraExtras?.usuario?.empleado.persona.documento_identidad}
        </span>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold">
          <Calendar size={16} className="me-1" /> Fecha
        </label>
        <input
          type="date"
          className={`form-control ${errors.fecha ? "is-invalid" : ""}`}
          {...register("fecha", { required: "La fecha es obligatoria" })}
        />
        {errors.fecha && (
          <div className="invalid-feedback">{errors.fecha.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold">
          <Clock size={16} className="me-1" /> Horas por Trabajar
        </label>
        <input
          type="number"
          step="0.1"
          className={`form-control ${
            errors.horas_trabajadas ? "is-invalid" : ""
          }`}
          placeholder="Horas a trabajar"
          {...register("horas_trabajadas", {
            required: "Las horas son obligatorias",
            valueAsNumber: true,
            min: { value: 0.1, message: "Debe ser mayor a 0" },
          })}
        />
        {errors.horas_trabajadas && (
          <div className="invalid-feedback">
            {errors.horas_trabajadas.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold">S/. Pago Total</label>
        <input
          type="number"
          step="0.01"
          className={`form-control ${errors.pagoTotal ? "is-invalid" : ""}`}
          placeholder="Pago total"
          {...register("pagoTotal", {
            required: "El pago es obligatorio",
            valueAsNumber: true,
            min: { value: 0.01, message: "Debe ser mayor a 0" },
          })}
        />
        {errors.pagoTotal && (
          <div className="invalid-feedback">{errors.pagoTotal.message}</div>
        )}
      </div>

      <div className="d-flex gap-2 pt-3 border-top">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={loading} // Deshabilitar también al cargar
        >
          Cancelar
        </button>

        {/* --- ¡BOTÓN ACTUALIZADO! --- */}
        <button
          type="submit" // Corregido: debe ser 'submit'
          className="btn-guardar" // Tu clase CSS personalizada
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span className="ms-2">Actualizando...</span>
            </>
          ) : (
            "Actualizar" // Texto normal
          )}
        </button>
      </div>
    </form>
  );
}
