import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

// <-- CAMBIO: Ya no importamos axios o ToastAlert aquí
// import axiosInstance from "../../../api/AxiosInstance";
// import ToastAlert from "../../componenteToast/ToastAlert";

// <-- CAMBIO: Importamos las nuevas funciones genéricas
import { PostData } from "../../../service/CRUD/PostData"; // <-- Ajusta la ruta
import { PutData } from "../../../service/CRUD/PutData";
import { Button } from "../../ui/button"; // <-- Ajusta la ruta

/**
 * Formulario para Agregar o Editar Mesas.
 */
export function FormularioMesa({ onClose, isEdit, dataEdit = null }) {
  const [loadingSave, setLoadingSave] = useState(false);
  const queryClient = useQueryClient();
  const isEditMood = Boolean(isEdit);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      numero: dataEdit?.numero || "",
      capacidad: dataEdit?.capacidad || 1,
      piso: dataEdit?.piso || 1,
    },
  });

  const onSubmit = async (data) => {
    setLoadingSave(true);
    let exito = false;

    if (isEditMood) {
      exito = await PutData("mesas", dataEdit.id, data);
    } else {
      exito = await PostData("mesas", data);
    }

    setLoadingSave(false);
    if (exito) {
      queryClient.invalidateQueries(["mesas"]);
      onClose();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      {/* Campo Número */}
      <div className="mb-3">
        <label
          htmlFor="numero"
          className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
        >
          Número de Mesa
        </label>
        <input
          id="numero"
          type="number"
          placeholder="Ej: 5, 12, 101"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.numero ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("numero", {
            required: "El número es obligatorio",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "El número de mesa debe ser al menos 1",
            },
          })}
        />
        {errors.numero && (
          <div className="text-sm text-destructive">
            {errors.numero.message}
          </div>
        )}
      </div>

      {/* Campo Capacidad */}
      <div className="mb-3">
        <label
          htmlFor="capacidad"
          className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
        >
          Capacidad (N° de personas)
        </label>
        <input
          id="capacidad"
          type="number"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.capacidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("capacidad", {
            required: "La capacidad es obligatoria",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "La capacidad debe ser al menos 1",
            },
          })}
        />
        {errors.capacidad && (
          <div className="text-sm text-destructive">
            {errors.capacidad.message}
          </div>
        )}
      </div>

      {/* Campo Piso */}
      <div className="mb-3">
        <label
          htmlFor="piso"
          className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
        >
          Piso
        </label>
        <input
          id="piso"
          type="number"
          placeholder="Ej: 1, 2"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.piso ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("piso", {
            required: "El piso es obligatorio",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "El piso debe ser al menos 1",
            },
          })}
        />
        {errors.piso && (
          <div className="text-sm text-destructive">{errors.piso.message}</div>
        )}
      </div>

      <hr className="my-4" />

      {/* Botones de acción */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          title="Cerrar formulario"
          variant="default"
        >
          Cancelar
        </Button>
        <Button
          type="Submit"
          className="btn-guardar"
          title={isEditMood ? "Actualizar mesa" : "Guardar mesa"}
          disabled={loadingSave}
          variant="default"
        >
          {loadingSave ? (
            <span className="load"></span>
          ) : (
            <span>{isEditMood ? "Actualizar" : "Guardar"}</span>
          )}
        </Button>
      </div>
    </form>
  );
}
