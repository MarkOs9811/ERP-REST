import { Axios } from "axios";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/AxiosInstance";
import ToastAlert from "../../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";

export function EditCombo({ dataCombo }) {
  const queryCliente = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: dataCombo.nombre,
      descripcion: dataCombo.descripcion,
      precio: dataCombo.precio,
    },
  });

  const onSubmit = async (formData) => {
    try {
      const response = await axiosInstance.put(
        `/combos/${dataCombo.id}`,
        formData
      );
      if (response.data.success) {
        ToastAlert("success", "Combo actualizado con éxito");
        queryCliente.invalidateQueries({ queryKey: ["combos"] });
      } else {
        ToastAlert("error", "Error al actualizar el combo");
      }
    } catch (error) {
      console.error("Error updating combo:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4"> {dataCombo.nombre}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Nombre */}
        <div className="mb-3">
          <label className="form-label small">Nombre</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            {...register("nombre", {
              required: "El nombre es obligatorio",
              maxLength: {
                value: 100,
                message: "El nombre no debe superar los 100 caracteres",
              },
            })}
          />
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre.message}</div>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label className="form-label small ">Descripción</label>
          <textarea
            rows="3"
            className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
            {...register("descripcion", {
              required: "La descripción es obligatoria",
              maxLength: {
                value: 255,
                message: "La descripción no debe superar los 255 caracteres",
              },
            })}
          ></textarea>
          {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion.message}</div>
          )}
        </div>

        {/* Precio */}
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="text"
            className={`form-control ${errors.precio ? "is-invalid" : ""}`}
            {...register("precio", {
              required: "El precio es obligatorio",
              validate: (value) => {
                const regex = /^\d+(?:[.,]\d{1,2})?$/;
                return regex.test(value) || "Formato de precio inválido";
              },
            })}
            onInput={(e) => {
              // Reemplazar múltiples puntos o comas por solo uno
              e.target.value = e.target.value
                .replace(/[,\.]{2,}/g, ".") // evita que pongan varios seguidos
                .replace(/(,|\.){2,}/g, ".") // normaliza a un único separador
                .replace(/(,|\.)+(?=.*[,\.])/g, "."); // asegura un solo separador decimal
            }}
          />

          {errors.precio && (
            <div className="invalid-feedback">{errors.precio.message}</div>
          )}
        </div>

        {/* Botón */}
        <button type="submit" className="btn-guardar">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
