import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { SaveAll, FileText, PenTool, CheckCircle2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetProveedores } from "../../service/GetProveedores";
import { Button } from "../ui/button";

export function AlmacenRegister() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      transferir_inventario: false, // Valor por defecto del interruptor
    },
  });

  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const isTransfering = watch("transferir_inventario");

  const fetchCategorias = async () => {
    try {
      const response = await axiosInstance.get("/categorias");
      if (response.data.success) {
        setCategorias(response.data.data);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const fetchUnidades = async () => {
    try {
      const response = await axiosInstance.get("/unidadMedida");
      if (response.data.success) {
        setUnidades(response.data.data);
      }
    } catch (error) {
      console.error("Error al obtener unidades:", error);
    }
  };

  const { data: dataProveedores = [] } = useQuery({
    queryKey: ["proveedores"],
    queryFn: GetProveedores,
  });

  useEffect(() => {
    fetchCategorias();
    fetchUnidades();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        if (key === "pdf_file" || key === "image_file") {
          if (data[key] && data[key][0]) {
            formData.append(key, data[key][0]);
          }
        } else if (key === "transferir_inventario") {
          // Convertimos el booleano a 1 o 0 para Laravel
          formData.append(key, data[key] ? 1 : 0);
        } else {
          // Evitar adjuntar campos undefined o nulos vacíos
          if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
          }
        }
      }

      const response = await axiosInstance.post("/almacen/save", formData);

      if (response.data.success) {
        ToastAlert(
          "success",
          response.data.message || "Registrado correctamente",
        );
        reset();
        // Opcional: Invalida las queries si tienes tablas escuchando
        queryClient.invalidateQueries(["almacenes"]);
        if (data.transferir_inventario) {
          queryClient.invalidateQueries(["inventario"]);
        }
      } else {
        ToastAlert("error", "Ocurrió un error al guardar");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Error de conexión al servidor";
      ToastAlert("error", errorMsg);
      console.error("Error al enviar el formulario:", error);
    }
  };

  // Clases base para inputs reutilizables (Estilo Shadcn)
  const inputClass =
    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const labelClass =
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1.5 block";
  const errorClass = "text-[0.8rem] font-medium text-destructive mt-1";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto space-y-6 pb-8"
    >
      {/* SECCIÓN 1: DATOS PRINCIPALES */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="flex flex-col space-y-1.5 p-6 border-b bg-muted/20">
          <h3 className="font-semibold leading-none tracking-tight text-lg">
            Información del Producto
          </h3>
          <p className="text-sm text-muted-foreground">
            Ingrese los detalles generales para el almacén.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8">
            <label className={labelClass}>Nombre Producto/Activo *</label>
            <input
              type="text"
              className={`${inputClass} ${errors.nombreProducto ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="Ej: Paracetamol 500mg"
              {...register("nombreProducto", {
                required: "El nombre es obligatorio",
              })}
            />
            {errors.nombreProducto && (
              <p className={errorClass}>{errors.nombreProducto.message}</p>
            )}
          </div>

          <div className="md:col-span-4">
            <label className={labelClass}>Marca *</label>
            <input
              type="text"
              className={`${inputClass} ${errors.marca ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="Marca del producto"
              {...register("marca", { required: "La marca es obligatoria" })}
            />
            {errors.marca && (
              <p className={errorClass}>{errors.marca.message}</p>
            )}
          </div>

          <div className="md:col-span-4">
            <label className={labelClass}>Laboratorio</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Ej: Bayer"
              {...register("laboratorio")}
            />
          </div>

          <div className="md:col-span-4">
            <label className={labelClass}>Presentación *</label>
            <input
              type="text"
              className={`${inputClass} ${errors.presentacion ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="Ej: Caja x 100"
              {...register("presentacion", {
                required: "La presentación es obligatoria",
              })}
            />
            {errors.presentacion && (
              <p className={errorClass}>{errors.presentacion.message}</p>
            )}
          </div>

          <div className="md:col-span-4">
            <label className={labelClass}>Reg. Sanitario</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Opcional"
              {...register("registro_sanitario")}
            />
          </div>

          <div className="md:col-span-12">
            <label className={labelClass}>Descripción *</label>
            <textarea
              rows={2}
              className={`flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${errors.descripcion ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="Breve descripción del producto..."
              {...register("descripcion", {
                required: "La descripción es obligatoria",
              })}
            />
            {errors.descripcion && (
              <p className={errorClass}>{errors.descripcion.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: INVENTARIO Y CATEGORIZACIÓN */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-4">
            <label className={labelClass}>Cantidad *</label>
            <input
              type="number"
              className={`${inputClass} ${errors.cantidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="0"
              {...register("cantidad", {
                required: "La cantidad es obligatoria",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.cantidad && (
              <p className={errorClass}>{errors.cantidad.message}</p>
            )}
          </div>

          <div className="md:col-span-4">
            <label className={labelClass}>Precio Unitario (S/.) *</label>
            <input
              type="number"
              step="0.01"
              className={`${inputClass} ${errors.precioUnit ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="0.00"
              {...register("precioUnit", {
                required: "El precio es obligatorio",
                min: { value: 0, message: "No puede ser negativo" },
              })}
            />
            {errors.precioUnit && (
              <p className={errorClass}>{errors.precioUnit.message}</p>
            )}
          </div>

          <div className="md:col-span-4">
            <label className={labelClass}>Fecha de Vencimiento</label>
            <input
              type="date"
              className={inputClass}
              {...register("fecha_vencimiento")}
            />
          </div>

          <div className="md:col-span-3">
            <label className={labelClass}>Lote</label>
            <input
              type="text"
              className={inputClass}
              placeholder="LT-..."
              {...register("lote")}
            />
          </div>

          <div className="md:col-span-3">
            <label className={labelClass}>Categoría *</label>
            <select
              className={`${inputClass} appearance-auto ${errors.categoria ? "border-destructive" : ""}`}
              {...register("categoria", { required: "Requerido" })}
            >
              <option value="">Seleccione...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className={errorClass}>{errors.categoria.message}</p>
            )}
          </div>

          <div className="md:col-span-3">
            <label className={labelClass}>Unidad de Medida *</label>
            <select
              className={`${inputClass} appearance-auto ${errors.unidad ? "border-destructive" : ""}`}
              {...register("unidad", { required: "Requerido" })}
            >
              <option value="">Seleccione...</option>
              {unidades.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.nombre}
                </option>
              ))}
            </select>
            {errors.unidad && (
              <p className={errorClass}>{errors.unidad.message}</p>
            )}
          </div>

          <div className="md:col-span-3">
            <label className={labelClass}>Proveedor *</label>
            <select
              className={`${inputClass} appearance-auto ${errors.proveedor ? "border-destructive" : ""}`}
              {...register("proveedor", { required: "Requerido" })}
            >
              <option value="">Seleccione...</option>
              {dataProveedores
                .filter((prov) => prov.estado == 1)
                .map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
            </select>
            {errors.proveedor && (
              <p className={errorClass}>{errors.proveedor.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: DOCUMENTACIÓN Y FIRMAS */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Documento Respaldo (PDF) *
              </div>
            </label>
            <input
              type="file"
              accept="application/pdf"
              className={`${inputClass} pt-1 ${errors.pdf_file ? "border-destructive" : ""}`}
              {...register("pdf_file")}
            />
            {errors.pdf_file && (
              <p className={errorClass}>{errors.pdf_file.message}</p>
            )}
            <p className="text-[0.8rem] text-muted-foreground">
              Cargue la guía o factura (Máx 10MB).
            </p>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-muted-foreground" />
                Firma de Conformidad (Imagen) *
              </div>
            </label>
            <input
              type="file"
              accept="image/*"
              className={`${inputClass} pt-1 ${errors.image_file ? "border-destructive" : ""}`}
              {...register("image_file", {})}
            />
            {errors.image_file && (
              <p className={errorClass}>{errors.image_file.message}</p>
            )}
            <p className="text-[0.8rem] text-muted-foreground">
              Imagen de la firma (JPG/PNG). No debe ser pesada.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: INTERRUPTOR Y GUARDAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Switch personalizado con Tailwind */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <Controller
              name="transferir_inventario"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <div
              className={`block w-11 h-6 rounded-full transition-colors ${isTransfering ? "bg-primary" : "bg-muted-foreground/30"}`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${isTransfering ? "translate-x-5" : "translate-x-0"}`}
            ></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              Transferir a Inventario
            </span>
            <span className="text-[0.8rem] text-muted-foreground">
              {isTransfering
                ? "El stock ingresará al almacén y pasará directo a ventas."
                : "El stock se quedará en el almacén central."}
            </span>
          </div>
        </label>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto flex items-center gap-2 px-8"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : isTransfering ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <SaveAll className="w-4 h-4" />
          )}
          {isSubmitting
            ? "Guardando..."
            : isTransfering
              ? "Guardar y Transferir"
              : "Guardar en Almacén"}
        </Button>
      </div>
    </form>
  );
}
