import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import "../css/EstilosLogin.css";
import ToastAlert from "../components/componenteToast/ToastAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faUnlockKeyhole,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faUser, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../AuthContext";
import { abrirCaja } from "../redux/cajaSlice";
import { useDispatch } from "react-redux";
import { Cargando } from "../components/componentesReutilizables/Cargando";
import axiosInstance from "../api/AxiosInstance";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Estados para alternar vistas y mostrar el Badge ---
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [badgeMessage, setBadgeMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extraemos 'reset' y 'clearErrors' para limpiar el formulario al cambiar de vista
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Función para cambiar de vista limpiando los errores y mensajes previos
  const toggleView = (showForgot) => {
    setIsForgotPassword(showForgot);
    setBadgeMessage({ type: "", text: "" });
    reset(); // Limpia los inputs
    clearErrors(); // Limpia las validaciones visuales
  };

  // --- Lógica original de Login ---
  const onSubmitLogin = async (data) => {
    setLoading(true); // Bloqueamos el botón y mostramos el spinner
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.token) {
        login(response.data.token, response.data.user);
        const cajaData = {
          nombre: response.data?.caja?.caja?.nombreCaja ?? "",
          id: response.data?.caja?.caja?.id ?? null,
          estado:
            response.data?.caja?.caja?.estadoCaja == 1 ? "abierto" : "cerrado",
        };
        localStorage.setItem("roles", JSON.stringify(response.data.roles));
        localStorage.setItem("caja", JSON.stringify(cajaData));
        dispatch(abrirCaja(cajaData));
        localStorage.setItem(
          "fotoPerfil",
          JSON.stringify(response.data?.user?.fotoPerfil),
        );
        localStorage.setItem("empresa", JSON.stringify(response.data?.empresa));
        localStorage.setItem(
          "estiloEmpresa",
          JSON.stringify(response.data?.estiloEmpresa),
        );

        ToastAlert("success", "Inicio de sesión exitoso");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        ToastAlert("error", "Credenciales incorrectas");
        setLoading(false); // Solo apagamos el loading si fallan las credenciales
      }
    } catch (err) {
      ToastAlert(
        "error",
        err.response
          ? err.response.data.message
          : "Error al conectar con el servidor",
      );
      setLoading(false); // Apagamos el loading si el servidor explota o devuelve error
    }
  };

  // --- Lógica de Recuperación con React Hook Form ---
  const onForgotSubmit = async (data) => {
    setLoading(true);
    setBadgeMessage({ type: "", text: "" }); // Limpiamos el badge antes de enviar

    try {
      const response = await axiosInstance.post(
        "http://127.0.0.1:8000/api/forgot-password",
        {
          email: data.resetEmail, // Usamos el input registrado en react-hook-form
        },
      );

      ToastAlert("success", "Enlace enviado exitosamente.");
      // Mostramos el badge de éxito
      setBadgeMessage({
        type: "success",
        text: "¡Listo! Hemos enviado un enlace de recuperación. Por favor, revisa tu bandeja de entrada (y la carpeta de spam).",
      });
      reset(); // Limpiamos el input después del éxito
    } catch (err) {
      let errorMsg =
        "No se pudo conectar con el servidor. Verifica tu conexión.";

      if (err.response?.status === 422 && err.response?.data?.errors?.email) {
        errorMsg = err.response.data.errors.email[0];
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      ToastAlert("error", errorMsg);
      // Mostramos el badge de error
      setBadgeMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-wrapper">
      <ToastContainer />
      <div className="login-container-grid">
        {/* === COLUMNA IZQUIERDA === */}
        <div className="login-left-panel">
          <h1 className="login-brand-title">Bienvenido</h1>
          <p className="login-brand-subtitle">
            Gestiona tu restaurante de forma eficiente.
          </p>
        </div>

        {/* === COLUMNA DERECHA (FORMULARIOS) === */}
        <div className="login-right-panel">
          {/* VISTA DE INICIO DE SESIÓN NORMAL */}
          {!isForgotPassword ? (
            <form onSubmit={handleSubmit(onSubmitLogin)} className="login-form">
              <h2 className="login-title">Iniciar Sesión</h2>

              {/* Input de Usuario */}
              <div className="input-group-custom">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="text"
                  className={`form-control-custom ${errors.email ? "is-invalid" : ""}`}
                  {...register("email", {
                    required: "El nombre de usuario o email es obligatorio",
                    minLength: {
                      value: 3,
                      message: "Debe tener al menos 3 caracteres",
                    },
                  })}
                  placeholder="Usuario o Email"
                />
                {errors.email && (
                  <div className="invalid-feedback-custom">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="me-2"
                    />
                    {errors.email.message}
                  </div>
                )}
              </div>

              {/* Input de Contraseña */}
              <div className="input-group-custom">
                <FontAwesomeIcon
                  icon={faUnlockKeyhole}
                  className="input-icon"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control-custom ${errors.password ? "is-invalid" : ""}`}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 3,
                      message: "La contraseña debe tener al menos 3 caracteres",
                    },
                  })}
                  placeholder="Contraseña"
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
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

              {/* Botón de Olvidé mi Contraseña */}
              <div className="text-end mt-2">
                <span
                  onClick={() => toggleView(true)}
                  style={{
                    color: "#1a1a1a",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                  className="forgot-password-link"
                >
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              {/* Botón de Ingresar */}
              <div className="d-grid mt-3">
                <button
                  type="submit"
                  className="btn-login-submit"
                  disabled={loading}
                >
                  {loading ? <Cargando textColor={"white"} /> : "Ingresar"}
                </button>
              </div>
            </form>
          ) : (
            /* --- VISTA DE RECUPERAR CONTRASEÑA --- */
            <form
              onSubmit={handleSubmit(onForgotSubmit)}
              className="login-form"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    color: "#555",
                  }}
                  onClick={() => toggleView(false)}
                />
                <h2 className="login-title" style={{ margin: 0 }}>
                  Recuperar Acceso
                </h2>
              </div>

              <p
                style={{
                  color: "#666",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                }}
              >
                Ingresa tu correo electrónico y te enviaremos un enlace para
                restablecer tu contraseña.
              </p>

              {/* Input de Correo con React Hook Form */}
              <div className="input-group-custom">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="email"
                  className={`form-control-custom ${errors.resetEmail ? "is-invalid" : ""}`}
                  {...register("resetEmail", {
                    required: "Por favor, ingresa tu correo electrónico.",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Ingresa un correo electrónico válido",
                    },
                  })}
                  placeholder="Ingresa tu Email"
                />
                {errors.resetEmail && (
                  <div className="invalid-feedback-custom">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="me-2"
                    />
                    {errors.resetEmail.message}
                  </div>
                )}
              </div>

              {/* --- Badge Dinámico para Respuestas --- */}
              {badgeMessage.text && (
                <div
                  className={`alert mt-3 p-3 text-center ${badgeMessage.type === "success" ? "alert-success" : "alert-danger"}`}
                  style={{
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    border: "none",
                  }}
                >
                  <FontAwesomeIcon
                    icon={
                      badgeMessage.type === "success"
                        ? faUnlockKeyhole
                        : faExclamationCircle
                    }
                    className="me-2"
                  />
                  {badgeMessage.text}
                </div>
              )}

              <div className="d-grid mt-4">
                <button
                  type="submit"
                  className="btn-login-submit"
                  disabled={loading}
                >
                  {loading ? <Cargando textColor={"white"} /> : "Enviar Enlace"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
