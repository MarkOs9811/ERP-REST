import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form"; // Importamos react-hook-form
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
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import RippleWrapper from "../components/componentesReutilizables/RippleWrapper";
import { ArrowBigRight } from "lucide-react";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Inicializamos useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    if (errors.email || errors.password) return; // Verifica si hay errores
    setLoading(true);
    try {
      //cambiar  la url cuando el backend estè en produccion o servidor
      const response = await axios.post("http://erp-api.test/api/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("roles", JSON.stringify(response.data.roles));
        localStorage.setItem(
          "fotoPerfil",
          JSON.stringify(response.data.user.fotoPerfil)
        );
        localStorage.setItem(
          "miEmpresa",
          JSON.stringify(response.data.miEmpresa)
        );

        console.log(response.data.user.fotoPerfil);
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
    <div className="container-fluid login-container p-0">
      <div className="row w-100 p-0 m-0">
        <div className="col-md-8 login-left p-0">
          <div className="overlay">
            {/* <p className="h1">Fire Wok</p> */}
            <img
              src="/images/LOGO.svg"
              alt="logo"
              width={350}
              style={{ position: "relative" }}
            />
          </div>
          <div className="border-0 my-3 p-3 rounded-0 card-asistencia">
            <a href="/tomarAsistencia" className="btn-asistencia p-3">
              <span>
                <ArrowBigRight color={"auto"} />
                Ir asistencia
              </span>
            </a>
          </div>
        </div>

        <div className="col-md-4 login-right p-5">
          <ToastContainer />
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <h2 className="text-center">Iniciar Sesión</h2>

            <div className="mb-4">
              <div className="form-floating mb-4 position-relative">
                <input
                  type="text"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  {...register("email", {
                    required: "El nombre de usuario es obligatorio",
                    minLength: {
                      value: 3,
                      message:
                        "El nombre de usuario debe tener al menos 3 caracteres",
                    },
                  })}
                  placeholder=" "
                />
                <label>
                  <FontAwesomeIcon icon={faUser} /> Usuario
                </label>
                {errors.email && (
                  <div className="invalid-feedback d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="me-2"
                    />
                    {errors.email.message}
                  </div>
                )}
              </div>

              <div className="form-floating position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 3,
                      message: "La contraseña debe tener al menos 3 caracteres",
                    },
                  })}
                  placeholder=" "
                />
                <label>
                  <FontAwesomeIcon icon={faUnlockKeyhole} /> Contraseña
                </label>
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="text-secondary"
                  />
                </span>
                {errors.password && (
                  <div className="invalid-feedback d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="me-2"
                    />
                    {errors.password.message}
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-center align-items-center w-100 m-auto mb-3">
              <button
                type="submit"
                className="login-form button-normal-login"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Ingresar"}
              </button>
            </div>
            <p className="ms-auto text-center">ó</p>
            <div className="d-flex justify-content-center align-items-center w-100 m-auto">
              <RippleWrapper className="rounded">
                <button
                  type="button"
                  id="google-signin-btn"
                  className="btn-google"
                  onClick={() => {
                    window.location.href =
                      "https://6a876a5ef21b.ngrok-free.app/api/auth/google/redirect"; //Cambiar URl de mi bbackend
                  }}
                >
                  <FontAwesomeIcon icon={faGoogle} className="mx-2" />
                  Iniciar sesión con Google
                </button>
              </RippleWrapper>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
