import { useForm } from "react-hook-form";
import ToastAlert from "../../componenteToast/ToastAlert";
import { useState } from "react";
import axiosInstance from "../../../api/AxiosInstance";
import { CheckCircle, XCircle } from "lucide-react";

export function OpenAiFormIntegracion({ dataIntegracion }) {
  const openAiConfig =
    dataIntegracion?.nombre === "Open AI" ? dataIntegracion : null;

  const defaultValues = openAiConfig
    ? {
        apiKey: openAiConfig?.clave || "",
      }
    : {
        apiKey: "",
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
        `/configuracionesOpenAi/${openAiConfig.id}`,
        {
          apiKey: data.apiKey.trim(),
        }
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

  if (!openAiConfig) {
    return <p>No se encontró configuración para Open AI</p>;
  }

  const isConfigured = openAiConfig?.clave?.trim() !== "";

  return (
    <div className="container mt-3">
      <form onSubmit={handleSubmit(onSubmit)} className="p-3">
        {/* Card de validación */}
        <div
          className={`alert p-3 mb-3 border-0 shadow-sm ${
            isConfigured ? "alert-success" : "alert-danger"
          }`}
          role="alert"
        >
          {isConfigured ? (
            <span className="small">
              <CheckCircle size={24} className="me-2" />
              Todo correcto, la integración con <strong>OpenAI</strong> está
              configurada.
            </span>
          ) : (
            <span className="small">
              <XCircle size={24} className="me-2" />
              Faltan credenciales. Genera tu API Key en{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="fw-bold text-decoration-underline"
              >
                OpenAI Dashboard
              </a>
              .
            </span>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">API Key</label>
          <input
            type="text"
            className={`form-control ${errors.apiKey ? "is-invalid" : ""}`}
            {...register("apiKey", {
              required: "Este campo es obligatorio.",
              validate: (v) =>
                /^\S+$/.test(v) ||
                "El valor no debe contener espacios ni saltos de línea",
            })}
            disabled={!isEditing}
          />
          {errors.apiKey && (
            <div className="invalid-feedback">{errors.apiKey.message}</div>
          )}
        </div>

        {/* Botones */}
        <div className="d-flex justify-content-end gap-2">
          {!isEditing ? (
            <button
              type="button" // 👈 evita submit
              className="btn-editar"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-guardar" disabled={loading}>
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
