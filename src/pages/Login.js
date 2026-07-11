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

  const toggleView = (showForgot) => {
    setIsForgotPassword(showForgot);
    setBadgeMessage({ type: "", text: "" });
    reset();
    clearErrors();
  };

  // --- Lógica de Login con Control de Sesión ---
  const onSubmitLogin = async (data) => {
    setLoading(true);
    try {
      // const response = await axios.post(
      //   //   // "https://erp-api-production-c7d4.up.railway.app/api/login",
      //   // "http://127.0.0.1:8000/api/login",
      //   {
      const response = await axios.post("http://erp-api.test/api/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.token) {
        // 1. Enviamos el valor del checkbox a tu AuthContext
        login(response.data.token, response.data.user, data.rememberMe);

        // 2. Definimos dónde vamos a guardar el resto de la info (Local o Session)
        const storage = data.rememberMe ? localStorage : sessionStorage;

        const cajaData = {
          nombre: response.data?.caja?.caja?.nombreCaja ?? "",
          id: response.data?.caja?.caja?.id ?? null,
          estado:
            response.data?.caja?.caja?.estadoCaja === 1 ? "abierto" : "cerrado",
        };

        // 3. Guardamos TODO en la bóveda elegida
        storage.setItem("roles", JSON.stringify(response.data.roles));
        storage.setItem("caja", JSON.stringify(cajaData));
        storage.setItem(
          "fotoPerfil",
          JSON.stringify(response.data?.user?.fotoPerfil),
        );
        storage.setItem("empresa", JSON.stringify(response.data?.empresa));
        storage.setItem(
          "estiloEmpresa",
          JSON.stringify(response.data?.estiloEmpresa),
        );

        dispatch(abrirCaja(cajaData));

        ToastAlert("success", "Inicio de sesión exitoso");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        ToastAlert("error", "Credenciales incorrectas");
        setLoading(false);
      }
    } catch (err) {
      ToastAlert(
        "error",
        err.response
          ? err.response.data.message
          : "Error al conectar con el servidor",
      );
      setLoading(false);
    }
  };

  const onForgotSubmit = async (data) => {
    setLoading(true);
    setBadgeMessage({ type: "", text: "" });

    try {
      // await axiosInstance.post("http://127.0.0.1:8000/api/forgot-password", {
      await axiosInstance.post("http://erp-api.test/api/forgot-password", {
        email: data.resetEmail,
      });

      ToastAlert("success", "Enlace enviado exitosamente.");
      setBadgeMessage({
        type: "success",
        text: "¡Listo! Hemos enviado un enlace de recuperación. Por favor, revisa tu bandeja de entrada (y la carpeta de spam).",
      });
      reset();
    } catch (err) {
      let errorMsg =
        "No se pudo conectar con el servidor. Verifica tu conexión.";

      if (err.response?.status === 422 && err.response?.data?.errors?.email) {
        errorMsg = err.response.data.errors.email[0];
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      ToastAlert("error", errorMsg);
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
          <div className="login-left-panel-content">
            <div className="login-brand-pill">ERP</div>
            <h1 className="login-brand-title">Bienvenido</h1>
            <p className="login-brand-subtitle">
              Gestiona tu restaurante de forma eficiente.
            </p>
            <div className="login-brand-badges">
              <span>Pedidos</span>
              <span>Inventario</span>
              <span>Caja</span>
            </div>
          </div>
        </div>

        {/* === COLUMNA DERECHA (FORMULARIOS) === */}
        <div className="login-right-panel">
          {!isForgotPassword ? (
            <form onSubmit={handleSubmit(onSubmitLogin)} className="login-form">
              <div className="login-form-body">
                <div className="login-form-header">
                  <div className="login-brand-pill login-brand-pill--small">
                    ERP
                  </div>
                  <span className="login-form-eyebrow">
                    Panel de administración
                  </span>
                </div>
                <h2 className="login-title text-center">Iniciar Sesión</h2>

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
                        message:
                          "La contraseña debe tener al menos 3 caracteres",
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

                {/* Controles Inferiores */}
                <div className="login-options-row">
                  {/* Checkbox Recordar Sesión */}
                  <div className="form-check d-flex align-items-center gap-2 m-0 p-0">
                    <input
                      className="form-check-input m-0 shadow-none"
                      type="checkbox"
                      id="rememberMe"
                      style={{ cursor: "pointer" }}
                      {...register("rememberMe")}
                    />
                    <label
                      className="form-check-label login-remember-label"
                      htmlFor="rememberMe"
                    >
                      Recordar sesión
                    </label>
                  </div>

                  {/* Enlace Olvidar Contraseña */}
                  <span
                    onClick={() => toggleView(true)}
                    className="forgot-password-link m-0"
                  >
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>

                {/* Botón de Ingresar */}
                <div className="login-submit-wrapper">
                  <button
                    type="submit"
                    className="btn-login-submit"
                    disabled={loading}
                  >
                    {loading ? <Cargando textColor={"white"} /> : "Ingresar"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* --- VISTA DE RECUPERAR CONTRASEÑA --- */
            <form
              onSubmit={handleSubmit(onForgotSubmit)}
              className="login-form"
            >
              <div className="login-form-body">
                <div className="login-form-header login-form-header--back">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="forgot-back-icon"
                    onClick={() => toggleView(false)}
                  />
                  <div>
                    <span className="login-form-eyebrow">Recuperación</span>
                    <h2 className="login-title login-title--compact">
                      Recuperar Acceso
                    </h2>
                  </div>
                </div>

                <p className="login-help-text">
                  Ingresa tu correo electrónico y te enviaremos un enlace para
                  restablecer tu contraseña.
                </p>

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

                <div className="login-submit-wrapper">
                  <button
                    type="submit"
                    className="btn-login-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <Cargando textColor={"white"} />
                    ) : (
                      "Enviar Enlace"
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
