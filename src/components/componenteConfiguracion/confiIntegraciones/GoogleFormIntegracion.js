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
        className={`alert p-3 mb-3 border-0 shadow-sm ${
          isConfigured ? "alert-success " : "alert-danger "
        }`}
      >
        {isConfigured ? (
          <span className="small">
            <CheckCircle size={24} className="me-2" />
            Todo correcto, puedes continuar con la configuración.
          </span>
        ) : (
          <span className="small">
            <XCircle size={24} className="me-2" />
            Faltan credenciales. Crea un servicio en{" "}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className=" fw-bold text-decoration-underline"
            >
              Google Cloud Console
            </a>
            .
          </span>
        )}
      </div>

      {/* Campos del formulario */}
      <div className="mb-3">
        <label className="form-label small">Client ID</label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted form-control ${
            errors.clientId ? "is-invalid" : ""
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
          <div className="invalid-feedback">{errors.clientId.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label small">ID Secreto del cliente</label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted form-control ${
            errors.idSecretaCliente ? "is-invalid" : ""
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
          <div className="invalid-feedback">
            {errors.idSecretaCliente.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label small">Redirect URI</label>
        <input
          type="text"
          disabled={!isEditing}
          className={`text-muted form-control ${
            errors.redirectUrl ? "is-invalid" : ""
          }`}
          {...register("redirectUrl", {
            required: "Este campo es obligatorio.",
            validate: (v) =>
              /^\S+$/.test(v) ||
              "El valor no debe contener espacios ni saltos de línea",
          })}
          placeholder="Ingresa tu Redirect URI"
        />
        <small className="text-muted">
          Dominio del backend + ruta de redireccionamiento
        </small>
        {errors.redirectUrl && (
          <div className="invalid-feedback">{errors.redirectUrl.message}</div>
        )}
      </div>
      <div>
        <small className="text-muted">empresa: {googleConfig.idEmpresa} </small>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top gap-3">
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
        <div className="d-flex justify-content-end gap-2">
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
              <button
                type="button"
                className="btn-cerrar-modal"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancelar
              </button>

              <button type="submit" className="btn-guardar" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
