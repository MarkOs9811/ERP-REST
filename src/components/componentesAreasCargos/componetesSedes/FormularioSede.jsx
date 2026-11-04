import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BotonMotionGeneral } from "../../componentesReutilizables/BotonMotionGeneral";
import { useQueryClient } from "@tanstack/react-query";
import { PutData } from "../../../service/CRUD/PutData";
import { PostData } from "../../../service/CRUD/PostData";
import { Button } from "../../ui/button";

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
      className="flex flex-col h-full p-4"
    >
      <div className="grow">
        <div className="mb-3">
          <label
            htmlFor="nombre"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
          >
            Nombre de la Sede
          </label>
          <input
            id="nombre"
            type="text"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("nombre", {
              required: "El nombre es requerido",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
          />
          {errors.nombre && (
            <div className="text-sm text-destructive">
              {errors.nombre.message}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label
            htmlFor="direccion"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
          >
            Dirección
          </label>
          <input
            id="direccion"
            type="text"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.direccion ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("direccion", {
              required: "La dirección es requerida",
            })}
          />
          {errors.direccion && (
            <div className="text-sm text-destructive">
              {errors.direccion.message}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label
            htmlFor="telefono"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
          >
            Teléfono
          </label>
          <input
            id="telefono"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={9}
            placeholder="Sólo dígitos, 9 caracteres"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.telefono ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
                "text",
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
          <div className="text-sm text-muted-foreground mt-1">
            {telefonoDigits === 0 ? (
              <span className="text-muted-foreground">
                Ingresa teléfono (opcional)
              </span>
            ) : telefonoDigits === 9 ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                Teléfono válido ({telefonoDigits}/9)
              </span>
            ) : (
              <span className="text-destructive">
                Faltan {9 - telefonoDigits} dígito
                {9 - telefonoDigits !== 1 ? "s" : ""} ({telefonoDigits}/9)
              </span>
            )}
          </div>

          {errors.telefono && (
            <div className="text-sm text-destructive">
              {errors.telefono.message}
            </div>
          )}
        </div>

        {/* ... (Agrega más inputs aquí si es necesario) ... */}
      </div>

      <div className="flex justify-end gap-2 mt-auto">
        <Button
          type="button"
          className="btn-cerrar"
          onClick={onClose}
          disabled={isSubmitting || loading}
          variant="default"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="btn-guardar"
          disabled={isSubmitting || loading}
          variant="default"
        >
          {isEditMode
            ? loading
              ? "Actualizando..."
              : "Actualizar"
            : loading
              ? "Guardando..."
              : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
