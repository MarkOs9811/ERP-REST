import { useState } from "react";
import { Image, Percent, DollarSign, Calendar } from "lucide-react";
import ToastAlert from "../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";
import { useForm } from "react-hook-form";

export function FormAddPromocion({ onClose, platos }) {
  const queryClient = useQueryClient();
  const [precioOriginal, setPrecioOriginal] = useState(0);

  // 1. Inicializamos useForm
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      idPlato: "",
      titulo: "",
      porcentaje_descuento: "",
      precio_promocional: "",
      fecha_inicio: "",
      fecha_fin: "",
    },
  });

  // Función auxiliar para calcular el descuento
  const calcularDescuento = (porcentaje, precioBase) => {
    if (porcentaje && precioBase > 0) {
      const descuento = precioBase * (porcentaje / 100);
      const precioFinal = precioBase - descuento;
      // Seteamos el valor dinámicamente en react-hook-form
      setValue("precio_promocional", precioFinal.toFixed(2), {
        shouldValidate: true,
      });
    }
  };

  // 2. Función que recibe la "data" ya validada por react-hook-form
  const onSubmit = async (data) => {
    const dataToSend = new FormData();

    dataToSend.append("idPlato", data.idPlato);
    dataToSend.append("titulo", data.titulo);
    dataToSend.append("porcentaje_descuento", data.porcentaje_descuento);
    dataToSend.append("precio_promocional", data.precio_promocional);
    dataToSend.append("fecha_inicio", data.fecha_inicio);
    dataToSend.append("fecha_fin", data.fecha_fin);

    // react-hook-form guarda los archivos en un FileList (array)
    if (data.imagen_banner && data.imagen_banner.length > 0) {
      dataToSend.append("imagen_banner", data.imagen_banner[0]);
    }

    try {
      const response = await axiosInstance.post(
        "/delivery/promociones",
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        ToastAlert("success", "Promoción registrada correctamente");
        queryClient.invalidateQueries(["promocionesApp"]);
        reset();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al conectar con el servidor";
      ToastAlert("error", errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="d-flex flex-column h-100 p-4"
    >
      {/* 3. Pasamos nuestra función onSubmit al handleSubmit de react-hook-form */}

      {/* Selector de Plato */}
      <div className="mb-4">
        <label className="form-label fw-medium text-dark">
          Seleccionar Plato / Combo
        </label>
        <select
          className={`form-select border-secondary  ${errors.idPlato ? "is-invalid" : ""}`}
          {...register("idPlato", {
            required: "Por favor selecciona un plato",
            onChange: (e) => {
              const platoId = e.target.value;
              const platoSeleccionado = platos?.find(
                (p) => p.id === parseInt(platoId),
              );

              if (platoSeleccionado) {
                setPrecioOriginal(platoSeleccionado.precio);
                // Autocompletamos el título
                setValue("titulo", `Promo ${platoSeleccionado.nombre}`, {
                  shouldValidate: true,
                });

                // Recalculamos si ya había un porcentaje ingresado
                const pctActual = getValues("porcentaje_descuento");
                calcularDescuento(pctActual, platoSeleccionado.precio);
              } else {
                setPrecioOriginal(0);
                setValue("titulo", "");
              }
            },
          })}
        >
          <option value="">-- Elige un producto del menú --</option>
          {platos?.map((plato) => (
            <option key={plato.id} value={plato.id}>
              {plato.nombre} (S/ {plato.precio})
            </option>
          ))}
        </select>
        {errors.idPlato && (
          <span className="text-danger small">{errors.idPlato.message}</span>
        )}
      </div>

      {/* Título de la Promo */}
      <div className="mb-4">
        <label className="form-label fw-medium text-dark">
          Título del Banner (App)
        </label>
        <input
          type="text"
          className={`form-control  ${errors.titulo ? "is-invalid" : ""}`}
          placeholder="Ej: Jueves de Locura 2x1"
          {...register("titulo", {
            required: "El título es obligatorio",
            minLength: {
              value: 5,
              message: "El título debe tener al menos 5 caracteres",
            },
          })}
        />
        {errors.titulo && (
          <span className="text-danger small">{errors.titulo.message}</span>
        )}
      </div>

      {/* Fila de Precios y Descuentos */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label fw-medium text-dark">
            Descuento (%)
          </label>
          <div className="input-group ">
            <span className="input-group-text bg-white">
              <Percent size={16} className="text-muted" />
            </span>
            <input
              type="number"
              className={`form-control ${errors.porcentaje_descuento ? "is-invalid" : ""}`}
              placeholder="Ej: 15"
              {...register("porcentaje_descuento", {
                required: "Ingrese un porcentaje",
                min: { value: 1, message: "Mínimo 1%" },
                max: { value: 100, message: "Máximo 100%" },
                onChange: (e) =>
                  calcularDescuento(e.target.value, precioOriginal),
              })}
            />
          </div>
          {errors.porcentaje_descuento && (
            <span className="text-danger small">
              {errors.porcentaje_descuento.message}
            </span>
          )}
        </div>

        <div className="col-6">
          <label className="form-label fw-medium text-dark">
            Precio Promo (S/)
          </label>
          <div className="input-group ">
            <span className="input-group-text bg-white">S/.</span>
            <input
              type="number"
              step="0.01"
              className={`form-control text-danger fw-bold ${errors.precio_promocional ? "is-invalid" : ""}`}
              {...register("precio_promocional", {
                required: "El precio final es obligatorio",
                min: { value: 0.1, message: "Debe ser mayor a 0" },
              })}
            />
          </div>
          {errors.precio_promocional && (
            <span className="text-danger small">
              {errors.precio_promocional.message}
            </span>
          )}
          {precioOriginal > 0 && (
            <small className="text-muted mt-1 d-block">
              Precio normal: S/ {precioOriginal}
            </small>
          )}
        </div>
      </div>

      {/* Fechas de Vigencia */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <label className="form-label fw-medium text-dark">Fecha Inicio</label>
          <div className="input-group ">
            <span className="input-group-text bg-white">
              <Calendar size={16} />
            </span>
            <input
              type="date"
              className={`form-control ${errors.fecha_inicio ? "is-invalid" : ""}`}
              {...register("fecha_inicio", {
                required: "Seleccione fecha de inicio",
              })}
            />
          </div>
          {errors.fecha_inicio && (
            <span className="text-danger small">
              {errors.fecha_inicio.message}
            </span>
          )}
        </div>

        <div className="col-6">
          <label className="form-label fw-medium text-dark">Fecha Fin</label>
          <div className="input-group ">
            <span className="input-group-text bg-white">
              <Calendar size={16} />
            </span>
            <input
              type="date"
              className={`form-control ${errors.fecha_fin ? "is-invalid" : ""}`}
              {...register("fecha_fin", {
                required: "Seleccione fecha de fin",
                validate: (value) => {
                  const inicio = getValues("fecha_inicio");
                  return (
                    !inicio ||
                    value >= inicio ||
                    "La fecha fin no puede ser menor a la inicial"
                  );
                },
              })}
            />
          </div>
          {errors.fecha_fin && (
            <span className="text-danger small">
              {errors.fecha_fin.message}
            </span>
          )}
        </div>
      </div>

      {/* Carga de Imagen */}
      <div className="mb-4">
        <label className="form-label fw-medium text-dark">
          Imagen del Banner
        </label>
        <div className="border border-2 border-dashed rounded-3 p-4 text-center bg-light">
          <Image size={32} className="text-muted mb-2" />
          <p className="mb-0 text-muted small">
            Arrastra una imagen o haz clic para subir
          </p>
          <input
            type="file"
            className={`form-control mt-3 ${errors.imagen_banner ? "is-invalid" : ""}`}
            accept="image/*"
            {...register("imagen_banner", {
              required: "La imagen es obligatoria para la promoción",
            })}
          />
        </div>
        {errors.imagen_banner && (
          <span className="text-danger small mt-1 d-block text-start">
            {errors.imagen_banner.message}
          </span>
        )}
      </div>

      {/* Controles del Footer */}
      <div className="mt-auto d-flex justify-content-end gap-2 border-top pt-3">
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-guardar" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Promoción"}
        </button>
      </div>
    </form>
  );
}
