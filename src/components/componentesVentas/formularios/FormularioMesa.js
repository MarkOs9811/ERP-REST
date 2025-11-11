import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

// <-- CAMBIO: Ya no importamos axios o ToastAlert aquí
// import axiosInstance from "../../../api/AxiosInstance";
// import ToastAlert from "../../componenteToast/ToastAlert";

// <-- CAMBIO: Importamos las nuevas funciones genéricas
import { PostData } from "../../../service/CRUD/PostData"; // <-- Ajusta la ruta
import { PutData } from "../../../service/CRUD/PutData"; // <-- Ajusta la ruta

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
        <label htmlFor="numero" className="form-label small">
          Número de Mesa
        </label>
        <input
          id="numero"
          type="number"
          placeholder="Ej: 5, 12, 101"
          className={`form-control ${errors.numero ? "is-invalid" : ""}`}
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
          <div className="invalid-feedback">{errors.numero.message}</div>
        )}
      </div>

      {/* Campo Capacidad */}
      <div className="mb-3">
        <label htmlFor="capacidad" className="form-label small">
          Capacidad (N° de personas)
        </label>
        <input
          id="capacidad"
          type="number"
          className={`form-control ${errors.capacidad ? "is-invalid" : ""}`}
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
          <div className="invalid-feedback">{errors.capacidad.message}</div>
        )}
      </div>

      {/* Campo Piso */}
      <div className="mb-3">
        <label htmlFor="piso" className="form-label small">
          Piso
        </label>
        <input
          id="piso"
          type="number"
          placeholder="Ej: 1, 2"
          className={`form-control ${errors.piso ? "is-invalid" : ""}`}
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
          <div className="invalid-feedback">{errors.piso.message}</div>
        )}
      </div>

      <hr className="my-4" />

      {/* Botones de acción */}
      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          title="Cerrar formulario"
        >
          Cancelar
        </button>
        <button
          type="Submit"
          className="btn-guardar"
          title={isEditMood ? "Actualizar mesa" : "Guardar mesa"}
          disabled={loadingSave}
        >
          {loadingSave ? (
            <span className="load"></span>
          ) : (
            <span>{isEditMood ? "Actualizar" : "Guardar"}</span>
          )}
        </button>
      </div>
    </form>
  );
}
