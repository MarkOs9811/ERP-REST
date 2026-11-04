import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";

// Tipos de documentos (sin cambios)
const tiposDocumento = [
  { value: "01", label: "Factura" },
  { value: "03", label: "Boleta" },
  { value: "07", label: "Nota de Crédito" },
  { value: "08", label: "Nota de Débito" },
];

export function EditFormSerie({ cerrarModal, dataEdit }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const tipoDocSeleccionado = watch("tipo_documento_sunat");
  // ✅ Cargar los datos recibidos (para edición)
  useEffect(() => {
    if (dataEdit) {
      reset({
        idSerie: dataEdit.id,
        tipo_documento_sunat: dataEdit.tipo_documento_sunat || "",
        numeroSerie: dataEdit.serie || "",
        correlativo: dataEdit.correlativo_actual || "",
      });
    }
  }, [dataEdit, reset]);
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put(
        "/configuraciones/serieCorrelativoActualizar",
        data,
      );

      if (response.data.success) {
        ToastAlert("success", "Se actualizó correctamente");
        reset();
        setIsLoading(false);
        cerrarModal(false);
        queryClient.invalidateQueries(["configuracionSerie"]);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        // 🟡 Si es un error de validación (422)
        if (status === 422 && data.errors) {
          // Recorremos todos los mensajes de validación y los mostramos
          const mensajes = Object.values(data.errors).flat(); // Combina todos los arrays en uno solo
          mensajes.forEach((msg) => ToastAlert("error", msg));
          setIsLoading(false);
          return;
        }

        // 🔴 Si el backend devuelve un mensaje general
        const mensaje =
          data.message ||
          data.error ||
          "Ocurrió un error inesperado en el servidor.";
        setIsLoading(false);
        ToastAlert("error", mensaje);
      } else if (error.request) {
        setIsLoading(false);
        ToastAlert("error", "No se pudo conectar con el servidor.");
      } else {
        setIsLoading(false);
        ToastAlert("error", "Error en la solicitud.");
      }
    }
  };

  // Props de Correlativo (sin cambios)
  const correlativoProps = register("correlativo", {
    required: "El correlativo es obligatorio",
    valueAsNumber: true,
    validate: {
      isNumber: (v) => !isNaN(v) || "Debe ser un número",
      isInteger: (v) =>
        Number.isInteger(v) || "Debe ser un número entero (sin decimales)",
      isPositive: (v) => v > 0 || "Debe ser un número mayor a 0",
    },
  });

  // 1. CORRECCIÓN EN LAS VALIDACIONES DE 'numeroSerie'
  const numeroSerieProps = register("numeroSerie", {
    required: "El número de serie es obligatorio",
    maxLength: {
      value: 4,
      message: "Debe tener 4 caracteres",
    },
    // CORRECCIÓN: El patrón ahora acepta Letras y Números (A-Z, 0-9)
    pattern: {
      value: /^[A-Z][A-Z0-9]{3}$/i,
      message: "Formato inválido (Ej: F001 o FA01)",
    },
    // La validación F/B sigue igual y es correcta
    validate: (value) => {
      const serie = value.toUpperCase();
      const tipo = tipoDocSeleccionado;
      if (
        (tipo === "01" || tipo === "07" || tipo === "08") &&
        !serie.startsWith("F")
      ) {
        return "Facturas/Notas deben empezar con 'F'";
      }
      if (tipo === "03" && !serie.startsWith("B")) {
        return "Boletas deben empezar con 'B'";
      }
      return true;
    },
  });

  return (
    <div className="border-0 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        <input
          type="hidden"
          {...register("idSerie", {
            required: "El id es obligatorio",
          })}
        />
        <CardContent className="">
          <div className="grid grid-cols-12 gap-3">
            {/* Campo 1: Tipo de Documento (sin cambios) */}
            <div className="col-span-full">
              <label
                htmlFor="tipo_documento_sunat"
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold text-foreground"
              >
                Tipo de Documento <span className="text-destructive">*</span>
              </label>
              <select
                id="tipo_documento_sunat"
                className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.tipo_documento_sunat
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...register("tipo_documento_sunat", {
                  required: "El tipo de documento es obligatorio",
                })}
                placeholder={
                  tipoDocSeleccionado === "03"
                    ? "Ejemplo: B001"
                    : "Ejemplo: F001"
                }
              >
                <option value="">-- Seleccione un tipo --</option>
                {tiposDocumento.map((doc) => (
                  <option key={doc.value} value={doc.value}>
                    {doc.label}
                  </option>
                ))}
              </select>
              {errors.tipo_documento_sunat && (
                <div className="text-sm text-destructive">
                  {errors.tipo_documento_sunat.message}
                </div>
              )}
            </div>

            {/* Campo 2: Número de Serie (CON FILTRADO ALFANUMÉRICO) */}
            <div className="col-span-full">
              <label
                htmlFor="numeroSerie"
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold text-foreground"
              >
                Número de Serie <span className="text-destructive">*</span>
              </label>
              <input
                id="numeroSerie"
                type="text"
                placeholder="Ejemplo: F001 o FA01" // Placeholder actualizado
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.numeroSerie
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...numeroSerieProps}
                // 2. CORRECCIÓN EN EL FILTRO 'onChange'
                onChange={(e) => {
                  let value = e.target.value;

                  // Auto-convertir a mayúsculas
                  value = value.toUpperCase();

                  // Filtrar: permitir solo letra en la primera posición
                  if (value.length > 0 && !/^[A-Z]$/i.test(value[0])) {
                    value = value.substring(1);
                  }

                  // CORRECCIÓN: Permitir A-Z y 0-9 después de la primera posición
                  if (value.length > 1) {
                    // Reemplaza cualquier cosa que NO sea A-Z o 0-9
                    value =
                      value[0] + value.substring(1).replace(/[^A-Z0-9]/g, "");
                  }

                  // Limitar la longitud manualmente a 4
                  if (value.length > 4) {
                    value = value.substring(0, 4);
                  }

                  e.target.value = value;
                  numeroSerieProps.onChange(e);
                }}
              />
              {errors.numeroSerie && (
                <div className="text-sm text-destructive">
                  {errors.numeroSerie.message}
                </div>
              )}
            </div>

            {/* Campo 3: Correlativo (CON FILTRADO EN VIVO) */}
            <div className="col-span-full">
              <label
                htmlFor="correlativo"
                className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-bold text-foreground"
              >
                Correlativo Inicial <span className="text-destructive">*</span>
              </label>
              <input
                id="correlativo"
                type="text"
                placeholder="Ejemplo: 102"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.correlativo
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...correlativoProps}
                onChange={(e) => {
                  // Reemplaza CUALQUIER COSA que no sea un dígito (\D)
                  const filteredValue = e.target.value.replace(/\D/g, "");
                  e.target.value = filteredValue.substring(0, 8);
                  correlativoProps.onChange(e);
                }}
              />
              {errors.correlativo && (
                <div className="text-sm text-destructive">
                  {errors.correlativo.message}
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Pie de Página (sin cambios) */}
        <CardFooter className="flex gap-2 justify-end bg-muted mt-auto border-0">
          <Button
            type="button"
            onClick={cerrarModal}
            disabled={isLoading}
            className="btn-cerrar-modal items-center w-auto"
            variant="default"
          >
            <X className="me-2" size={16} />
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-guardar items-center"
            disabled={isLoading}
            variant="default"
          >
            {isLoading ? (
              <>
                <span
                  className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Guardando...
              </>
            ) : (
              <>
                <Save className="me-2" size={16} />
                Guardar cambios
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
