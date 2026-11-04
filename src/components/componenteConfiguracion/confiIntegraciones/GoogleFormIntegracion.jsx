import { useForm } from "react-hook-form";
import { CheckCircle, PenIcon, XCircle } from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import BotonAnimado from "../../componentesReutilizables/BotonAnimado";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";
import { Button } from "../../ui/button";

export function GoogleFormIntegracion({ dataIntegracion }) {
  const googleConfig =
    dataIntegracion?.nombre === "Google Service" ? dataIntegracion : null;

  const defaultValues = googleConfig
    ? {
        clientId: googleConfig?.valor1 || "",
        idSecretaCliente: googleConfig?.valor2 || "",
        redirectUrl: googleConfig?.valor3 || "",
      }
    : {
        clientId: "",
        idSecretaCliente: "",
        redirectUrl: "",
      };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtén el valor actual del redirectUrl del formulario
  const redirectUrlValue = watch("redirectUrl");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/configuraciones/${googleConfig.id}`,
        {
          clientId: data.clientId.trim(),
          idSecretaCliente: data.idSecretaCliente.trim(),
          redirectUrl: data.redirectUrl.trim(),
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

  if (!googleConfig) {
    return <p>No se encontró configuración para Google Service</p>;
  }

  const isConfigured =
    googleConfig?.valor1?.trim() !== "" && googleConfig?.valor2?.trim() !== "";

  const handleGoogleConnect = () => {
    // 1. Validaciones existentes
    if (!redirectUrlValue || redirectUrlValue.trim() === "") {
      ToastAlert(
        "error",
        "Por favor ingresa el Redirect URI antes de conectar",
      );
      return;
    }

    // 2. Limpieza de URL (Tu lógica actual)
    let urlDestino = redirectUrlValue.trim();
    if (urlDestino.includes("callback")) {
      urlDestino = urlDestino.replace("callback", "redirect");
    } else if (!urlDestino.includes("redirect")) {
      urlDestino = `${urlDestino}/auth/google/redirect`;
    }

    const targetCompanyId = googleConfig?.idEmpresa;

    if (targetCompanyId) {
      urlDestino = `${urlDestino}?target_company=${targetCompanyId}`;
    } else {
      console.warn("No se encontró ID de empresa en dataIntegracion");
    }

    window.location.href = urlDestino;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3">
      {/* Card de validación */}
      <div
        className={`relative w-full rounded-lg text-sm p-3 mb-3 border-0 shadow-sm ${
          isConfigured
            ? "rounded-md border-emerald-600/30 bg-emerald-600/10 p-4 text-emerald-800 dark:text-emerald-300 "
            : "rounded-md border-destructive/50 bg-destructive/10 p-4 text-destructive "
        }`}
      >
        {isConfigured ? (
          <span className="text-sm">
            <CheckCircle size={24} className="me-2" />
            Todo correcto, puedes continuar con la configuración.
          </span>
        ) : (
          <span className="text-sm">
            <XCircle size={24} className="me-2" />
            Faltan credenciales. Crea un servicio en{" "}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              Google Cloud Console
            </a>
            .
          </span>
        )}
      </div>

      {/* Campos del formulario */}
      <div className="mb-3">
        <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
          Client ID
        </label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted-foreground h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.clientId
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          {...register("clientId", {
            required: "Este campo es obligatorio.",
            validate: (v) =>
              /^\S+$/.test(v) ||
              "El valor no debe contener espacios ni saltos de línea",
          })}
          placeholder="Ingresa tu Client ID"
        />
        {errors.clientId && (
          <div className="text-sm text-destructive">
            {errors.clientId.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
          ID Secreto del cliente
        </label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted-foreground h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.idSecretaCliente
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          {...register("idSecretaCliente", {
            required: "Este campo es obligatorio.",
            validate: (v) =>
              /^\S+$/.test(v) ||
              "El valor no debe contener espacios ni saltos de línea",
          })}
          placeholder="Ingresa tu API Key"
        />
        {errors.idSecretaCliente && (
          <div className="text-sm text-destructive">
            {errors.idSecretaCliente.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
          Redirect URI
        </label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted-foreground h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.redirectUrl
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          {...register("redirectUrl", {
            required: "Este campo es obligatorio.",
            validate: (v) =>
              /^\S+$/.test(v) ||
              "El valor no debe contener espacios ni saltos de línea",
          })}
          placeholder="Ingresa tu Redirect URI"
        />
        <small className="text-muted-foreground">
          Dominio del backend + ruta de redireccionamiento
        </small>
        {errors.redirectUrl && (
          <div className="text-sm text-destructive">
            {errors.redirectUrl.message}
          </div>
        )}
      </div>
      <div>
        <small className="text-muted-foreground">
          empresa: {googleConfig.idEmpresa}{" "}
        </small>
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t gap-3">
        {/* --- GRUPO IZQUIERDA: Botón de Conexión --- */}
        {/* Solo se muestra si NO estamos editando */}
        {!isEditing && (
          <BotonMotionGeneral
            type="button"
            id="google-connect-btn"
            onClick={handleGoogleConnect}
            icon={<FontAwesomeIcon icon={faGoogle} />}
            text="Conectar Servicio"
            disabled={!redirectUrlValue || redirectUrlValue.trim() === ""}
          />
        )}

        {/* --- GRUPO DERECHA: Botones de Edición/Guardado --- */}
        <div className="flex justify-end gap-2">
          {!isEditing ? (
            <>
              <BotonMotionGeneral
                type="button"
                onClick={() => setIsEditing(true)}
                icon={<PenIcon />}
                text="Editar"
              />
            </>
          ) : (
            <>
              <Button
                type="button"
                className="btn-cerrar-modal"
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
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
