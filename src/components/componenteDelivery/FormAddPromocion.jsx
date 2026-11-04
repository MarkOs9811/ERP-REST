import { useState } from "react";
import { Image, Percent, DollarSign, Calendar } from "lucide-react";
import ToastAlert from "../componenteToast/ToastAlert";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/AxiosInstance";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

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
      className="flex flex-col h-full p-4"
    >
      {/* 3. Pasamos nuestra función onSubmit al handleSubmit de react-hook-form */}

      {/* Selector de Plato */}
      <div className="mb-4">
        <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground">
          Seleccionar Plato / Combo
        </label>
        <select
          className={`h-9 w-full appearance-auto rounded-md bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-secondary ${errors.idPlato ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
          <span className="text-destructive text-sm">
            {errors.idPlato.message}
          </span>
        )}
      </div>

      {/* Título de la Promo */}
      <div className="mb-4">
        <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground">
          Título del Banner (App)
        </label>
        <input
          type="text"
          className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.titulo ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
          <span className="text-destructive text-sm">
            {errors.titulo.message}
          </span>
        )}
      </div>

      {/* Fila de Precios y Descuentos */}
      <div className="grid grid-cols-12 gap-3 mb-4">
        <div className="col-span-6">
          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground flex items-center gap-1">
            <Percent size={16} className="text-muted-foreground" />
            Descuento (%)
          </label>
          <input
            type="number"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.porcentaje_descuento ? "border-destructive focus-visible:ring-destructive" : ""}`}
            placeholder="Ej: 15"
            {...register("porcentaje_descuento", {
              required: "Ingrese un porcentaje",
              min: { value: 1, message: "Mínimo 1%" },
              max: { value: 100, message: "Máximo 100%" },
              onChange: (e) =>
                calcularDescuento(e.target.value, precioOriginal),
            })}
          />
          {errors.porcentaje_descuento && (
            <span className="text-destructive text-sm">
              {errors.porcentaje_descuento.message}
            </span>
          )}
        </div>

        <div className="col-span-6">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1">
            Precio Promo (S/)
          </label>
          <input
            type="number"
            step="0.01"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-destructive font-bold ${errors.precio_promocional ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("precio_promocional", {
              required: "El precio final es obligatorio",
              min: { value: 0.1, message: "Debe ser mayor a 0" },
            })}
          />
          {errors.precio_promocional && (
            <span className="text-destructive text-sm">
              {errors.precio_promocional.message}
            </span>
          )}
          {precioOriginal > 0 && (
            <small className="text-muted-foreground mt-1 block">
              Precio normal: S/ {precioOriginal}
            </small>
          )}
        </div>
      </div>

      {/* Fechas de Vigencia */}
      <div className="grid grid-cols-12 gap-3 mb-4">
        <div className="col-span-6">
          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground flex items-center gap-1">
            <Calendar size={16} className="text-muted-foreground" />
            Fecha Inicio
          </label>
          <input
            type="date"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.fecha_inicio ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("fecha_inicio", {
              required: "Seleccione fecha de inicio",
            })}
          />
          {errors.fecha_inicio && (
            <span className="text-destructive text-sm">
              {errors.fecha_inicio.message}
            </span>
          )}
        </div>

        <div className="col-span-6">
          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground flex items-center gap-1">
            <Calendar size={16} className="text-muted-foreground" />
            Fecha Fin
          </label>
          <input
            type="date"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.fecha_fin ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
          {errors.fecha_fin && (
            <span className="text-destructive text-sm">
              {errors.fecha_fin.message}
            </span>
          )}
        </div>
      </div>

      {/* Carga de Imagen */}
      <div className="mb-4">
        <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-foreground flex items-center gap-1">
          <Image size={16} className="text-muted-foreground" />
          Imagen del Banner
        </label>
        <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted">
          <p className="mb-0 text-muted-foreground text-sm">
            Arrastra una imagen o haz clic para subir
          </p>
          <input
            type="file"
            className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-3 ${errors.imagen_banner ? "border-destructive focus-visible:ring-destructive" : ""}`}
            accept="image/*"
            {...register("imagen_banner", {
              required: "La imagen es obligatoria para la promoción",
            })}
          />
        </div>
        {errors.imagen_banner && (
          <span className="text-destructive text-sm mt-1 block text-left">
            {errors.imagen_banner.message}
          </span>
        )}
      </div>

      {/* Controles del Footer */}
      <div className="mt-auto flex justify-end gap-2 border-t pt-3">
        <Button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          disabled={isSubmitting}
          variant="default"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="btn-guardar"
          disabled={isSubmitting}
          variant="default"
        >
          {isSubmitting ? "Guardando..." : "Guardar Promoción"}
        </Button>
      </div>
    </form>
  );
}
