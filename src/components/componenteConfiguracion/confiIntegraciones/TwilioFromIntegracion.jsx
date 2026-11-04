import { useState } from "react";
import { useForm } from "react-hook-form";
import ToastAlert from "../../componenteToast/ToastAlert";
import axiosInstance from "../../../api/AxiosInstance";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../../ui/button";

export function TwilioFromIntegracion({ dataIntegracion }) {
  const twilioConfig =
    dataIntegracion?.nombre === "Twilio" ? dataIntegracion : null;

  const defaultValues = twilioConfig
    ? {
        SID: twilioConfig?.valor1 || "",
        apiKey: twilioConfig?.valor2 || "",
        numeroTwilio: twilioConfig?.valor3 || "",
      }
    : {
        SID: "",
        apiKey: "",
        numeroTwilio: "",
      };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/configuracionesTwilio/${twilioConfig.id}`,
        {
          SID: data.SID.trim(), // Account SID
          apiKey: data.authToken.trim(), // Auth Token de Twilio
          numeroTwilio: data.numeroTwilio.trim(), // WhatsApp de Twilio
        },
      );
      if (response.data.success) {
        ToastAlert("success", "Configuración guardada con éxito");
        setIsEditing(false);
      } else {
        ToastAlert("error", "Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      ToastAlert("error", "Error al guardar la configuración");
    } finally {
      setLoading(false);
    }
  };
  if (!twilioConfig) {
    return <p>No se encontró configuración para Open AI</p>;
  }

  const isConfigured =
    twilioConfig?.valor1?.trim() !== "" &&
    twilioConfig?.valor2?.trim() !== "" &&
    twilioConfig?.valor3?.trim() !== "";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 mt-3">
      <form onSubmit={handleSubmit(onSubmit)} className="p-3">
        {/* Card de validación */}
        <div
          className={`relative w-full rounded-lg text-sm p-3 mb-3 border-0 shadow-sm ${
            isConfigured
              ? "rounded-md border-emerald-600/30 bg-emerald-600/10 p-4 text-emerald-800 dark:text-emerald-300"
              : "rounded-md border-destructive/50 bg-destructive/10 p-4 text-destructive"
          }`}
          role="alert"
        >
          {isConfigured ? (
            <span className="text-sm">
              <CheckCircle size={24} className="me-2" />
              Todo correcto, la integración con <strong>TWILIO</strong> está
              configurada.
            </span>
          ) : (
            <span className="text-sm">
              <XCircle size={24} className="me-2" />
              Faltan credenciales. Genera tu API Key en{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                OpenAI Dashboard
              </a>
              .
            </span>
          )}
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            SID Twilio
          </label>
          <input
            type="text"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.SID ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("SID", {
              required: "Este campo es obligatorio.",
              validate: (v) =>
                /^\S+$/.test(v) ||
                "El valor no debe contener espacios ni saltos de línea",
            })}
            disabled={!isEditing}
          />
          {errors.SID && (
            <div className="text-sm text-destructive">{errors.SID.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            API Key
          </label>
          <input
            type="text"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.apiKey ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("apiKey", {
              required: "Este campo es obligatorio.",
              validate: (v) =>
                /^\S+$/.test(v) ||
                "El valor no debe contener espacios ni saltos de línea",
            })}
            disabled={!isEditing}
          />
          {errors.apiKey && (
            <div className="text-sm text-destructive">
              {errors.apiKey.message}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Número de Twilio
          </label>
          <input
            type="text"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.numeroTwilio
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
            {...register("numeroTwilio", {
              required: "Este campo es obligatorio.",
              validate: (v) =>
                /^\S+$/.test(v) ||
                "El valor no debe contener espacios ni saltos de línea",
            })}
            disabled={!isEditing}
          />
          <small className="text-muted-foreground">
            Ejemplo: whatsapp:+195#######
          </small>
          {errors.numeroTwilio && (
            <div className="text-sm text-destructive">
              {errors.numeroTwilio.message}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2">
          {!isEditing ? (
            <Button
              type="button" // 👈 evita submit
              className="btn-editar"
              onClick={() => setIsEditing(true)}
              variant="secondary"
            >
              Editar
            </Button>
          ) : (
            <>
              <Button
                type="button"
                className="btn-cancelar"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                variant="default"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="btn-guardar"
                disabled={loading}
                variant="default"
              >
                {loading ? (
                  <>
                    <span
                      className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
