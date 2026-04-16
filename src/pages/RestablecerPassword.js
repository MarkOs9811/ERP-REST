import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import "../css/EstilosLogin.css"; // Usa tus mismos estilos
import ToastAlert from "../components/componenteToast/ToastAlert";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faUnlockKeyhole,
} from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { Cargando } from "../components/componentesReutilizables/Cargando";

export const RestablecerPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Extraemos el token y el email de la URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Observamos la primera contraseña para validar que la segunda sea igual
  const currentPassword = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Enviamos TODO a Laravel: token, email y las nuevas contraseñas
      const response = await axios.post(
        "http://127.0.0.1:8000/api/reset-password",
        {
          token: token,
          email: email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
      );

      ToastAlert("success", "¡Contraseña actualizada correctamente!");

      // Esperamos 2 segundos y lo mandamos al Login para que ingrese
      setTimeout(() => {
        navigate("/login"); // Asegúrate de que esta sea tu ruta de login
      }, 2000);
    } catch (err) {
      ToastAlert(
        "error",
        err.response?.data?.message || "Error al restablecer la contraseña",
      );
    } finally {
      setLoading(false);
    }
  };

  // Si alguien entra a la ruta sin token ni correo, mostramos un error
  if (!token || !email) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Enlace no válido</h2>
        <p>Falta el token de seguridad o el correo.</p>
      </div>
    );
  }

  return (
    <div className="login-container-wrapper">
      <ToastContainer />
      <div className="login-container-grid">
        {/* COLUMNA IZQUIERDA (Marca) */}
        <div className="login-left-panel">
          <h1 className="login-brand-title">Recuperación</h1>
          <p className="login-brand-subtitle">
            Crea una nueva contraseña segura para tu cuenta.
          </p>
        </div>

        {/* COLUMNA DERECHA (Formulario) */}
        <div className="login-right-panel">
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <h2 className="login-title">Nueva Contraseña</h2>
            <p
              style={{
                color: "#666",
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
              }}
            >
              Estableciendo nueva contraseña para: <strong>{email}</strong>
            </p>

            {/* Input: Nueva Contraseña */}
            <div className="input-group-custom">
              <FontAwesomeIcon icon={faUnlockKeyhole} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control-custom ${errors.password ? "is-invalid" : ""}`}
                {...register("password", {
                  required: "La nueva contraseña es obligatoria",
                  minLength: {
                    value: 8,
                    message: "Debe tener al menos 8 caracteres",
                  },
                })}
                placeholder="Nueva Contraseña"
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
              {errors.password && (
                <div className="invalid-feedback-custom">
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="me-2"
                  />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Input: Confirmar Contraseña */}
            <div className="input-group-custom">
              <FontAwesomeIcon icon={faUnlockKeyhole} className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control-custom ${errors.password_confirmation ? "is-invalid" : ""}`}
                {...register("password_confirmation", {
                  required: "Debes confirmar tu contraseña",
                  validate: (value) =>
                    value === currentPassword || "Las contraseñas no coinciden",
                })}
                placeholder="Confirmar Contraseña"
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </span>
              {errors.password_confirmation && (
                <div className="invalid-feedback-custom">
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="me-2"
                  />
                  {errors.password_confirmation.message}
                </div>
              )}
            </div>

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn-login-submit"
                disabled={loading}
              >
                {loading ? (
                  <Cargando textColor={"white"} />
                ) : (
                  "Guardar Contraseña"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
