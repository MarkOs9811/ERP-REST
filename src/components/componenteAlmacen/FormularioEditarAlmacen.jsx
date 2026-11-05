import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Calendar,
  Box,
  CardSimIcon,
  FlaskConical,
  Hash,
  AlignLeft,
} from "lucide-react";
import axiosInstance from "../../api/AxiosInstance";
import ToastAlert from "../componenteToast/ToastAlert";
import { GetCategoria } from "../../service/serviceAlmacen/GetCategoria";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetUnidades } from "../../service/serviceAlmacen/GetUnidades";
import { GetProveedores } from "../../service/GetProveedores";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";

export function FormularioEditarAlmacen({ data, onCancel }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { data: categoriaData = [], isLoading: isLoadingCategorias } = useQuery(
    {
      queryKey: ["categorias"],
      queryFn: GetCategoria,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  );
  const { data: unidadData = [], isLoading: isLoadingUnidad } = useQuery({
    queryKey: ["unidad"],
    queryFn: GetUnidades,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const { data: proveedorData = [], isLoading: isLoadingProveedor } = useQuery({
    queryKey: ["proveedor"],
    queryFn: GetProveedores,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        nombre: data.nombre,
        marca: data.marca,
        descripcion: data.descripcion || "", // Nuevo campo
        cantidad: data.cantidad,
        precioUnit: data.precioUnit,
        unidad: data.unidad?.id || "",
        categoria: data.categoria?.id || "",
        proveedor: data.proveedor?.id || "",
        presentacion: data.presentacion,
        laboratorio: data.laboratorio || "", // Nuevo campo
        lote: data.lote || "", // Nuevo campo
        fecha_vencimiento: data.fecha_vencimiento,
        registro_sanitario: data.registro_sanitario,
      });
    }
  }, [data, reset]);

  const onSubmitForm = async (formData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        `/almacen/${formData.id}`,
        formData,
      );
      if (response.data.success) {
        ToastAlert("success", "Producto actualizado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["almacen"] });
        onCancel();
      } else {
        ToastAlert(
          "error",
          response.data.message || "Error al actualizar el producto",
        );
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessage = errors
          ? Object.values(errors)[0][0] // Para mostrar el primer mensaje exacto de Laravel
          : "Error de validación";
        ToastAlert("error", errorMessage);
      } else {
        ToastAlert("error", "Error al actualizar el producto");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" p-3">
      <form onSubmit={handleSubmit(onSubmitForm)} className="p-3">
        <div className="grid grid-cols-12 gap-3">
          {/* ID */}
          <div className="col-span-full md:col-span-6 mb-3 hidden">
            <input type="hidden" disabled {...register("id")} />
          </div>

          {/* Nombre del Producto */}
          <div className="col-span-full md:col-span-12 mb-3">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex gap-2 items-center mb-1"
              htmlFor="nombreProducto"
            >
              Nombre del Producto*
            </label>
            <input
              id="nombreProducto"
              type="text"
              className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("nombre", {
                required: "El nombre del producto es requerido",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
              })}
            />
            {errors.nombre && (
              <div className="text-sm text-destructive mt-1">
                {errors.nombre.message}
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="col-span-full md:col-span-12 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex gap-2 items-center mb-1">
              <AlignLeft size={16} /> Descripción
            </label>
            <textarea
              className={`flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.descripcion ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="Descripción detallada del producto (Opcional)"
              {...register("descripcion", {
                maxLength: {
                  value: 255,
                  message: "La descripción no puede superar los 255 caracteres",
                },
              })}
            />
            {errors.descripcion && (
              <div className="text-sm text-destructive mt-1">
                {errors.descripcion.message}
              </div>
            )}
          </div>

          {/* Marca */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block">
              Marca*
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.marca ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("marca", {
                required: "La marca es requerida",
              })}
            />
            {errors.marca && (
              <div className="text-sm text-destructive mt-1">
                {errors.marca.message}
              </div>
            )}
          </div>

          {/* Laboratorio */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex gap-2 items-center mb-1">
              <FlaskConical size={16} /> Laboratorio*
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.laboratorio ? "border-destructive focus-visible:ring-destructive" : ""}`}
              placeholder="Ej: Bayer / N/A"
              {...register("laboratorio", {
                required: "El laboratorio es requerido",
              })}
            />
            {errors.laboratorio && (
              <div className="text-sm text-destructive mt-1">
                {errors.laboratorio.message}
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block">
              Stock*
            </label>
            <input
              type="number"
              disabled={true}
              className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.cantidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("cantidad", {
                required: "La cantidad es requerida",
                min: {
                  value: 0,
                  message: "La cantidad no puede ser negativa",
                },
              })}
            />
            <small className="text-muted-foreground mt-1 block">
              Use la opción de Agregar Stock.
            </small>
          </div>

          {/* Precio Unitario */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block">
              Precio Unitario (S/.)*
            </label>
            <input
              type="number"
              step="0.01"
              className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.precioUnit
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("precioUnit", {
                required: "El precio unitario es requerido",
                min: {
                  value: 0,
                  message: "El precio no puede ser negativo",
                },
              })}
            />
            {errors.precioUnit && (
              <div className="text-sm text-destructive mt-1">
                {errors.precioUnit.message}
              </div>
            )}
          </div>

          {/* Unidad de Medida */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block">
              Unidad de Medida*
            </label>
            <select
              className={`h-9 w-full appearance-auto rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.unidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("unidad", {
                required: "La unidad de medida es requerida",
              })}
              defaultValue={data?.unidad?.id || ""}
            >
              <option value="">Seleccione una unidad</option>
              {unidadData.map((unidad) => (
                <option key={unidad.id} value={unidad.id}>
                  {unidad.nombre}
                </option>
              ))}
            </select>
            {errors.unidad && (
              <div className="text-sm text-destructive mt-1">
                {errors.unidad.message}
              </div>
            )}
          </div>

          {/* Categoría */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block">
              Categoría*
            </label>
            <select
              className={`h-9 w-full appearance-auto rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.categoria ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("categoria", {
                required: "La categoría es requerida",
              })}
              defaultValue={data?.categoria?.id || ""}
            >
              <option value="">Seleccione una categoría</option>
              {categoriaData.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <div className="text-sm text-destructive mt-1">
                {errors.categoria.message}
              </div>
            )}
          </div>

          {/* Proveedor */}
          <div className="col-span-full md:col-span-12 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block">
              Proveedor*
            </label>
            <select
              className={`h-9 w-full appearance-auto rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.proveedor ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("proveedor", {
                required: "El proveedor es requerido",
              })}
              defaultValue={data?.proveedor?.id || ""}
            >
              <option value="">Seleccione un proveedor</option>
              {proveedorData.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
            {errors.proveedor && (
              <div className="text-sm text-destructive mt-1">
                {errors.proveedor.message}
              </div>
            )}
          </div>

          {/* Presentación */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 mb-1">
              <Box size={16} />
              Presentación*
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.presentacion
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              placeholder="Ej: Caja x 12 / Unidad"
              {...register("presentacion", {
                required: "La presentación es requerida",
              })}
            />
            {errors.presentacion && (
              <div className="text-sm text-destructive mt-1">
                {errors.presentacion.message}
              </div>
            )}
          </div>

          {/* Lote */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 mb-1">
              <Hash size={16} />
              Lote*
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.lote
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              placeholder="Ej: LT-1234 / N/A"
              {...register("lote", {
                required: "El lote es requerido",
              })}
            />
            {errors.lote && (
              <div className="text-sm text-destructive mt-1">
                {errors.lote.message}
              </div>
            )}
          </div>

          {/* Fecha de Vencimiento */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 mb-1">
              <Calendar size={16} />
              Fecha de Vencimiento*
            </label>
            <input
              type="date"
              className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.fecha_vencimiento
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              {...register("fecha_vencimiento", {
                required: "La fecha de vencimiento es requerida",
                validate: (value) => {
                  const fecha = new Date(value);
                  const hoy = new Date();
                  return fecha > hoy || "La fecha debe ser posterior a hoy";
                },
              })}
            />
            {errors.fecha_vencimiento && (
              <div className="text-sm text-destructive mt-1">
                {errors.fecha_vencimiento.message}
              </div>
            )}
          </div>

          {/* Registro Sanitario */}
          <div className="col-span-full md:col-span-6 mb-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 mb-1">
              <CardSimIcon size={16} />
              Registro Sanitario*
            </label>
            <input
              type="text"
              className={`h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.registro_sanitario
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
              placeholder="Ej: RS-XXXX / N/A"
              {...register("registro_sanitario", {
                required: "El registro sanitario es requerido",
              })}
            />
            {errors.registro_sanitario && (
              <div className="text-sm text-destructive mt-1">
                {errors.registro_sanitario.message}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-3">
          <Button
            type="button"
            className="btn-cerrar-modal"
            onClick={onCancel}
            variant="outline"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" className="btn-guardar" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
