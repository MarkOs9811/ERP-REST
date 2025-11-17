import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";
import { useQueryClient } from "@tanstack/react-query";
import { PutData } from "../../../service/CRUD/PutData";
import { PostData } from "../../../service/CRUD/PostData";

/**
 * Formulario para Crear o Editar una Sede.
 */
export function FormularioSede({ onClose, sede }) {
  const isEditMode = Boolean(sede);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      nombre: "",
      direccion: "",
      telefono: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      reset({
        nombre: sede?.nombre || "",
        direccion: sede?.direccion || "",
        telefono: sede?.telefono || "",
      });
    } else {
      reset({ nombre: "", direccion: "", telefono: "" });
    }
  }, [sede, isEditMode, reset]);

  const telefonoValue = watch("telefono") || "";
  const telefonoDigits = telefonoValue.replace(/\D/g, "").length;

  const onSubmit = async (data) => {
    setLoading(true);
    let exito = false;
    try {
      if (isEditMode) {
        exito = await PutData("sedes", sede.id, data);
      } else {
        exito = await PostData("sedes", data);
      }

      if (exito) {
        await queryClient.invalidateQueries(["sedes"]);
        onClose();
      }
    } catch (err) {
      console.error("Error al guardar sede:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="d-flex flex-column h-100 p-4"
    >
      <div className="flex-grow-1">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label fw-bold">
            Nombre de la Sede
          </label>
          <input
            id="nombre"
            type="text"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            {...register("nombre", {
              required: "El nombre es requerido",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
          />
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="direccion" className="form-label fw-bold">
            Dirección
          </label>
          <input
            id="direccion"
            type="text"
            className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
            {...register("direccion", {
              required: "La dirección es requerida",
            })}
          />
          {errors.direccion && (
            <div className="invalid-feedback">{errors.direccion.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="telefono" className="form-label fw-bold">
            Teléfono
          </label>
          <input
            id="telefono"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={9}
            placeholder="Sólo dígitos, 9 caracteres"
            className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
            {...register("telefono", {
              required: false,
              validate: (value) =>
                value === "" ||
                value.replace(/\D/g, "").length === 9 ||
                "El teléfono debe contener exactamente 9 dígitos",
            })}
            onInput={(e) => {
              // eliminar cualquier carácter que no sea dígito y actualizar el valor en react-hook-form
              const onlyDigits = e.currentTarget.value
                .replace(/\D/g, "")
                .slice(0, 9);
              setValue("telefono", onlyDigits, {
                shouldValidate: true,
                shouldDirty: true,
              });
              // sincronizar lo que se muestra en el input
              e.currentTarget.value = onlyDigits;
            }}
            onPaste={(e) => {
              // evitar pegar texto con letras; pegar sólo dígitos
              const paste = (e.clipboardData || window.clipboardData).getData(
                "text"
              );
              const onlyDigits = paste.replace(/\D/g, "").slice(0, 9);
              e.preventDefault();
              setValue("telefono", onlyDigits, {
                shouldValidate: true,
                shouldDirty: true,
              });
              const input = document.getElementById("telefono");
              if (input) input.value = onlyDigits;
            }}
          />
          {/* Indicador en tiempo real */}
          <div className="form-text mt-1">
            {telefonoDigits === 0 ? (
              <span className="text-muted">Ingresa teléfono (opcional)</span>
            ) : telefonoDigits === 9 ? (
              <span className="text-success">
                Teléfono válido ({telefonoDigits}/9)
              </span>
            ) : (
              <span className="text-danger">
                Faltan {9 - telefonoDigits} dígito
                {9 - telefonoDigits !== 1 ? "s" : ""} ({telefonoDigits}/9)
              </span>
            )}
          </div>

          {errors.telefono && (
            <div className="invalid-feedback">{errors.telefono.message}</div>
          )}
        </div>

        {/* ... (Agrega más inputs aquí si es necesario) ... */}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-auto">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={isSubmitting || loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-guardar"
          disabled={isSubmitting || loading}
        >
          {isEditMode
            ? loading
              ? "Actualizando..."
              : "Actualizar"
            : loading
            ? "Guardando..."
            : "Guardar"}
        </button>
      </div>
    </form>
  );
}
