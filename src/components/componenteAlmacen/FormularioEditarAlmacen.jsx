import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Calendar, Box, CardSimIcon } from "lucide-react";
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
        cantidad: data.cantidad,
        precioUnit: data.precioUnit,
        unidad: data.unidad.id, // Cambiado a id
        categoria: data.categoria.id, // Cambiado a id
        proveedor: data.proveedor.id, // Cambiado a id
        presentacion: data.presentacion,
        fecha_vencimiento: data.fecha_vencimiento,
        registro_sanitario: data.registro_sanitario,
      });
    }
  }, [data, reset]);

  const onSubmitForm = async (formData) => {
    try {
      const response = await axiosInstance.put(
        `/almacen/${formData.id}`,
        formData,
      );
      if (response.data.success) {
        ToastAlert("success", "Producto actualizado exitosamente");
        setIsLoading(false);
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
          ? Object.values(errors)[0]
          : "Error de validación";
        ToastAlert("error", errorMessage);
      } else {
        ToastAlert("error", "Error al actualizar el producto");
      }
    }
  };

  return (
    <div className="bg-muted p-3">
      <Card asChild>
        <form onSubmit={handleSubmit(onSubmitForm)} className="shadow-sm p-3">
          <div className="grid grid-cols-12 gap-3">
            {/* ID */}
            <div className="col-span-full md:col-span-6 mb-3">
              <input
                type="hidden"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.id ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled
                {...register("id")}
              />
            </div>

            {/* Nombre del Producto */}
            <div className="col-span-full md:col-span-12 mb-3">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="nombreProducto"
              >
                Nombre del Producto*
              </label>
              <input
                id="nombreProducto"
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.nombre ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("nombre", {
                  required: "El nombre del producto es requerido",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
                  },
                })}
              />
              {errors.nombre && (
                <div className="text-sm text-destructive">
                  {errors.nombre.message}
                </div>
              )}
            </div>

            {/* Marca */}
            <div className="col-span-full md:col-span-6 mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Marca*
              </label>
              <input
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.marca ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("marca", {
                  required: "La marca es requerida",
                })}
              />
              {errors.marca && (
                <div className="text-sm text-destructive">
                  {errors.marca.message}
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="col-span-full md:col-span-6 mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Stock*
              </label>
              <input
                type="number"
                disabled={true}
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.cantidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("cantidad", {
                  required: "La cantidad es requerida",
                  min: {
                    value: 0,
                    message: "La cantidad no puede ser negativa",
                  },
                })}
              />
              {errors.cantidad && (
                <div className="text-sm text-destructive">
                  {errors.cantidad.message}
                </div>
              )}
              <small className="text-muted-foreground">
                El stock no se puede editar directamente. Use la opción de
                Agregar Stock.
              </small>
            </div>

            {/* Precio Unitario */}
            <div className="col-span-full md:col-span-6 mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Precio Unitario (S/.)*
              </label>
              <input
                type="number"
                step="0.01"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
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
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Ingrese un precio válido con máximo 2 decimales",
                  },
                })}
              />
              {errors.precioUnit && (
                <div className="text-sm text-destructive">
                  {errors.precioUnit.message}
                </div>
              )}
            </div>

            {/* Unidad de Medida */}
            <div className="col-span-full md:col-span-6 mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Unidad de Medida*
              </label>
              <select
                className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.unidad ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("unidad", {
                  required: "La unidad de medida es requerida",
                })}
                defaultValue={data?.unidad?.id || ""} // Agregamos defaultValue
              >
                <option value="">Seleccione una unidad</option>
                {unidadData.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre}
                  </option>
                ))}
              </select>
              {errors.unidad && (
                <div className="text-sm text-destructive">
                  {errors.unidad.message}
                </div>
              )}
            </div>

            {/* Categoría */}
            <div className="col-span-full md:col-span-6 mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Categoría*
              </label>
              <select
                className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.categoria ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("categoria", {
                  required: "La categoría es requerida",
                })}
                defaultValue={data?.categoria?.id || ""} // Agregamos defaultValue
              >
                <option value="">Seleccione una categoría</option>
                {categoriaData.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <div className="text-sm text-destructive">
                  {errors.categoria.message}
                </div>
              )}
            </div>

            {/* Proveedor */}
            <div className="col-span-full md:col-span-6 mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Proveedor*
              </label>
              <select
                className={`h-9 w-full appearance-auto rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.proveedor ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("proveedor", {
                  required: "El proveedor es requerido",
                })}
                defaultValue={data?.proveedor?.id || ""} // Agregamos defaultValue
              >
                <option value="">Seleccione un proveedor</option>
                {proveedorData.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
              {errors.proveedor && (
                <div className="text-sm text-destructive">
                  {errors.proveedor.message}
                </div>
              )}
            </div>

            {/* Presentación */}
            <div className="col-span-full md:col-span-6 mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 gap-2">
                <Box size={16} />
                Presentación*
              </label>
              <input
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.presentacion
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                placeholder="Ej: Caja x 12 unidades"
                {...register("presentacion", {
                  required: "La presentación es requerida",
                  minLength: {
                    value: 3,
                    message: "La presentación debe tener al menos 3 caracteres",
                  },
                })}
              />
              {errors.presentacion && (
                <div className="text-sm text-destructive">
                  {errors.presentacion.message}
                </div>
              )}
            </div>

            {/* Fecha de Vencimiento */}
            <div className="col-span-full md:col-span-6 mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <Calendar size={16} />
                Fecha de Vencimiento*
              </label>
              <input
                type="date"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
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
                <div className="text-sm text-destructive">
                  {errors.fecha_vencimiento.message}
                </div>
              )}
            </div>

            {/* Registro Sanitario */}
            <div className="col-span-full md:col-span-6 mb-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <CardSimIcon size={16} />
                Registro Sanitario*
              </label>
              <input
                type="text"
                className={`h-9 w-full rounded-md border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.registro_sanitario
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                placeholder="Ej: RS-XXXX-XXXXX"
                {...register("registro_sanitario", {
                  required: "El registro sanitario es requerido",
                })}
              />
              {errors.registro_sanitario && (
                <div className="text-sm text-destructive">
                  {errors.registro_sanitario.message}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-3 gap-3">
            <Button
              type="button"
              className="btn-cerrar-modal"
              onClick={onCancel}
              variant="default"
            >
              Cancelar
            </Button>
            <Button type="submit" className="btn-guardar" variant="default">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
