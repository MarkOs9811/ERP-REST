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
} from "@fortawesome/free-solid-svg-icons";
import { faUser, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../AuthContext";
import { abrirCaja } from "../redux/cajaSlice";
import { useDispatch } from "react-redux";
import { Cargando } from "../components/componentesReutilizables/Cargando";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // --- Tu lógica de 'onSubmit' (sin cambios) ---
  const onSubmit = async (data) => {
    if (errors.email || errors.password) return;
    setLoading(true);

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
          JSON.stringify(response.data?.user?.fotoPerfil)
        );
        localStorage.setItem("empresa", JSON.stringify(response.data?.empresa));

        ToastAlert("success", "Inicio de sesión exitoso");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        ToastAlert("error", "Credenciales incorrectas");
      }
    } catch (err) {
      ToastAlert(
        "error",
        err.response
          ? err.response.data.message
          : "Error al conectar con el servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-wrapper">
      <ToastContainer />
      <div className="login-container-grid">
        {/* === COLUMNA IZQUIERDA (MARCA CON TU IMAGEN) === */}
        <div className="login-left-panel">
          <img
            src="/images/LOGO.svg"
            alt="Logo Fire Wok"
            className="login-logo"
          />
          <h1 className="login-brand-title">Bienvenido a Fire Wok</h1>
          <p className="login-brand-subtitle">
            Gestiona tu restaurante de forma eficiente.
          </p>
        </div>

        {/* === COLUMNA DERECHA (FORMULARIO) === */}
        <div className="login-right-panel">
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <h2 className="login-title">Iniciar Sesión</h2>

            {/* --- Input de Usuario (Rediseñado) --- */}
            <div className="input-group-custom">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                className={`form-control-custom ${
                  errors.email ? "is-invalid" : ""
                }`}
                {...register("email", {
                  required: "El nombre de usuario es obligatorio",
                  minLength: {
                    value: 3,
                    message:
                      "El nombre de usuario debe tener al menos 3 caracteres",
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

            {/* --- Input de Contraseña (Rediseñado) --- */}
            <div className="input-group-custom">
              <FontAwesomeIcon icon={faUnlockKeyhole} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control-custom ${
                  errors.password ? "is-invalid" : ""
                }`}
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

            {/* --- Botón de Ingresar (Rediseñado) --- */}
            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn-login-submit"
                disabled={loading}
              >
                {loading ? <Cargando textColor={"white"} /> : "Ingresar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
