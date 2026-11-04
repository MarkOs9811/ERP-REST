import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // 1. Importar
import { Type, Calendar, Save, AlertTriangle, XCircle } from "lucide-react";
import ToastAlert from "../../../componenteToast/ToastAlert";
import axiosInstance from "../../../../api/AxiosInstance";
import { Button } from "../../../ui/button";

// (Asumo que axiosInstance y ToastAlert están importados)
// import { axiosInstance } from "ruta/hacia/axiosConfig";
// import { ToastAlert } from "ruta/hacia/ToastAlert";

export function FormularioEditarPeriodo({ onClose, dataPeriodo }) {
  // --- Estados para errores y carga ---
  const [errorBackend, setErrorBackend] = useState(null);

  // 2. Configuración de React Hook Form
  const {
    register, // Para registrar los inputs
    handleSubmit, // Para manejar el envío
    reset, // Para rellenar/limpiar el formulario
    formState: { errors, isSubmitting }, // Para errores de cliente y estado de carga
  } = useForm({
    // Valores por defecto iniciales (aunque se sobreescribirán)
    defaultValues: {
      nombrePeriodo: "",
      fecha_inicio: "",
      fecha_fin: "",
    },
  });

  // 3. Rellenado automático del formulario (el "use default" que mencionaste)
  // Usamos reset para poblar el formulario cuando la prop dataPeriodo esté lista
  useEffect(() => {
    if (dataPeriodo) {
      reset({
        nombrePeriodo: dataPeriodo.nombrePeriodo || "",
        fecha_inicio: dataPeriodo.fecha_inicio || "",
        fecha_fin: dataPeriodo.fecha_fin || "",
      });
      setErrorBackend(null); // Limpiar errores anteriores
    }
  }, [dataPeriodo, reset]); // Se ejecuta si 'dataPeriodo' o 'reset' cambian

  // 4. Lógica de envío (ahora recibe 'data' de RHF)
  const onSubmit = async (data) => {
    setErrorBackend(null);

    // El 'data' ya contiene los valores validados por RHF
    try {
      const response = await axiosInstance.put(
        `/periodoNomina/${dataPeriodo.id}`,
        data,
      );

      if (response.data.success) {
        ToastAlert("success", "Periodo actualizado correctamente");
        onClose();
      }
    } catch (error) {
      // Manejo de Errores del Backend
      if (error.response) {
        const errData = error.response.data;
        if (error.response.status === 422 && errData.errors) {
          const primerError = Object.values(errData.errors)[0][0];
          setErrorBackend(`Validación fallida: ${primerError}`);
        } else if (errData.message) {
          setErrorBackend(`Error: ${errData.message}`);
        } else {
          setErrorBackend("Ocurrió un error inesperado en el servidor.");
        }
      } else {
        setErrorBackend("No se pudo conectar con el servidor.");
      }
    }
  };

  return (
    <div className="p-4">
      {/* 5. Usamos handleSubmit de RHF */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-3">
          {/* 1. Nombre del Periodo */}
          <div className="col-span-full">
            <div className="mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <strong>Nombre del Periodo</strong>
              </label>
              <div className="flex w-full items-stretch">
                <span className="inline-flex items-center rounded-md border-input bg-muted px-3 text-sm text-muted-foreground">
                  <Type size={18} />
                </span>
                {/* 6. Registramos el input */}
                <input
                  type="text"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.nombrePeriodo
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  {...register("nombrePeriodo", {
                    required: "El nombre es obligatorio",
                  })}
                />
              </div>
              {errors.nombrePeriodo && (
                <small className="text-destructive">
                  {errors.nombrePeriodo.message}
                </small>
              )}
            </div>
          </div>

          {/* 2. Fecha de Inicio */}
          <div className="col-span-full md:col-span-6">
            <div className="mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <strong>Fecha de Inicio</strong>
              </label>
              <div className="flex w-full items-stretch">
                <span className="inline-flex items-center rounded-md border-input bg-muted px-3 text-sm text-muted-foreground">
                  <Calendar size={18} />
                </span>
                <input
                  type="date"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.fecha_inicio
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  {...register("fecha_inicio", {
                    required: "La fecha de inicio es obligatoria",
                  })}
                />
              </div>
              {errors.fecha_inicio && (
                <small className="text-destructive">
                  {errors.fecha_inicio.message}
                </small>
              )}
            </div>
          </div>

          {/* 3. Fecha Fin (Corte) */}
          <div className="col-span-full md:col-span-6">
            <div className="mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <strong>Fecha Fin (Corte)</strong>
              </label>
              <div className="flex w-full items-stretch">
                <span className="inline-flex items-center rounded-md border-input bg-muted px-3 text-sm text-muted-foreground">
                  <Calendar size={18} />
                </span>
                <input
                  type="date"
                  className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.fecha_fin
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  {...register("fecha_fin", {
                    required: "La fecha de fin es obligatoria",
                    // Validación de cliente
                    validate: (value, formValues) =>
                      value > formValues.fecha_inicio ||
                      "La fecha de fin debe ser posterior a la de inicio",
                  })}
                />
              </div>
              {errors.fecha_fin && (
                <small className="text-destructive">
                  {errors.fecha_fin.message}
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Alerta de Error del Backend */}
        {errorBackend && (
          <div
            className="relative w-full rounded-lg px-4 py-3 text-sm border-destructive/30 bg-destructive/10 text-destructive flex items-center"
            role="alert"
          >
            <AlertTriangle size={18} className="me-2" />
            {errorBackend}
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex justify-end mt-4 gap-2">
          <Button
            type="button"
            className="btn-cerrar-modal"
            onClick={onClose}
            disabled={isSubmitting}
            variant="default"
          >
            <XCircle size={18} className="" />
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-guardar"
            disabled={isSubmitting} // 7. Usamos isSubmitting
            variant="default"
          >
            {isSubmitting ? (
              <span
                className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <Save size={18} className="me-2" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
