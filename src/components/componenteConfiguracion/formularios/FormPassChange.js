import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Save, X, CheckCircle, AlertCircle } from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";

export function FormPassChange({ onClose }) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onChange",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const newPassValue = watch("new_password", "");
  const confirmPassValue = watch("new_password_confirmation", "");

  const isValidNewPass =
    dirtyFields.new_password &&
    !errors.new_password &&
    newPassValue.length >= 8;
  const isValidConfirmPass =
    dirtyFields.new_password_confirmation &&
    !errors.new_password_confirmation &&
    confirmPassValue === newPassValue &&
    confirmPassValue.length >= 8;

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        "/miPerfilUpdate/cambiar-password",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      ToastAlert(
        "success",
        data.message || "Contraseña actualizada con éxito.",
      );
      onClose();
    },
    onError: (error) => {
      const res = error.response?.data;

      if (
        res?.message === "La contraseña actual es incorrecta" ||
        res?.errors?.current_password
      ) {
        setError("current_password", {
          type: "server",
          message:
            res?.errors?.current_password?.[0] ||
            "La contraseña actual es incorrecta",
        });
      } else {
        ToastAlert(
          "error",
          res?.message || "Error al actualizar la contraseña.",
        );
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="d-flex flex-column h-100 m-0"
    >
      <div className="flex-grow-1 p-4 d-flex flex-column gap-3">
        {/* Contraseña Actual */}
        <div className="form-group">
          <label className="text-secondary small fw-medium mb-1">
            Contraseña Actual
          </label>
          <div className="position-relative">
            <input
              type={showCurrent ? "text" : "password"}
              className={`form-control pe-5 ${errors.current_password ? "is-invalid" : ""}`}
              style={{ backgroundImage: "none" }}
              placeholder="Ingresa tu contraseña actual"
              disabled={mutation.isPending}
              {...register("current_password", {
                required: "La contraseña actual es obligatoria",
              })}
            />
            <button
              className="btn border-0 bg-transparent text-muted position-absolute top-50 end-0 translate-middle-y shadow-none"
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              style={{ zIndex: 10, paddingRight: "12px" }}
              tabIndex="-1"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Mensaje de validación debajo */}
          {errors.current_password && (
            <small className="text-danger d-flex align-items-center mt-1 gap-1">
              <AlertCircle size={14} /> {errors.current_password.message}
            </small>
          )}
        </div>

        <hr className="text-muted opacity-25 my-1" />

        {/* Nueva Contraseña */}
        <div className="form-group">
          <label className="text-secondary small fw-medium mb-1">
            Nueva Contraseña
          </label>
          <div className="position-relative">
            <input
              type={showNew ? "text" : "password"}
              className={`form-control pe-5 ${
                errors.new_password
                  ? "is-invalid"
                  : isValidNewPass
                    ? "is-valid"
                    : ""
              }`}
              style={{ backgroundImage: "none" }}
              placeholder="Mínimo 8 caracteres"
              disabled={mutation.isPending}
              {...register("new_password", {
                required: "La nueva contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "Debe tener al menos 8 caracteres",
                },
              })}
            />
            <button
              className="btn border-0 bg-transparent text-muted position-absolute top-50 end-0 translate-middle-y shadow-none"
              type="button"
              onClick={() => setShowNew(!showNew)}
              style={{ zIndex: 10, paddingRight: "12px" }}
              tabIndex="-1"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Mensajes de validación debajo */}
          {errors.new_password ? (
            <small className="text-danger d-flex align-items-center mt-1 gap-1">
              <AlertCircle size={14} /> {errors.new_password.message}
            </small>
          ) : isValidNewPass ? (
            <small className="text-success d-flex align-items-center mt-1 gap-1">
              <CheckCircle size={14} /> Contraseña válida
            </small>
          ) : null}
        </div>

        {/* Confirmar Contraseña */}
        <div className="form-group">
          <label className="text-secondary small fw-medium mb-1">
            Confirmar Nueva Contraseña
          </label>
          <div className="position-relative">
            <input
              type={showNew ? "text" : "password"}
              className={`form-control pe-5 ${
                errors.new_password_confirmation
                  ? "is-invalid"
                  : isValidConfirmPass
                    ? "is-valid"
                    : ""
              }`}
              style={{ backgroundImage: "none" }}
              placeholder="Repite la nueva contraseña"
              disabled={mutation.isPending}
              {...register("new_password_confirmation", {
                required: "Debes confirmar la nueva contraseña",
                validate: (value) =>
                  value === newPassValue || "Las contraseñas no coinciden",
              })}
            />
          </div>
          {/* Mensajes de validación debajo */}
          {errors.new_password_confirmation ? (
            <small className="text-danger d-flex align-items-center mt-1 gap-1">
              <AlertCircle size={14} />{" "}
              {errors.new_password_confirmation.message}
            </small>
          ) : isValidConfirmPass ? (
            <small className="text-success d-flex align-items-center mt-1 gap-1">
              <CheckCircle size={14} /> Las contraseñas coinciden
            </small>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-top d-flex justify-content-end bg-light flex-shrink-0">
        <button
          type="button"
          className="btn-cerrar me-2"
          onClick={onClose}
          disabled={mutation.isPending}
        >
          <X size={18} className="me-1" /> Cancelar
        </button>
        <button
          type="submit"
          className="btn-guardar d-flex align-items-center"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Procesando...
            </>
          ) : (
            <>
              <Save size={18} className="me-2" />
              Guardar Contraseña
            </>
          )}
        </button>
      </div>
    </form>
  );
}
