import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { User, Calendar, Clock, DollarSign, FileText } from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { Button } from "../../ui/button";
import { Card } from "@/components/ui/card";

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

  const onSubmitEditar = async (formData) => {
    setLoading(true);
    setError(false);
    try {
      const response = await axiosInstance.put(
        `/horasExtras/${dataHoraExtras.id}`,
        formData,
      );
      if (response.data.success) {
        ToastAlert("success", "Horas extras actualizadas correctamente");
        queryClient.invalidateQueries(["horasExtras"]);
        onClose();
      }
    } catch (err) {
      setError(true);
      ToastAlert(
        "error",
        err.response?.data?.message || err.message || "Error al actualizar",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form p-4" onSubmit={handleSubmit(onSubmitEditar)}>
      <Card className="p-3 mb-3 bg-muted">
        <label className="text-sm font-bold mb-1 flex items-center gap-1">
          <User size={16} /> Empleado
        </label>
        <span className="text-base">
          {dataHoraExtras?.usuario?.empleado.persona.nombre}{" "}
          {dataHoraExtras?.usuario?.empleado.persona.apellidos}
        </span>
        <label className="text-sm font-bold mb-1 mt-2 flex items-center gap-1">
          <FileText size={16} /> Documento
        </label>
        <span className="text-base">
          {dataHoraExtras?.usuario?.empleado.persona.documento_identidad}
        </span>
      </Card>

      <div className="mb-3">
        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold">
          <Calendar size={16} className="me-1" /> Fecha
        </label>
        <input
          type="date"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.fecha ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("fecha", { required: "La fecha es obligatoria" })}
        />
        {errors.fecha && (
          <div className="text-sm text-destructive">{errors.fecha.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold">
          <Clock size={16} className="me-1" /> Horas por Trabajar
        </label>
        <input
          type="number"
          step="0.1"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.horas_trabajadas
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          placeholder="Horas a trabajar"
          {...register("horas_trabajadas", {
            required: "Las horas son obligatorias",
            valueAsNumber: true,
            min: { value: 0.1, message: "Debe ser mayor a 0" },
          })}
        />
        {errors.horas_trabajadas && (
          <div className="text-sm text-destructive">
            {errors.horas_trabajadas.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold">
          S/. Pago Total
        </label>
        <input
          type="number"
          step="0.01"
          readOnly="true"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.pagoTotal ? "border-destructive focus-visible:ring-destructive" : ""}`}
          placeholder="Pago total"
          {...register("pagoTotal", {
            required: "El pago es obligatorio",
            valueAsNumber: true,
            min: { value: 0.01, message: "Debe ser mayor a 0" },
          })}
        />
        {errors.pagoTotal && (
          <div className="text-sm text-destructive">
            {errors.pagoTotal.message}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-3 border-t">
        <Button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={loading} // Deshabilitar también al cargar
          variant="default"
        >
          Cancelar
        </Button>

        {/* --- ¡BOTÓN ACTUALIZADO! --- */}
        <Button
          type="submit" // Corregido: debe ser 'submit'
          className="btn-guardar" // Tu clase CSS personalizada
          disabled={loading}
          variant="default"
        >
          {loading ? (
            <>
              <span
                className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 border"
                role="status"
                aria-hidden="true"
              ></span>
              <span className="ms-2">Actualizando...</span>
            </>
          ) : (
            "Actualizar" // Texto normal
          )}
        </Button>
      </div>
    </form>
  );
}
