import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { Button } from "../../ui/button";
import { Card } from "@/components/ui/card";

export function SunatFormIntegracion({ data }) {
  const defaultValues = data
    ? {
        ruc: data?.clave || "",
        usuarioSol: data?.valor3 || "",
        claveSol: data?.valor4 || "",
        endpoint: data?.valor2 || "",
      }
    : {
        ruc: "",
        usuarioSol: "",
        claveSol: "",
        endpoint: "",
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues,
  });

  const [activo, setActivo] = useState(data?.estado === 1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActivo(data?.estado === 1);
  }, [data]);

  const certificadoFile = watch("certificado");

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("ruc", formData.ruc.trim());
      payload.append("usuarioSol", formData.usuarioSol.trim());
      payload.append("claveSol", formData.claveSol.trim());
      payload.append("endpoint", formData.endpoint.trim());
      if (formData.certificado instanceof File) {
        payload.append("certificado", formData.certificado);
      }

      const response = await axiosInstance.post(
        `/configuracionesSunat/${data.id}`,
        payload,
      );

      if (response.data.success) {
        ToastAlert("success", "Se actualizó la configuración");
      } else {
        ToastAlert("error", "Ocurrió un error al actualizar la configuración");
      }
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      ToastAlert("error", "Error al guardar la configuración");
    } finally {
      setLoading(false);
    }
  };

  const isConfigured =
    data?.clave?.trim() !== "" &&
    data?.valor1?.trim() !== "" &&
    data?.valor2?.trim() !== "" &&
    data?.valor3?.trim() !== "" &&
    data?.valor4?.trim() !== "";

  return (
    <Card className="border-0 p-4 grow" style={{ borderRadius: 18 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isConfigured ? (
          <div
            className="relative w-full rounded-lg px-4 py-3 text-sm border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center"
            role="alert"
          >
            <CheckCircle size={24} className="me-2" />
            Todo correcto con la configuración para Sunat
          </div>
        ) : (
          <div
            className="relative w-full rounded-lg px-4 py-3 text-sm border-destructive/30 bg-destructive/10 text-destructive flex items-center"
            role="alert"
          >
            <XCircle size={24} className="me-2" />
            Hay algún dato faltante en la configuración
          </div>
        )}

        {/* RUC */}
        <div className="mb-3">
          <label
            htmlFor="ruc"
            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-semibold"
          >
            RUC
          </label>
          <input
            id="ruc"
            className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
            placeholder="Número de RUC"
            disabled={!activo}
            {...register("ruc", {
              required: "El RUC es obligatorio",
              minLength: { value: 11, message: "El RUC debe tener 11 dígitos" },
              maxLength: { value: 11, message: "El RUC debe tener 11 dígitos" },
            })}
          />
          <div className="text-destructive text-sm">{errors.ruc?.message}</div>
        </div>

        {/* Usuario SOL */}
        <div className="mb-3">
          <label
            htmlFor="usuarioSol"
            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-semibold"
          >
            Usuario SOL
          </label>
          <input
            id="usuarioSol"
            className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
            placeholder="Usuario SOL"
            disabled={!activo}
            {...register("usuarioSol", {
              required: "El usuario SOL es obligatorio",
            })}
          />
          <div className="text-destructive text-sm">
            {errors.usuarioSol?.message}
          </div>
        </div>

        {/* Clave SOL */}
        <div className="mb-3">
          <label
            htmlFor="claveSol"
            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-semibold"
          >
            Clave SOL
          </label>
          <input
            id="claveSol"
            type="password"
            className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
            placeholder="Clave SOL"
            disabled={!activo}
            {...register("claveSol", {
              required: "La clave SOL es obligatoria",
            })}
          />
          <div className="text-destructive text-sm">
            {errors.claveSol?.message}
          </div>
        </div>

        {/* Certificado Digital */}
        <div className="mb-3">
          <label
            htmlFor="certificado"
            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-semibold"
          >
            Certificado Digital (.pem)
          </label>
          <input
            id="certificado"
            type="file"
            accept=".pem"
            className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
            disabled={!activo}
            {...register("certificado", {})}
            onChange={(e) => setValue("certificado", e.target.files[0])}
          />
          <div className="text-muted-foreground text-sm">
            {certificadoFile && certificadoFile.name
              ? `Archivo seleccionado: ${certificadoFile.name}`
              : "Selecciona tu archivo .pem"}
          </div>
          <div className="text-destructive text-sm">
            {errors.certificado?.message}
          </div>
        </div>

        {/* Endpoint */}
        <div className="mb-3">
          <label
            htmlFor="endpoint"
            className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-semibold"
          >
            Endpoint SUNAT
          </label>
          <input
            id="endpoint"
            className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
            placeholder="Endpoint SUNAT"
            disabled={!activo}
            {...register("endpoint", {
              required: "El endpoint es obligatorio",
            })}
          />
          <div className="text-destructive text-sm">
            {errors.endpoint?.message}
          </div>
        </div>

        {/* Botón */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="btn-guardar"
            disabled={!activo || loading}
            variant="default"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
