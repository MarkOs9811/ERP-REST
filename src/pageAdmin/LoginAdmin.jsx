import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../api/AxiosInstance";
import ToastAlert from "../components/componenteToast/ToastAlert";

export function LoginAdmin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await AxiosInstance.post("/login/superadmin", data);
      const { token, user, message } = res.data || {};

      if (token) {
        localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
        ToastAlert("success", "Inicio de sesión exitoso");
        navigate("/masterAdmin/home");
        return true;
      } else {
        ToastAlert("error", message);
        return false;
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al conectar con el servidor";
      ToastAlert("error", msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "50px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
    },
    formGroup: { marginBottom: "15px" },
    label: { display: "block", marginBottom: "5px" },
    input: { width: "100%", padding: "8px", boxSizing: "border-box" },
    error: { color: "red", fontSize: "0.8em", marginTop: "5px" },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Panel SuperAdmin</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            style={styles.input}
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "El formato del email no es válido",
              },
            })}
            aria-invalid={errors.email ? "true" : "false"}
            disabled={isLoading}
          />
          {errors.email && (
            <span style={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            style={styles.input}
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
            })}
            aria-invalid={errors.password ? "true" : "false"}
            disabled={isLoading}
          />
          {errors.password && (
            <span style={styles.error}>{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={isLoading || isSubmitting || !isValid}
          aria-busy={isLoading}
        >
          {isLoading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}
