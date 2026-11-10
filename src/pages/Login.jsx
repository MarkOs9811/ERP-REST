import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Contextos, Redux y Utils
import { useAuth } from "../AuthContext";
import { abrirCaja } from "../redux/cajaSlice";
import { Cargando } from "../components/componentesReutilizables/Cargando";
import axiosInstance from "../api/AxiosInstance";
import ToastAlert from "../components/componenteToast/ToastAlert";

// Componentes UI de shadcn
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [badgeMessage, setBadgeMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isForgotPassword = searchParams.get("recuperar") === "1";
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const resetFormForViewChange = () => {
    setBadgeMessage({ type: "", text: "" });
    reset();
    clearErrors();
  };

  // --- Lógica de Login con Control de Sesión ---
  const onSubmitLogin = async (data) => {
    setLoading(true);
    try {
      // const response = await axios.post("http://erp-api.test/api/login", {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.token) {
        login(response.data.token, response.data.user, data.rememberMe);
        const storage = data.rememberMe ? localStorage : sessionStorage;

        const cajaData = {
          nombre: response.data?.caja?.caja?.nombreCaja ?? "",
          id: response.data?.caja?.caja?.id ?? null,
          estado:
            response.data?.caja?.caja?.estadoCaja === 1 ? "abierto" : "cerrado",
        };

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
        setTimeout(() => navigate("/"), 2000);
      } else {
        ToastAlert(
          "error",
          response.data.message || "Credenciales incorrectas",
        );
        setLoading(false);
      }
    } catch (err) {
      let errorMsg = "Error al conectar con el servidor";
      if (err.response) {
        if (typeof err.response.data === "string") {
          errorMsg = `Error del servidor (Código HTTP ${err.response.status})`;
        } else {
          errorMsg =
            err.response.data.message ||
            err.response.data.error ||
            `Ocurrió un error (HTTP ${err.response.status})`;
        }
      }
      ToastAlert("error", errorMsg);
      setLoading(false);
    }
  };

  // --- Lógica de Recuperación de Contraseña ---
  const onForgotSubmit = async (data) => {
    setLoading(true);
    setBadgeMessage({ type: "", text: "" });

    try {
      await axiosInstance.post("http://erp-api.test/api/forgot-password", {
        email: data.resetEmail,
      });
      ToastAlert("success", "Enlace enviado exitosamente.");
      setBadgeMessage({
        type: "success",
        text: "Enlace de recuperación enviado. Revisa tu bandeja de entrada.",
      });
      reset();
    } catch (err) {
      let errorMsg = "No se pudo conectar con el servidor.";
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 text-zinc-900 md:p-8">
      <ToastContainer />

      <div className="w-full max-w-4xl">
        <Card className="flex w-full flex-col overflow-hidden rounded-xl border-zinc-200 shadow-sm md:flex-row md:h-137.5 p-0">
          {/* COLUMNA IZQUIERDA: FORMULARIOS */}
          <div className="flex w-full flex-col justify-center  p-8 md:w-1/2 md:p-12">
            {!isForgotPassword ? (
              /* --- FORMULARIO DE LOGIN --- */
              <form
                onSubmit={handleSubmit(onSubmitLogin)}
                className="mx-auto flex w-full max-w-90 flex-col justify-center space-y-6"
              >
                <div className="flex flex-col space-y-2 text-center mb-2">
                  <h3 className="text-3xl font-semibold tracking-tight">
                    ¡Te damos la bienvenida!
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Inicia sesión para acceder a tu cuenta.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Correo electrónico */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      className={errors.email ? "text-red-500" : ""}
                    >
                      Correo electrónico
                    </Label>
                    <Input
                      id="login-email"
                      type="text"
                      placeholder="usuario@ejemplo.com"
                      className={`h-9 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      {...register("email", {
                        required:
                          "El usuario o correo electrónico es obligatorio",
                      })}
                    />
                  </div>

                  {/* Contraseña y recuperación de acceso */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="login-password"
                        className={errors.password ? "text-red-500" : ""}
                      >
                        Contraseña
                      </Label>
                      <Link
                        to="/login?recuperar=1"
                        onClick={resetFormForViewChange}
                        className="rounded-sm text-xs font-medium text-zinc-700 underline-offset-4 transition-colors hover:text-zinc-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        className={`h-9 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        {...register("password", {
                          required: "La contraseña es obligatoria",
                        })}
                      />
                      <Button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                        variant="default"
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          className="text-xs"
                        />
                      </Button>
                    </div>
                  </div>

                  {/* Mantener la sesión iniciada */}
                  <div className="flex items-center space-x-2 pt-1">
                    <Controller
                      name="rememberMe"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="rememberMe"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4"
                        />
                      )}
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="text-xs font-normal cursor-pointer text-zinc-600"
                    >
                      Recordar mi sesión
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black rounded text-white hover:bg-zinc-800 h-9"
                  variant="default"
                >
                  {loading ? <Cargando textColor="white" /> : "Iniciar sesión"}
                </Button>
              </form>
            ) : (
              /* --- FORMULARIO DE RECUPERACIÓN --- */
              <form
                onSubmit={handleSubmit(onForgotSubmit)}
                className="mx-auto flex w-full max-w-90 flex-col justify-center space-y-6"
              >
                <div className="flex flex-col space-y-2 text-center mb-2">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Recupera tu contraseña
                  </h1>
                  <p className="text-sm text-zinc-500">
                    Te enviaremos un enlace para restablecerla.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="reset-email"
                      className={errors.resetEmail ? "text-red-500" : ""}
                    >
                      Correo electrónico
                    </Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      className={`h-9 ${errors.resetEmail ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      {...register("resetEmail", {
                        required: "El correo electrónico es obligatorio",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "El correo electrónico no es válido",
                        },
                      })}
                    />
                    {errors.resetEmail && (
                      <span className="text-xs text-red-500">
                        {errors.resetEmail.message}
                      </span>
                    )}
                  </div>
                </div>

                {badgeMessage.text && (
                  <Alert
                    variant={
                      badgeMessage.type === "success"
                        ? "default"
                        : "destructive"
                    }
                    className={`py-2 ${badgeMessage.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : ""}`}
                  >
                    <AlertDescription className="text-xs">
                      {badgeMessage.text}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-zinc-800 h-9"
                  variant="default"
                >
                  {loading ? <Cargando textColor="white" /> : "Enviar enlace"}
                </Button>

                <div className="text-center text-sm">
                  <Link
                    to="/login"
                    onClick={resetFormForViewChange}
                    className="rounded-sm text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Volver a iniciar sesión
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* COLUMNA DERECHA: IMAGEN (Ajustada para no deformar la tarjeta) */}
          <div className="hidden w-full bg-zinc-100 md:block md:w-1/2 relative">
            <img
              src="../../images/placeholder.jpg"
              alt="Fondo de login"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Card>
      </div>

      {/* TEXTO INFERIOR */}
      <div className="mt-8 text-center text-sm text-zinc-500 max-w-md mx-auto">
        Al continuar, aceptas nuestros{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-zinc-900"
        >
          Términos del servicio
        </a>{" "}
        y{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-zinc-900"
        >
          Política de privacidad
        </a>
        .
      </div>
    </main>
  );
};
