import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Save, X, CheckCircle, AlertCircle } from "lucide-react";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { Button } from "../../ui/button";

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
      className="flex flex-col h-full m-0"
    >
      <div className="grow p-4 flex flex-col gap-3">
        {/* Contraseña Actual */}
        <div className="form-group">
          <label className="text-muted-foreground text-sm font-medium mb-1">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pe-5 ${errors.current_password ? "border-destructive focus-visible:ring-destructive" : ""}`}
              style={{ backgroundImage: "none" }}
              placeholder="Ingresa tu contraseña actual"
              disabled={mutation.isPending}
              {...register("current_password", {
                required: "La contraseña actual es obligatoria",
              })}
            />
            <Button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 border-0 bg-transparent text-muted-foreground absolute top-1/2 right-0 -translate-y-1/2 shadow-none"
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              style={{ zIndex: 10, paddingRight: "12px" }}
              tabIndex="-1"
              variant="default"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
          {/* Mensaje de validación debajo */}
          {errors.current_password && (
            <small className="text-destructive flex items-center mt-1 gap-1">
              <AlertCircle size={14} /> {errors.current_password.message}
            </small>
          )}
        </div>

        <hr className="text-muted-foreground opacity-25 my-1" />

        {/* Nueva Contraseña */}
        <div className="form-group">
          <label className="text-muted-foreground text-sm font-medium mb-1">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pe-5 ${
                errors.new_password
                  ? "border-destructive focus-visible:ring-destructive"
                  : isValidNewPass
                    ? "border-emerald-500 focus-visible:ring-emerald-500"
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
            <Button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 border-0 bg-transparent text-muted-foreground absolute top-1/2 right-0 -translate-y-1/2 shadow-none"
              type="button"
              onClick={() => setShowNew(!showNew)}
              style={{ zIndex: 10, paddingRight: "12px" }}
              tabIndex="-1"
              variant="default"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
          {/* Mensajes de validación debajo */}
          {errors.new_password ? (
            <small className="text-destructive flex items-center mt-1 gap-1">
              <AlertCircle size={14} /> {errors.new_password.message}
            </small>
          ) : isValidNewPass ? (
            <small className="text-emerald-600 dark:text-emerald-400 flex items-center mt-1 gap-1">
              <CheckCircle size={14} /> Contraseña válida
            </small>
          ) : null}
        </div>

        {/* Confirmar Contraseña */}
        <div className="form-group">
          <label className="text-muted-foreground text-sm font-medium mb-1">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pe-5 ${
                errors.new_password_confirmation
                  ? "border-destructive focus-visible:ring-destructive"
                  : isValidConfirmPass
                    ? "border-emerald-500 focus-visible:ring-emerald-500"
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
            <small className="text-destructive flex items-center mt-1 gap-1">
              <AlertCircle size={14} />{" "}
              {errors.new_password_confirmation.message}
            </small>
          ) : isValidConfirmPass ? (
            <small className="text-emerald-600 dark:text-emerald-400 flex items-center mt-1 gap-1">
              <CheckCircle size={14} /> Las contraseñas coinciden
            </small>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t flex justify-end bg-muted shrink-0">
        <Button
          type="button"
          className="btn-cerrar me-2"
          onClick={onClose}
          disabled={mutation.isPending}
          variant="default"
        >
          <X size={18} className="me-1" /> Cancelar
        </Button>
        <Button
          type="submit"
          className="btn-guardar flex items-center"
          disabled={mutation.isPending}
          variant="default"
        >
          {mutation.isPending ? (
            <>
              <span
                className="inline-block animate-spin rounded-full border-current border-r-transparent size-4 me-2"
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
        </Button>
      </div>
    </form>
  );
}
